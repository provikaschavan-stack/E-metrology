const db = require('../config/db');

const VerificationModel = {
  /**
   * Create a new verification inspection record
   */
  async create({
    application_id,
    officer_id,
    inspection_date,
    instrument_condition,
    accuracy_result,
    seal_condition,
    document_result,
    observations,
    latitude,
    longitude,
    photo_url,
    result
  }) {
    const text = `
      INSERT INTO verification_records
        (application_id, officer_id, inspection_date, instrument_condition, accuracy_result, seal_condition, document_result, observations, latitude, longitude, photo_url, result)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *;
    `;
    const params = [
      application_id,
      officer_id,
      inspection_date || new Date().toISOString().split('T')[0],
      instrument_condition || 'PASS',
      accuracy_result || 'PASS',
      seal_condition || 'PASS',
      document_result || 'PASS',
      observations || null,
      latitude !== undefined && latitude !== null ? parseFloat(latitude) : null,
      longitude !== undefined && longitude !== null ? parseFloat(longitude) : null,
      photo_url || null,
      result || 'PASS'
    ];

    const { rows } = await db.query(text, params);
    return rows[0];
  },

  /**
   * Find verification record by ID with joined application, instrument, and officer info
   */
  async findById(id) {
    const text = `
      SELECT 
        vr.*,
        a.application_number,
        a.application_type,
        a.status as application_status,
        a.applicant_id,
        u_app.name as applicant_name,
        u_app.email as applicant_email,
        i.instrument_id as instrument_code,
        i.instrument_type,
        i.model,
        i.serial_number,
        i.capacity,
        i.location as instrument_location,
        u_off.name as officer_name,
        u_off.email as officer_email,
        u_off.role as officer_role
      FROM verification_records vr
      LEFT JOIN verification_applications a ON vr.application_id = a.id
      LEFT JOIN instruments i ON a.instrument_id = i.id
      LEFT JOIN users u_app ON a.applicant_id = u_app.id
      LEFT JOIN users u_off ON vr.officer_id = u_off.id
      WHERE vr.id = $1;
    `;
    const { rows } = await db.query(text, [id]);
    return rows[0] || null;
  },

  /**
   * Find verification record by Application ID or Application Number
   */
  async findByApplicationId(application_id) {
    const text = `
      SELECT 
        vr.*,
        a.application_number,
        a.application_type,
        a.status as application_status,
        a.applicant_id,
        u_app.name as applicant_name,
        u_app.email as applicant_email,
        i.instrument_id as instrument_code,
        i.instrument_type,
        i.location as instrument_location,
        u_off.name as officer_name,
        u_off.email as officer_email,
        u_off.role as officer_role
      FROM verification_records vr
      LEFT JOIN verification_applications a ON vr.application_id = a.id
      LEFT JOIN instruments i ON a.instrument_id = i.id
      LEFT JOIN users u_app ON a.applicant_id = u_app.id
      LEFT JOIN users u_off ON vr.officer_id = u_off.id
      WHERE vr.application_id = $1;
    `;
    const { rows } = await db.query(text, [application_id]);
    return rows[0] || null;
  },

  /**
   * List all verification records
   */
  async findAll() {
    const text = `
      SELECT 
        vr.*,
        a.application_number,
        a.application_type,
        a.status as application_status,
        i.instrument_type,
        u_off.name as officer_name
      FROM verification_records vr
      LEFT JOIN verification_applications a ON vr.application_id = a.id
      LEFT JOIN instruments i ON a.instrument_id = i.id
      LEFT JOIN users u_off ON vr.officer_id = u_off.id
      ORDER BY vr.created_at DESC;
    `;
    const { rows } = await db.query(text);
    return rows;
  },

  /**
   * Find all verification records by inspecting officer
   */
  async findByOfficer(officer_id) {
    const text = `
      SELECT 
        vr.*,
        a.application_number,
        a.application_type,
        a.status as application_status,
        i.instrument_type,
        u_app.name as applicant_name
      FROM verification_records vr
      LEFT JOIN verification_applications a ON vr.application_id = a.id
      LEFT JOIN instruments i ON a.instrument_id = i.id
      LEFT JOIN users u_app ON a.applicant_id = u_app.id
      WHERE vr.officer_id = $1
      ORDER BY vr.created_at DESC;
    `;
    const { rows } = await db.query(text, [officer_id]);
    return rows;
  },

  /**
   * Update verification record
   */
  async update(id, fields) {
    const text = `
      UPDATE verification_records
      SET 
        instrument_condition = COALESCE($1, instrument_condition),
        accuracy_result = COALESCE($2, accuracy_result),
        seal_condition = COALESCE($3, seal_condition),
        document_result = COALESCE($4, document_result),
        observations = COALESCE($5, observations),
        latitude = COALESCE($6, latitude),
        longitude = COALESCE($7, longitude),
        photo_url = COALESCE($8, photo_url),
        result = COALESCE($9, result)
      WHERE id = $10
      RETURNING *;
    `;
    const params = [
      fields.instrument_condition,
      fields.accuracy_result,
      fields.seal_condition,
      fields.document_result,
      fields.observations,
      fields.latitude !== undefined && fields.latitude !== null ? parseFloat(fields.latitude) : null,
      fields.longitude !== undefined && fields.longitude !== null ? parseFloat(fields.longitude) : null,
      fields.photo_url,
      fields.result,
      id
    ];

    const { rows } = await db.query(text, params);
    return rows[0] || null;
  }
};

module.exports = VerificationModel;
