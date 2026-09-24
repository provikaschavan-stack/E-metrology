const CertificateModel = require('../models/certificate.model');
const ApplicationModel = require('../models/application.model');
const InstrumentModel = require('../models/instrument.model');
const db = require('../config/db');
const env = require('../config/env');

class CertificateService {
  /**
   * Dynamically compute statutory validity status based on valid_until date
   */
  static computeStatus(validUntilStr, existingStatus) {
    if (existingStatus === 'INVALID') return 'INVALID';
    if (!validUntilStr) return 'VALID';

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const validUntilDate = new Date(validUntilStr);
    validUntilDate.setHours(0, 0, 0, 0);

    if (isNaN(validUntilDate.getTime())) return existingStatus || 'VALID';

    // If expired
    if (validUntilDate < now) {
      return 'EXPIRED';
    }

    // Days remaining until expiration
    const diffTime = validUntilDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 30) {
      return 'EXPIRING_SOON';
    }

    return 'VALID';
  }

  /**
   * Generate a certificate automatically when an application is APPROVED
   */
  static async generateCertificateForApplication(applicationId) {
    const app = await ApplicationModel.findById(applicationId);
    if (!app) {
      const err = new Error(`Application ID '${applicationId}' not found.`);
      err.statusCode = 404;
      throw err;
    }

    // Check if certificate already generated for this application
    const existing = await CertificateModel.findByApplicationId(app.id);
    if (existing) {
      const status = this.computeStatus(existing.valid_until, existing.status);
      return { ...existing, status, qr_url: `${env.PUBLIC_APP_URL}/verify/${existing.certificate_number}` };
    }

    // Generate dates: Issued today, valid for 1 year
    const today = new Date();
    const issuedDateStr = today.toISOString().split('T')[0];

    const nextYear = new Date(today);
    nextYear.setFullYear(today.getFullYear() + 1);
    const validUntilStr = nextYear.toISOString().split('T')[0];

    const certNumber = db.generateCertificateNumber();
    const qrToken = db.generateQrToken();

    const cert = await CertificateModel.create({
      certificate_number: certNumber,
      application_id: app.id,
      instrument_id: app.instrument_id || app.instrument_db_id,
      issued_to: app.applicant_id,
      issued_date: issuedDateStr,
      valid_until: validUntilStr,
      status: 'VALID',
      pdf_url: `/api/certificates/${certNumber}/pdf`,
      qr_token: qrToken
    });

    // Update Instrument status to VERIFIED
    if (app.instrument_id || app.instrument_db_id) {
      try {
        await InstrumentModel.update(app.instrument_id || app.instrument_db_id, { status: 'VERIFIED' });
      } catch {
        // Continue if instrument update is not blocking
      }
    }

    return {
      ...cert,
      qr_url: `${env.PUBLIC_APP_URL}/verify/${certNumber}`
    };
  }

  /**
   * Get full certificate by certificate number (authenticated/authorized lookup)
   */
  static async getByCertificateNumber(certificateNumber, user) {
    if (!certificateNumber) {
      const err = new Error('Certificate number is required.');
      err.statusCode = 400;
      throw err;
    }

    const cert = await CertificateModel.findByCertificateNumber(certificateNumber.trim().toUpperCase());
    if (!cert) {
      const err = new Error(`Certificate '${certificateNumber}' not found.`);
      err.statusCode = 404;
      throw err;
    }

    if (user?.role === 'BUSINESS' && cert.issued_to !== user.id) {
      const err = new Error('You do not have permission to view this certificate.');
      err.statusCode = 403;
      throw err;
    }

    const status = this.computeStatus(cert.valid_until, cert.status);
    return {
      ...cert,
      status,
      qr_url: `${env.PUBLIC_APP_URL}/verify/${cert.certificate_number}`
    };
  }

  /**
   * Public verification endpoint (NO LOGIN REQUIRED)
   * Returns statutory verification fields:
   * certificate_number, instrument_id, instrument_type, serial_number,
   * verification_date, valid_until, status, issued_by
   */
  static async publicVerifyCertificate(certificateNumber) {
    if (!certificateNumber || !certificateNumber.trim()) {
      return {
        certificate_number: certificateNumber || 'UNKNOWN',
        instrument_id: 'N/A',
        instrument_type: 'N/A',
        serial_number: 'N/A',
        verification_date: 'N/A',
        valid_until: 'N/A',
        status: 'INVALID',
        issued_by: 'N/A',
        qr_url: `${env.PUBLIC_APP_URL}/verify/${certificateNumber || ''}`,
        is_valid: false,
        message: 'A certificate number must be provided for verification.'
      };
    }

    const cert = await CertificateModel.findByCertificateNumber(certificateNumber.trim().toUpperCase());
    if (!cert) {
      return {
        certificate_number: certificateNumber.trim().toUpperCase(),
        instrument_id: 'N/A',
        instrument_type: 'Unknown Device',
        serial_number: 'N/A',
        verification_date: 'N/A',
        valid_until: 'N/A',
        status: 'INVALID',
        issued_by: 'Not in Legal Metrology Database',
        qr_url: `${env.PUBLIC_APP_URL}/verify/${certificateNumber.trim().toUpperCase()}`,
        is_valid: false,
        message: `Certificate '${certificateNumber}' is not recognized in the National Metrology Registry.`
      };
    }

    const status = this.computeStatus(cert.valid_until, cert.status);
    const issuedBy = 'Department of Legal Metrology (Govt. of India)';

    return {
      certificate_number: cert.certificate_number,
      instrument_id: cert.instrument_code || `INS-${cert.instrument_id}`,
      instrument_type: cert.instrument_type || 'Commercial Metrology Instrument',
      serial_number: cert.serial_number || 'SN-VERIFIED',
      verification_date: cert.issued_date,
      valid_until: cert.valid_until,
      status: status,
      issued_by: issuedBy,
      qr_url: `${env.PUBLIC_APP_URL}/verify/${cert.certificate_number}`,
      pdf_url: cert.pdf_url || `/api/certificates/${cert.certificate_number}/pdf`,
      location: cert.instrument_location,
      model: cert.model,
      capacity: cert.capacity,
      is_valid: status === 'VALID' || status === 'EXPIRING_SOON'
    };
  }
}

module.exports = CertificateService;
