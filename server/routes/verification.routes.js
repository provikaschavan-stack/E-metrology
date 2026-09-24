const express = require('express');
const VerificationController = require('../controllers/verification.controller');
const { authenticateJWT } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');

const router = express.Router();

// All verification endpoints require valid JWT authentication
router.use(authenticateJWT);

// Create verification inspection record (LMO, GATC, ADMIN)
router.post(
  '/',
  requireRole(['LMO', 'GATC', 'ADMIN']),
  VerificationController.create
);

// Get verification record by application ID / number
router.get(
  '/application/:applicationId',
  VerificationController.getByApplication
);

// Get verification record by ID
router.get(
  '/:id',
  VerificationController.getById
);

// Update verification inspection record (LMO, GATC, ADMIN)
router.put(
  '/:id',
  requireRole(['LMO', 'GATC', 'ADMIN']),
  VerificationController.update
);

module.exports = router;
