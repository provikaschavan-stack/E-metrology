const VerificationModel = require('../models/verification.model');
const ApplicationModel = require('../models/application.model');

const ALLOWED_RESULTS = ['PASS', 'FAIL', 'PENDING'];

const VerificationService = {
  /**
   * Record a new field verification
   */
  async createVerification(user, data) {
    if (!['LMO', 'GATC', 'ADMIN'].includes(user.role)) {
      const err = new Error('Only LMO officers, GATC labs, or Administrators can submit field verification records.');
      err.statusCode = 403;
      throw err;
    }

    const { application_id, application_number } = data;
    const targetAppKey = application_id || application_number;

    if (!targetAppKey) {
      const err = new Error('application_id or application_number is required.');
      err.statusCode = 400;
      throw err;
    }

    const application = await ApplicationModel.findById(targetAppKey);
    if (!application) {
      const err = new Error(`Application '${targetAppKey}' not found.`);
      err.statusCode = 404;
      throw err;
    }

    // Role check: LMO/GATC should inspect their assigned application (ADMIN can inspect any)
    if (['LMO', 'GATC'].includes(user.role)) {
      if (!application.assigned_to || application.assigned_to !== user.id) {
        const err = new Error('You are only authorized to record inspections for applications assigned to you.');
        err.statusCode = 403;
        throw err;
      }
    }

    if (!['SCHEDULED', 'FIELD_VERIFICATION'].includes(application.status)) {
      const err = new Error(`Application must be SCHEDULED or FIELD_VERIFICATION before inspection. Current status: '${application.status}'.`);
      err.statusCode = 400;
      throw err;
    }

    // Validate result
    const result = data.result ? String(data.result).toUpperCase().trim() : 'PASS';
    if (!ALLOWED_RESULTS.includes(result)) {
      const err = new Error(`Invalid verification result '${result}'. Allowed: ${ALLOWED_RESULTS.join(', ')}`);
      err.statusCode = 400;
      throw err;
    }

    // Create verification record
    const record = await VerificationModel.create({
      application_id: application.id,
      officer_id: user.id,
      inspection_date: data.inspection_date || new Date().toISOString().split('T')[0],
      instrument_condition: data.instrument_condition || 'PASS',
      accuracy_result: data.accuracy_result || 'PASS',
      seal_condition: data.seal_condition || 'PASS',
      document_result: data.document_result || 'PASS',
      observations: data.observations || null,
      latitude: data.latitude !== undefined && data.latitude !== null ? parseFloat(data.latitude) : null,
      longitude: data.longitude !== undefined && data.longitude !== null ? parseFloat(data.longitude) : null,
      photo_url: data.photo_url || null,
      result
    });

    // Workflow transition:
    // FIELD_VERIFICATION -> UNDER_REVIEW
    const newStatus = 'UNDER_REVIEW';
    const transitionRemarks = `Field inspection submitted by ${user.name} (${user.role}). Result: ${result}. Notes: ${data.observations || 'All checklist items verified.'}`;

    const updatedApp = await ApplicationModel.updateStatus(application.id, newStatus, transitionRemarks);

    return {
      ...record,
      application_number: application.application_number,
      application_status: updatedApp?.status || newStatus
    };
  },

  /**
   * Get verification record by ID
   */
  async getVerificationById(user, id) {
    const record = await VerificationModel.findById(id);
    if (!record) {
      const err = new Error(`Verification record #${id} not found.`);
      err.statusCode = 404;
      throw err;
    }

    // Business applicants can only view verifications for their own applications
    if (user.role === 'BUSINESS' && record.applicant_id !== user.id) {
      const err = new Error('You do not have permission to view this verification record.');
      err.statusCode = 403;
      throw err;
    }

    return record;
  },

  /**
   * Get verification record by Application ID / Number
   */
  async getVerificationByApplication(user, applicationId) {
    const record = await VerificationModel.findByApplicationId(applicationId);
    if (!record) {
      const err = new Error(`No verification record found for application '${applicationId}'.`);
      err.statusCode = 404;
      throw err;
    }

    if (user.role === 'BUSINESS' && record.applicant_id !== user.id) {
      const err = new Error('You do not have permission to view this verification record.');
      err.statusCode = 403;
      throw err;
    }

    return record;
  },

  /**
   * Update existing verification record
   */
  async updateVerification(user, id, data) {
    if (!['LMO', 'GATC', 'ADMIN'].includes(user.role)) {
      const err = new Error('Only LMO officers, GATC labs, or Administrators can modify field verification records.');
      err.statusCode = 403;
      throw err;
    }

    const existing = await VerificationModel.findById(id);
    if (!existing) {
      const err = new Error(`Verification record #${id} not found.`);
      err.statusCode = 404;
      throw err;
    }

    if (['LMO', 'GATC'].includes(user.role) && existing.officer_id !== user.id) {
      const err = new Error('You can only modify verification records created by your account.');
      err.statusCode = 403;
      throw err;
    }

    if (data.result) {
      const res = String(data.result).toUpperCase().trim();
      if (!ALLOWED_RESULTS.includes(res)) {
        const err = new Error(`Invalid verification result '${res}'. Allowed: ${ALLOWED_RESULTS.join(', ')}`);
        err.statusCode = 400;
        throw err;
      }
      data.result = res;
    }

    const updated = await VerificationModel.update(id, data);
    return updated;
  }
};

module.exports = VerificationService;
