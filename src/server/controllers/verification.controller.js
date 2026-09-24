const VerificationService = require('../services/verification.service');

const VerificationController = {
  /**
   * POST /api/verifications
   */
  async create(req, res) {
    try {
      const record = await VerificationService.createVerification(req.user, req.body);
      return res.status(201).json({
        success: true,
        message: 'Field verification record submitted successfully.',
        data: record
      });
    } catch (err) {
      const status = err.statusCode || 500;
      return res.status(status).json({
        success: false,
        message: err.message || 'Failed to submit field verification record.'
      });
    }
  },

  /**
   * GET /api/verifications/:id
   */
  async getById(req, res) {
    try {
      const record = await VerificationService.getVerificationById(req.user, req.params.id);
      return res.json({
        success: true,
        data: record
      });
    } catch (err) {
      const status = err.statusCode || 500;
      return res.status(status).json({
        success: false,
        message: err.message || 'Failed to fetch verification record.'
      });
    }
  },

  /**
   * GET /api/verifications/application/:applicationId
   */
  async getByApplication(req, res) {
    try {
      const record = await VerificationService.getVerificationByApplication(req.user, req.params.applicationId);
      return res.json({
        success: true,
        data: record
      });
    } catch (err) {
      const status = err.statusCode || 500;
      return res.status(status).json({
        success: false,
        message: err.message || 'Failed to fetch verification record for application.'
      });
    }
  },

  /**
   * PUT /api/verifications/:id
   */
  async update(req, res) {
    try {
      const updated = await VerificationService.updateVerification(req.user, req.params.id, req.body);
      return res.json({
        success: true,
        message: 'Field verification record updated successfully.',
        data: updated
      });
    } catch (err) {
      const status = err.statusCode || 500;
      return res.status(status).json({
        success: false,
        message: err.message || 'Failed to update verification record.'
      });
    }
  }
};

module.exports = VerificationController;
