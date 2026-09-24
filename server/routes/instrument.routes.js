const express = require('express');
const router = express.Router();
const instrumentController = require('../controllers/instrument.controller');
const { authenticateJWT } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');

// All instrument routes require a valid JWT
router.use(authenticateJWT);

// POST /api/instruments — Business & Admin can register new instruments
router.post(
  '/',
  requireRole(['BUSINESS', 'ADMIN']),
  instrumentController.create
);

// GET /api/instruments — Role-filtered listing (BUSINESS sees own, ADMIN/LMO/GATC sees all)
router.get(
  '/',
  requireRole(['BUSINESS', 'ADMIN', 'LMO', 'GATC']),
  instrumentController.getAll
);

// GET /api/instruments/:id — Retrieve instrument by ID or INS code
router.get(
  '/:id',
  requireRole(['BUSINESS', 'ADMIN', 'LMO', 'GATC']),
  instrumentController.getById
);

// PUT /api/instruments/:id — Update instrument (Business can update own, Admin can update any)
router.put(
  '/:id',
  requireRole(['BUSINESS', 'ADMIN']),
  instrumentController.update
);

// DELETE /api/instruments/:id — Delete instrument
router.delete(
  '/:id',
  requireRole(['BUSINESS', 'ADMIN']),
  instrumentController.remove
);

module.exports = router;
