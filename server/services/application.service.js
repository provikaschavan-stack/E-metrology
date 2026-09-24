const appModel = require('../models/application.model');
const instrumentModel = require('../models/instrument.model');
const CertificateService = require('./certificate.service');
const db = require('../config/db');
const { generateAppNumber } = require('../config/db');

const VALID_TYPES = ['VERIFICATION', 'RE_VERIFICATION'];

const VALID_STATUSES = [
  'SUBMITTED', 'ASSIGNED', 'SCHEDULED',
  'FIELD_VERIFICATION', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'
];

// Allowed status transitions per role
const TRANSITIONS = {
  BUSINESS: { to: [] }, // BUSINESS cannot manually transition status
  ADMIN: { to: VALID_STATUSES },
  LMO: { to: ['FIELD_VERIFICATION', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'] },
  GATC: { to: ['FIELD_VERIFICATION', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'] }
};

const STAFF_STATUS_TRANSITIONS = {
  SCHEDULED: ['FIELD_VERIFICATION'],
  FIELD_VERIFICATION: ['UNDER_REVIEW'],
  UNDER_REVIEW: ['APPROVED', 'REJECTED']
};

async function submitApplication(user, body) {
  const { instrument_id, application_type, remarks } = body;

  if (!instrument_id || !application_type) {
    throw { status: 400, message: 'instrument_id and application_type are required' };
  }

  const type = application_type.toUpperCase();
  if (!VALID_TYPES.includes(type)) {
    throw { status: 400, message: `Invalid application_type. Allowed: ${VALID_TYPES.join(', ')}` };
  }

  // Resolve instrument — accepts instrument DB id or INS- code
  const instrument = await instrumentModel.findById(instrument_id);
  if (!instrument) {
    throw { status: 404, message: `Instrument '${instrument_id}' not found` };
  }

  // BUSINESS: can only apply for their own instruments
  if (user.role === 'BUSINESS' && instrument.owner_id !== user.id) {
    throw { status: 403, message: 'Forbidden: You can only apply for your own instruments' };
  }

  const application_number = generateAppNumber();
  const created = await appModel.create({
    application_number,
    instrument_id: instrument.id,
    applicant_id: user.id,
    application_type: type,
    remarks: remarks || null
  });

  return created;
}

async function getApplications(user) {
  if (user.role === 'BUSINESS') return appModel.findByApplicant(user.id);
  if (user.role === 'LMO' || user.role === 'GATC') return appModel.findByAssignee(user.id);
  return appModel.findAll(); // ADMIN sees all
}

async function getApplicationById(user, id) {
  const app = await appModel.findById(id);
  if (!app) throw { status: 404, message: `Application '${id}' not found` };

  // BUSINESS: only their own
  if (user.role === 'BUSINESS' && app.applicant_id !== user.id) {
    throw { status: 403, message: 'Forbidden: Access denied to this application' };
  }
  // LMO/GATC: only assigned to them
  if ((user.role === 'LMO' || user.role === 'GATC') && app.assigned_to !== user.id) {
    throw { status: 403, message: 'Forbidden: This application is not assigned to you' };
  }

  return app;
}

async function trackApplication(appNumber) {
  const app = await appModel.findById(appNumber);
  if (!app) throw { status: 404, message: `Application '${appNumber}' not found` };
  return {
    application_number: app.application_number,
    application_type: app.application_type,
    status: app.status,
    instrument_code: app.instrument_code || app.instrument_id_ref,
    instrument_type: app.instrument_type,
    scheduled_date: app.scheduled_date,
    created_at: app.created_at,
    updated_at: app.updated_at,
    remarks: app.remarks
  };
}

async function updateApplication(user, id, body) {
  const app = await appModel.findById(id);
  if (!app) throw { status: 404, message: `Application '${id}' not found` };

  // LMO/GATC: only assigned to them
  if ((user.role === 'LMO' || user.role === 'GATC') && app.assigned_to !== user.id) {
    throw { status: 403, message: 'Forbidden: This application is not assigned to you' };
  }

  const { status, remarks, scheduled_date } = body;
  if (!status && !remarks && !scheduled_date) {
    throw { status: 400, message: 'At least one field (status, remarks, scheduled_date) is required for update' };
  }

  if (status) {
    const newStatus = status.toUpperCase();
    if (!VALID_STATUSES.includes(newStatus)) {
      throw { status: 400, message: `Invalid status. Allowed: ${VALID_STATUSES.join(', ')}` };
    }

    // Enforce RBAC transitions
    const allowed = TRANSITIONS[user.role]?.to || [];
    if (!allowed.includes(newStatus)) {
      throw { status: 403, message: `Your role '${user.role}' cannot set status to '${newStatus}'` };
    }

    if (['LMO', 'GATC'].includes(user.role) && !STAFF_STATUS_TRANSITIONS[app.status]?.includes(newStatus)) {
      throw { status: 400, message: `Invalid workflow transition from '${app.status}' to '${newStatus}'` };
    }

    if (newStatus === 'APPROVED') {
      await CertificateService.generateCertificateForApplication(app.id);
    }

    await appModel.updateStatus(app.id, newStatus, remarks || null);
  } else if (remarks) {
    await appModel.updateStatus(app.id, app.status, remarks);
  }

  if (scheduled_date) {
    await appModel.schedule(app.id, scheduled_date, remarks || null);
  }

  return appModel.findById(app.id);
}

async function assignApplication(user, id, body) {
  if (user.role !== 'ADMIN') {
    throw { status: 403, message: 'Forbidden: Only ADMIN can assign applications to officers' };
  }

  const app = await appModel.findById(id);
  if (!app) throw { status: 404, message: `Application '${id}' not found` };

  if (!['SUBMITTED', 'ASSIGNED'].includes(app.status)) {
    throw { status: 400, message: `Cannot assign an application with status '${app.status}'` };
  }

  const { assigned_to, remarks } = body;
  if (!assigned_to) throw { status: 400, message: 'assigned_to (user id) is required' };

  // Verify assignee exists and has LMO/GATC role
  const officerRes = await db.query(
    'SELECT id, name, role FROM users WHERE id = $1',
    [assigned_to]
  );
  const officer = officerRes.rows[0];
  if (!officer) throw { status: 404, message: `Officer with id '${assigned_to}' not found` };
  if (!['LMO', 'GATC'].includes(officer.role)) {
    throw { status: 400, message: `Assignments can only be made to LMO or GATC officers. User role: '${officer.role}'` };
  }

  const updated = await appModel.assign(app.id, parseInt(assigned_to, 10), remarks || null);
  return updated;
}

async function scheduleApplication(user, id, body) {
  if (!['ADMIN', 'LMO', 'GATC'].includes(user.role)) {
    throw { status: 403, message: 'Forbidden: Only ADMIN, LMO, or GATC can schedule inspections' };
  }

  const app = await appModel.findById(id);
  if (!app) throw { status: 404, message: `Application '${id}' not found` };

  // LMO/GATC can only schedule their own assignments
  if ((user.role === 'LMO' || user.role === 'GATC') && app.assigned_to !== user.id) {
    throw { status: 403, message: 'Forbidden: This application is not assigned to you' };
  }

  if (!['ASSIGNED', 'SCHEDULED'].includes(app.status)) {
    throw { status: 400, message: `Cannot schedule an application with status '${app.status}'. Must be ASSIGNED first.` };
  }

  const { scheduled_date, remarks } = body;
  if (!scheduled_date) throw { status: 400, message: 'scheduled_date (YYYY-MM-DD) is required' };

  const updated = await appModel.schedule(app.id, scheduled_date, remarks || null);
  return updated;
}

module.exports = {
  submitApplication,
  getApplications,
  getApplicationById,
  trackApplication,
  updateApplication,
  assignApplication,
  scheduleApplication,
  VALID_TYPES,
  VALID_STATUSES
};
