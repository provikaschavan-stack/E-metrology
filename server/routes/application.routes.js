const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/application.controller');
const { authenticateJWT } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');

// Public tracking route (no auth required — allows citizen/trader tracking by app number)
router.get('/track/:appNumber', ctrl.track);

// All other routes require JWT authentication
router.use(authenticateJWT);

// Submit new verification application (BUSINESS, ADMIN)
router.post('/', requireRole(['BUSINESS', 'ADMIN']), ctrl.create);

// List applications (role-filtered automatically in service)
router.get('/', requireRole(['BUSINESS', 'ADMIN', 'LMO', 'GATC']), ctrl.getAll);

// List assignable officers for ADMIN assign dropdown
router.get('/officers', requireRole('ADMIN'), ctrl.getOfficers);

// Get single application by id or application_number
router.get('/:id', requireRole(['BUSINESS', 'ADMIN', 'LMO', 'GATC']), ctrl.getById);

// Generic status update (ADMIN, LMO, GATC)
router.put('/:id', requireRole(['ADMIN', 'LMO', 'GATC']), ctrl.update);

// ADMIN assigns to LMO/GATC officer
router.post('/:id/assign', requireRole('ADMIN'), ctrl.assign);

// ADMIN / LMO / GATC schedules an inspection date
router.post('/:id/schedule', requireRole(['ADMIN', 'LMO', 'GATC']), ctrl.schedule);

module.exports = router;
