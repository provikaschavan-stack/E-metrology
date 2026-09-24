const express = require('express');
const router = express.Router();
const CertificateController = require('../controllers/certificate.controller');
const { authenticateJWT } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');

// Detailed certificate lookup
router.get('/:certificateNumber', authenticateJWT, CertificateController.getCertificateByNumber);

// Get all certificates
router.get('/', authenticateJWT, CertificateController.getAll);

// Explicit generation for approved application (officers / admin)
router.post(
  '/generate/:applicationId',
  authenticateJWT,
  requireRole(['ADMIN', 'LMO', 'GATC']),
  CertificateController.generate
);

module.exports = router;
