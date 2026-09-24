const db = require('../config/db');

// Rich SELECT — joins instruments + users for applicant + assignee
const SELECT_FULL = `
  SELECT
    a.id,
    a.application_number,
    a.instrument_id,
    a.applicant_id,
    a.application_type,
    a.status,
    a.assigned_to,
    a.scheduled_date,
    a.remarks,
    a.created_at,
    a.updated_at,
    -- Instrument fields
    i.id                 AS instrument_db_id,
    i.instrument_id      AS instrument_code,
    i.instrument_id      AS instrument_id_ref,
    i.instrument_type    AS instrument_type,
    i.serial_number      AS instrument_serial,
    i.serial_number      AS serial_number,
    i.location           AS instrument_location,
    -- Applicant fields
    ap.name              AS applicant_name,
    ap.email             AS applicant_email,
    ap.phone             AS applicant_phone,
    -- Assigned officer fields
    ao.name              AS assigned_to_name,
    ao.email             AS assigned_to_email,
    ao.role              AS assigned_to_role
  FROM verification_applications a
  LEFT JOIN instruments i  ON a.instrument_id = i.id
  LEFT JOIN users       ap ON a.applicant_id  = ap.id
  LEFT JOIN users       ao ON a.assigned_to   = ao.id
`;

async function create({ application_number, instrument_id, applicant_id, application_type, remarks = null }) {
  const res = await db.query(
    `INSERT INTO verification_applications
       (application_number, instrument_id, applicant_id, application_type, status, remarks)
     VALUES ($1, $2, $3, $4, 'SUBMITTED', $5)
     RETURNING *`,
    [application_number, instrument_id, applicant_id, application_type, remarks || null]
  );
  const created = res.rows[0];
  if (created?.id) {
    const full = await findById(created.id);
    return full || created;
  }
  return created;
}

async function findAll() {
  const res = await db.query(`${SELECT_FULL} ORDER BY a.id DESC`);
  return res.rows;
}

async function findByApplicant(applicant_id) {
  const res = await db.query(
    `${SELECT_FULL} WHERE a.applicant_id = $1 ORDER BY a.id DESC`,
    [applicant_id]
  );
  return res.rows;
}

async function findByAssignee(assigned_to) {
  const res = await db.query(
    `${SELECT_FULL} WHERE a.assigned_to = $1 ORDER BY a.id DESC`,
    [assigned_to]
  );
  return res.rows;
}

async function findById(id) {
  const res = await db.query(
    `${SELECT_FULL} WHERE a.id = $1 OR a.application_number = $1`,
    [id]
  );
  return res.rows[0] || null;
}

async function updateStatus(id, status, remarks = null) {
  await db.query(
    `UPDATE verification_applications
     SET status = $1, remarks = COALESCE($2, remarks), updated_at = NOW()
     WHERE id = $3 OR application_number = $3
     RETURNING *`,
    [status, remarks, id]
  );
  return findById(id);
}

async function assign(id, assigned_to_id, remarks = null) {
  await db.query(
    `UPDATE verification_applications
     SET assigned_to = $1, status = 'ASSIGNED',
         remarks = COALESCE($2, remarks), updated_at = NOW()
     WHERE id = $3 OR application_number = $3
     RETURNING *`,
    [assigned_to_id, remarks, id]
  );
  return findById(id);
}

async function schedule(id, scheduled_date, remarks = null) {
  await db.query(
    `UPDATE verification_applications
     SET scheduled_date = $1, status = 'SCHEDULED',
         remarks = COALESCE($2, remarks), updated_at = NOW()
     WHERE id = $3 OR application_number = $3
     RETURNING *`,
    [scheduled_date, remarks, id]
  );
  return findById(id);
}

module.exports = {
  create,
  findAll,
  findByApplicant,
  findByAssignee,
  findById,
  updateStatus,
  assign,
  schedule
};
