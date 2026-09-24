const instrumentModel = require('../models/instrument.model');

const ALLOWED_STATUSES = ['ACTIVE', 'PENDING_VERIFICATION', 'VERIFIED', 'EXPIRED'];

function generateInstrumentId() {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `INS-${year}-${randomNum}`;
}

async function createInstrument(user, data) {
  const {
    instrument_type,
    manufacturer,
    model,
    serial_number,
    capacity,
    location,
    registration_date,
    status = 'PENDING_VERIFICATION',
    owner_id: specifiedOwnerId
  } = data;

  if (!instrument_type || !manufacturer || !model || !serial_number || !capacity || !location) {
    throw {
      status: 400,
      message: 'instrument_type, manufacturer, model, serial_number, capacity, and location are required'
    };
  }

  const normalizedStatus = user.role === 'BUSINESS' ? 'PENDING_VERIFICATION' : status.toUpperCase();
  if (!ALLOWED_STATUSES.includes(normalizedStatus)) {
    throw {
      status: 400,
      message: `Invalid status '${status}'. Allowed statuses: ${ALLOWED_STATUSES.join(', ')}`
    };
  }

  // Set owner_id: BUSINESS users are always the owner; ADMIN can specify owner_id or default to themselves
  let owner_id = user.id;
  if (user.role === 'ADMIN' && specifiedOwnerId) {
    owner_id = parseInt(specifiedOwnerId, 10);
  }

  const instrument_id = data.instrument_id || generateInstrumentId();

  const newInstrument = await instrumentModel.create({
    instrument_id,
    owner_id,
    instrument_type,
    manufacturer,
    model,
    serial_number,
    capacity,
    location,
    registration_date: registration_date || new Date().toISOString().split('T')[0],
    status: normalizedStatus
  });

  return newInstrument;
}

async function getInstruments(user) {
  if (user.role === 'BUSINESS') {
    // Business users only view their own registered instruments
    return await instrumentModel.findByOwnerId(user.id);
  }

  // ADMIN, LMO, and GATC officers can view all relevant instruments across districts
  return await instrumentModel.findAll();
}

async function getInstrumentById(user, id) {
  const instrument = await instrumentModel.findById(id);

  if (!instrument) {
    throw { status: 404, message: `Instrument with identifier '${id}' not found` };
  }

  // RBAC: Business owners can only access their own instruments
  if (user.role === 'BUSINESS' && instrument.owner_id !== user.id) {
    throw {
      status: 403,
      message: 'Forbidden: You do not have permission to view this instrument'
    };
  }

  return instrument;
}

async function updateInstrument(user, id, data) {
  const existing = await instrumentModel.findById(id);

  if (!existing) {
    throw { status: 404, message: `Instrument with identifier '${id}' not found` };
  }

  // RBAC: Business owners can only update their own instruments
  if (user.role === 'BUSINESS' && existing.owner_id !== user.id) {
    throw {
      status: 403,
      message: 'Forbidden: You do not have permission to modify this instrument'
    };
  }

  if (data.status) {
    if (user.role === 'BUSINESS') {
      throw {
        status: 403,
        message: 'Instrument status is controlled by the verification workflow and authorized officers.'
      };
    }
    const normalizedStatus = data.status.toUpperCase();
    if (!ALLOWED_STATUSES.includes(normalizedStatus)) {
      throw {
        status: 400,
        message: `Invalid status '${data.status}'. Allowed statuses: ${ALLOWED_STATUSES.join(', ')}`
      };
    }
    data.status = normalizedStatus;
  }

  const updated = await instrumentModel.update(existing.id, data);
  return updated;
}

async function deleteInstrument(user, id) {
  const existing = await instrumentModel.findById(id);

  if (!existing) {
    throw { status: 404, message: `Instrument with identifier '${id}' not found` };
  }

  // RBAC: BUSINESS can delete their own; ADMIN can delete any
  if (user.role === 'BUSINESS' && existing.owner_id !== user.id) {
    throw {
      status: 403,
      message: 'Forbidden: You do not have permission to delete this instrument'
    };
  }

  if (user.role !== 'BUSINESS' && user.role !== 'ADMIN') {
    throw {
      status: 403,
      message: 'Forbidden: Only the instrument owner or an ADMIN can delete instrument records'
    };
  }

  await instrumentModel.deleteById(existing.id);
  return {
    instrument_id: existing.instrument_id,
    deleted: true
  };
}

module.exports = {
  createInstrument,
  getInstruments,
  getInstrumentById,
  updateInstrument,
  deleteInstrument,
  ALLOWED_STATUSES
};
