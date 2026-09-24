const db = require('../config/db');

class CertificateModel {
  /**
   * Create a new certificate record
   */
  static async create({
    certificate_number,
    application_id,
    instrument_id,
    issued_to,
    issued_date = new Date().toISOString().split('T')[0],
    valid_until,
    status = 'VALID',
    pdf_url,
    qr_token
  }) {
    const certNo = certificate_number || db.generateCertificateNumber();
    const token = qr_token || db.generateQrToken();
    const pdf = pdf_url || `/api/certificates/${certNo}/pdf`;

    const text = `
      INSERT INTO certificates (
        certificate_number, application_id, instrument_id, issued_to,
        issued_date, valid_until, status, pdf_url, qr_token
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `;
    const params = [
      certNo,
      application_id,
      instrument_id,
      issued_to,
      issued_date,
      valid_until,
      status,
      pdf,
      token
    ];

    const { rows } = await db.query(text, params);
    return rows[0];
  }

  /**
   * Find certificate by certificate_number with full joined metadata
   */
  static async findByCertificateNumber(certificateNumber) {
    const text = `
      SELECT 
        c.*,
        i.instrument_id as instrument_code,
        i.instrument_type,
        i.manufacturer,
        i.model,
        i.serial_number,
        i.capacity,
        i.location as instrument_location,
        u.name as issued_to_name,
        u.email as issued_to_email,
        u.phone as issued_to_phone,
        a.application_number,
        a.application_type,
        a.assigned_to,
        off.name as officer_name,
        off.email as officer_email,
        off.role as officer_role
      FROM certificates c
      LEFT JOIN instruments i ON c.instrument_id = i.id
      LEFT JOIN users u ON c.issued_to = u.id
      LEFT JOIN verification_applications a ON c.application_id = a.id
      LEFT JOIN users off ON a.assigned_to = off.id
      WHERE c.certificate_number = $1;
    `;
    const { rows } = await db.query(text, [certificateNumber.trim().toUpperCase()]);
    return rows[0] || null;
  }

  /**
   * Find certificate by application_id
   */
  static async findByApplicationId(applicationId) {
    const text = `
      SELECT c.*, i.instrument_id as instrument_code, i.instrument_type, i.serial_number, u.name as issued_to_name
      FROM certificates c
      LEFT JOIN instruments i ON c.instrument_id = i.id
      LEFT JOIN users u ON c.issued_to = u.id
      WHERE c.application_id = $1;
    `;
    const { rows } = await db.query(text, [applicationId]);
    return rows[0] || null;
  }

  /**
   * Find certificate by qr_token
   */
  static async findByQrToken(qrToken) {
    const text = `
      SELECT c.*, i.instrument_id as instrument_code, i.instrument_type, i.serial_number, u.name as issued_to_name
      FROM certificates c
      LEFT JOIN instruments i ON c.instrument_id = i.id
      LEFT JOIN users u ON c.issued_to = u.id
      WHERE c.qr_token = $1;
    `;
    const { rows } = await db.query(text, [qrToken]);
    return rows[0] || null;
  }

  /**
   * Find all certificates
   */
  static async findAll() {
    const text = `
      SELECT c.*, i.instrument_id as instrument_code, i.instrument_type, i.serial_number, u.name as issued_to_name
      FROM certificates c
      LEFT JOIN instruments i ON c.instrument_id = i.id
      LEFT JOIN users u ON c.issued_to = u.id
      ORDER BY c.id DESC;
    `;
    const { rows } = await db.query(text);
    return rows;
  }

  /**
   * Update certificate status
   */
  static async updateStatus(id, status) {
    const text = `
      UPDATE certificates
      SET status = $1
      WHERE id = $2
      RETURNING *;
    `;
    const { rows } = await db.query(text, [status, id]);
    return rows[0] || null;
  }
}

module.exports = CertificateModel;
