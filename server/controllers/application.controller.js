const svc = require('../services/application.service');
const db = require('../config/db');

async function create(req, res) {
  try {
    const app = await svc.submitApplication(req.user, req.body);
    res.status(201).json({ success: true, message: 'Verification application submitted', data: { application: app } });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message || 'Submission failed' });
  }
}

async function getAll(req, res) {
  try {
    const applications = await svc.getApplications(req.user);
    res.json({ success: true, count: applications.length, data: { applications } });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
}

async function getById(req, res) {
  try {
    const app = await svc.getApplicationById(req.user, req.params.id);
    res.json({ success: true, data: { application: app } });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
}

async function update(req, res) {
  try {
    const app = await svc.updateApplication(req.user, req.params.id, req.body);
    res.json({ success: true, message: 'Application updated', data: { application: app } });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
}

async function assign(req, res) {
  try {
    const app = await svc.assignApplication(req.user, req.params.id, req.body);
    res.json({ success: true, message: 'Application assigned to officer', data: { application: app } });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
}

async function schedule(req, res) {
  try {
    const app = await svc.scheduleApplication(req.user, req.params.id, req.body);
    res.json({ success: true, message: 'Inspection scheduled', data: { application: app } });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
}

async function track(req, res) {
  try {
    const app = await svc.trackApplication(req.params.appNumber);
    res.json({ success: true, data: { application: app } });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
}

// Extra: list assignable officers (LMO + GATC users) for ADMIN dropdown
async function getOfficers(req, res) {
  try {
    const r = await db.query(
      "SELECT id, name, role, email FROM users WHERE role IN ($1, $2) ORDER BY name",
      ['LMO', 'GATC']
    );
    res.json({ success: true, data: { officers: r.rows } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = { create, getAll, getById, track, update, assign, schedule, getOfficers };
