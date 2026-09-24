const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticateJWT } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');

// Public Authentication Endpoints
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected Profile Endpoint
router.get('/me', authenticateJWT, authController.getMe);

// Protected RBAC Verification Endpoints
router.get('/test/admin', authenticateJWT, requireRole('ADMIN'), (req, res) => {
  res.json({
    success: true,
    message: 'Access granted: You have ADMIN privileges',
    user: req.user
  });
});

router.get('/test/lmo', authenticateJWT, requireRole('LMO'), (req, res) => {
  res.json({
    success: true,
    message: 'Access granted: You have Legal Metrology Officer (LMO) privileges',
    user: req.user
  });
});

router.get('/test/gatc', authenticateJWT, requireRole('GATC'), (req, res) => {
  res.json({
    success: true,
    message: 'Access granted: You have GATC Test Centre privileges',
    user: req.user
  });
});

router.get('/test/business', authenticateJWT, requireRole('BUSINESS'), (req, res) => {
  res.json({
    success: true,
    message: 'Access granted: You have BUSINESS/Trader privileges',
    user: req.user
  });
});

module.exports = router;
