const express = require('express');
const router = express.Router();
const CertificateController = require('../controllers/certificate.controller');

/**
 * Public Verification Endpoint — MUST NOT REQUIRE LOGIN
 * GET /api/public/verify/:certificateNumber
 */
router.get('/verify/:certificateNumber', CertificateController.publicVerify);

module.exports = router;
