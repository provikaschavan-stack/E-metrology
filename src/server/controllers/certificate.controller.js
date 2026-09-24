const CertificateService = require('../services/certificate.service');
const CertificateModel = require('../models/certificate.model');

class CertificateController {
  /**
   * GET /api/certificates/:certificateNumber
   * Detailed certificate lookup (with metadata and relations)
   */
  static async getCertificateByNumber(req, res) {
    try {
      const { certificateNumber } = req.params;
      const cert = await CertificateService.getByCertificateNumber(certificateNumber);
      return res.status(200).json({
        success: true,
        data: cert
      });
    } catch (err) {
      return res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Error fetching certificate'
      });
    }
  }

  /**
   * GET /api/public/verify/:certificateNumber
   * PUBLIC VERIFICATION ENDPOINT — MUST NOT REQUIRE LOGIN
   * Returns:
   * - certificate_number
   * - instrument_id
   * - instrument_type
   * - serial_number
   * - verification_date
   * - valid_until
   * - status (VALID | EXPIRING_SOON | EXPIRED | INVALID)
   * - issued_by
   */
  static async publicVerify(req, res) {
    try {
      const { certificateNumber } = req.params;
      const verificationResult = await CertificateService.publicVerifyCertificate(certificateNumber);
      return res.status(200).json({
        success: true,
        data: verificationResult
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message || 'Error conducting public verification'
      });
    }
  }

  /**
   * POST /api/certificates/generate/:applicationId
   * Explicit generation endpoint for approved applications
   */
  static async generate(req, res) {
    try {
      const { applicationId } = req.params;
      const cert = await CertificateService.generateCertificateForApplication(applicationId);
      return res.status(201).json({
        success: true,
        message: 'Digital Certificate generated successfully',
        data: cert
      });
    } catch (err) {
      return res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Error generating certificate'
      });
    }
  }

  /**
   * GET /api/certificates
   * Fetch all registered certificates
   */
  static async getAll(req, res) {
    try {
      const list = await CertificateModel.findAll();
      const mapped = list.map(c => ({
        ...c,
        status: CertificateService.computeStatus(c.valid_until, c.status),
        qr_url: `http://localhost:5173/verify/${c.certificate_number}`
      }));
      return res.status(200).json({
        success: true,
        count: mapped.length,
        data: mapped
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message || 'Error fetching certificates'
      });
    }
  }
}

module.exports = CertificateController;
