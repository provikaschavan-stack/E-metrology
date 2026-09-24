const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const env = require('./env');

let pool = null;
let isMockDb = false;

// Mock in-memory store
const memoryStore = {
  users: [],
  instruments: [],
  applications: [],
  verifications: [],
  certificates: []
};

// ─── Seed Data ──────────────────────────────────────────────────────────────

const DEMO_USERS = [
  { name: 'Bharat Retailers (Trader)', email: 'trader@bharatretail.in', password: 'Password@123', role: 'BUSINESS', phone: '+91 98230 11223' },
  { name: 'Rajesh Sharma (LMO Officer)', email: 'officer.sharma@lmo.gov.in', password: 'Password@123', role: 'LMO', phone: '+91 98220 44556' },
  { name: 'Pune Calibration Lab Head', email: 'lab.head@gatc-pune.gov.in', password: 'Password@123', role: 'GATC', phone: '+91 98110 77889' },
  { name: 'Central Metrology Controller', email: 'controller.hq@doca.gov.in', password: 'Password@123', role: 'ADMIN', phone: '+91 98000 99001' }
];

const DEMO_INSTRUMENTS = [
  { instrument_id: 'INS-2026-00001', owner_email: 'trader@bharatretail.in', instrument_type: 'Electronic Weighing Scale (Class III)', manufacturer: 'Demo Instruments Pvt. Ltd.', model: 'DIGI-SCALE 50KG v2', serial_number: 'WS-458921', capacity: '50 kg', location: 'Shop 14, Market Yard, Gultekdi, Pune - 411037', registration_date: '2026-08-26', status: 'VERIFIED' },
  { instrument_id: 'INS-2026-00084', owner_email: 'trader@bharatretail.in', instrument_type: 'Fuel Dispensing Pump (Nozzle 1-4)', manufacturer: 'Gilbarco Veeder-Root', model: 'Frontier MPD 4-Arm', serial_number: 'FDP-992014', capacity: '45 L/min', location: 'NH-48, Khed Shivapur, Maharashtra', registration_date: '2026-07-10', status: 'ACTIVE' },
  { instrument_id: 'INS-2025-00411', owner_email: 'trader@bharatretail.in', instrument_type: 'Jewellery Precision Balance (Class II)', manufacturer: 'Mettler Toledo Inc.', model: 'ME-204 Jewel', serial_number: 'MT-338102', capacity: '220 g (e=1mg)', location: 'Zaveri Bazaar, Mumbai - 400002', registration_date: '2025-01-15', status: 'EXPIRED' },
  { instrument_id: 'INS-2026-00109', owner_email: 'trader@bharatretail.in', instrument_type: 'Heavy Commercial Weighbridge (Class IV)', manufacturer: 'Avery India Ltd.', model: 'TruckScale 60T', serial_number: 'AV-601984', capacity: '60 Ton', location: 'JNPT Port Container Terminal, Navi Mumbai', registration_date: '2026-08-20', status: 'PENDING_VERIFICATION' }
];

const DEMO_APPLICATIONS = [
  { application_number: 'APP-2026-0001', instrument_id_ref: 'INS-2026-00001', applicant_email: 'trader@bharatretail.in', assigned_to_email: 'officer.sharma@lmo.gov.in', application_type: 'RE_VERIFICATION', status: 'APPROVED', scheduled_date: '2026-08-15', remarks: 'Annual re-verification completed successfully. Accuracy within OIML Class III tolerance.' },
  { application_number: 'APP-2026-0002', instrument_id_ref: 'INS-2026-00084', applicant_email: 'trader@bharatretail.in', assigned_to_email: 'officer.sharma@lmo.gov.in', application_type: 'VERIFICATION', status: 'FIELD_VERIFICATION', scheduled_date: '2026-08-28', remarks: 'Officer en route for on-site inspection at NH-48 petrol station.' },
  { application_number: 'APP-2026-0003', instrument_id_ref: 'INS-2025-00411', applicant_email: 'trader@bharatretail.in', assigned_to_email: null, application_type: 'RE_VERIFICATION', status: 'SUBMITTED', scheduled_date: null, remarks: 'Awaiting assignment from Divisional Metrology Controller.' },
  { application_number: 'APP-2026-0004', instrument_id_ref: 'INS-2026-00109', applicant_email: 'trader@bharatretail.in', assigned_to_email: 'lab.head@gatc-pune.gov.in', application_type: 'VERIFICATION', status: 'SCHEDULED', scheduled_date: '2026-08-30', remarks: 'GATC lab scheduled for weighbridge accuracy test using certified 10T proof weights.' }
];

const DEMO_VERIFICATIONS = [
  {
    application_number: 'APP-2026-0001',
    officer_email: 'officer.sharma@lmo.gov.in',
    inspection_date: '2026-08-15',
    instrument_condition: 'PASS - Housing intact, bubble level centered',
    accuracy_result: 'PASS - Zero point stable, linearity ±0.01g under 20kg proof load',
    seal_condition: 'PASS - Official lead seal #GOV-SEAL-88912 affixed',
    document_result: 'PASS - Model approval cert #IND-2024-MA-09 verified',
    observations: 'Electronic weighing scale verified within Class III MPE limits. Physical stamping complete.',
    latitude: 18.4985,
    longitude: 73.8567,
    photo_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    result: 'PASS'
  }
];

const DEMO_CERTIFICATES = [
  {
    certificate_number: 'LM-CERT-2026-00001',
    application_number: 'APP-2026-0001',
    instrument_id_ref: 'INS-2026-00001',
    issued_to_email: 'trader@bharatretail.in',
    issued_date: '2026-08-26',
    valid_until: '2027-08-26',
    status: 'VALID',
    pdf_url: '/api/certificates/LM-CERT-2026-00001/pdf',
    qr_token: 'QR-TOKEN-2026-00001-A98B'
  },
  {
    certificate_number: 'LM-CERT-2026-00084',
    application_number: 'APP-2026-0002',
    instrument_id_ref: 'INS-2026-00084',
    issued_to_email: 'trader@bharatretail.in',
    issued_date: '2025-09-10',
    valid_until: '2026-09-10',
    status: 'EXPIRING_SOON',
    pdf_url: '/api/certificates/LM-CERT-2026-00084/pdf',
    qr_token: 'QR-TOKEN-2026-00084-B47C'
  },
  {
    certificate_number: 'LM-CERT-2025-00411',
    application_number: 'APP-2026-0003',
    instrument_id_ref: 'INS-2025-00411',
    issued_to_email: 'trader@bharatretail.in',
    issued_date: '2025-01-15',
    valid_until: '2026-01-15',
    status: 'EXPIRED',
    pdf_url: '/api/certificates/LM-CERT-2025-00411/pdf',
    qr_token: 'QR-TOKEN-2025-00411-E12F'
  }
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function generateAppNumber() {
  const year = new Date().getFullYear();
  const rand = Math.floor(10000 + Math.random() * 90000);
  return `APP-${year}-${rand}`;
}

function generateCertificateNumber() {
  const year = new Date().getFullYear();
  const rand = Math.floor(10000 + Math.random() * 90000);
  return `LM-CERT-${year}-${rand}`;
}

function generateQrToken() {
  const rand1 = Math.random().toString(36).substring(2, 10).toUpperCase();
  const rand2 = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `QR-${rand1}-${rand2}`;
}

// ─── PostgreSQL Table DDL ────────────────────────────────────────────────────
const DDL_USERS = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('BUSINESS','LMO','GATC','ADMIN')),
    phone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );`;

const DDL_INSTRUMENTS = `
  CREATE TABLE IF NOT EXISTS instruments (
    id SERIAL PRIMARY KEY,
    instrument_id VARCHAR(100) UNIQUE NOT NULL,
    owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    instrument_type VARCHAR(255) NOT NULL,
    manufacturer VARCHAR(255) NOT NULL,
    model VARCHAR(255) NOT NULL,
    serial_number VARCHAR(255) NOT NULL,
    capacity VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    registration_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(50) NOT NULL CHECK (status IN ('ACTIVE','PENDING_VERIFICATION','VERIFIED','EXPIRED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );`;

const DDL_APPLICATIONS = `
  CREATE TABLE IF NOT EXISTS verification_applications (
    id SERIAL PRIMARY KEY,
    application_number VARCHAR(50) UNIQUE NOT NULL,
    instrument_id INTEGER REFERENCES instruments(id) ON DELETE CASCADE,
    applicant_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    application_type VARCHAR(50) NOT NULL CHECK (application_type IN ('VERIFICATION','RE_VERIFICATION')),
    status VARCHAR(50) NOT NULL DEFAULT 'SUBMITTED'
      CHECK (status IN ('SUBMITTED','ASSIGNED','SCHEDULED','FIELD_VERIFICATION','UNDER_REVIEW','APPROVED','REJECTED')),
    assigned_to INTEGER REFERENCES users(id),
    scheduled_date DATE,
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );`;

const DDL_VERIFICATIONS = `
  CREATE TABLE IF NOT EXISTS verification_records (
    id SERIAL PRIMARY KEY,
    application_id INTEGER REFERENCES verification_applications(id) ON DELETE CASCADE,
    officer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    inspection_date DATE DEFAULT CURRENT_DATE,
    instrument_condition VARCHAR(100),
    accuracy_result VARCHAR(100),
    seal_condition VARCHAR(100),
    document_result VARCHAR(100),
    observations TEXT,
    latitude NUMERIC(10, 6),
    longitude NUMERIC(10, 6),
    photo_url TEXT,
    result VARCHAR(50) NOT NULL CHECK (result IN ('PASS', 'FAIL', 'PENDING')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );`;

const DDL_CERTIFICATES = `
  CREATE TABLE IF NOT EXISTS certificates (
    id SERIAL PRIMARY KEY,
    certificate_number VARCHAR(100) UNIQUE NOT NULL,
    application_id INTEGER REFERENCES verification_applications(id) ON DELETE CASCADE,
    instrument_id INTEGER REFERENCES instruments(id) ON DELETE CASCADE,
    issued_to INTEGER REFERENCES users(id) ON DELETE CASCADE,
    issued_date DATE DEFAULT CURRENT_DATE,
    valid_until DATE NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('VALID', 'EXPIRING_SOON', 'EXPIRED', 'INVALID')),
    pdf_url TEXT,
    qr_token VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );`;

// ─── initDatabase ────────────────────────────────────────────────────────────
async function initDatabase() {
  try {
    pool = new Pool({ connectionString: env.DATABASE_URL, connectionTimeoutMillis: 2000 });
    const client = await pool.connect();
    console.log('✅ Connected to PostgreSQL successfully.');

    await client.query(DDL_USERS);
    await client.query(DDL_INSTRUMENTS);
    await client.query(DDL_APPLICATIONS);
    await client.query(DDL_VERIFICATIONS);
    await client.query(DDL_CERTIFICATES);
    console.log('✅ Tables verified/created: users, instruments, verification_applications, verification_records, certificates');

    // Seed users
    for (const u of DEMO_USERS) {
      const { rows } = await client.query('SELECT id FROM users WHERE email = $1', [u.email]);
      if (!rows.length) {
        const hash = await bcrypt.hash(u.password, 10);
        await client.query(
          'INSERT INTO users (name,email,password_hash,role,phone) VALUES ($1,$2,$3,$4,$5)',
          [u.name, u.email, hash, u.role, u.phone]
        );
      }
    }

    // Seed instruments
    for (const inst of DEMO_INSTRUMENTS) {
      const { rows } = await client.query('SELECT id FROM instruments WHERE instrument_id = $1', [inst.instrument_id]);
      if (!rows.length) {
        const ownerRes = await client.query('SELECT id FROM users WHERE email = $1', [inst.owner_email]);
        const ownerId = ownerRes.rows[0]?.id || 1;
        await client.query(
          `INSERT INTO instruments (instrument_id,owner_id,instrument_type,manufacturer,model,serial_number,capacity,location,registration_date,status)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
          [inst.instrument_id, ownerId, inst.instrument_type, inst.manufacturer, inst.model,
          inst.serial_number, inst.capacity, inst.location, inst.registration_date, inst.status]
        );
      }
    }

    // Seed applications
    for (const app of DEMO_APPLICATIONS) {
      const { rows } = await client.query('SELECT id FROM verification_applications WHERE application_number = $1', [app.application_number]);
      if (!rows.length) {
        const instrRes = await client.query('SELECT id FROM instruments WHERE instrument_id = $1', [app.instrument_id_ref]);
        const instrId = instrRes.rows[0]?.id;
        const applyRes = await client.query('SELECT id FROM users WHERE email = $1', [app.applicant_email]);
        const applicantId = applyRes.rows[0]?.id;
        let assignedToId = null;
        if (app.assigned_to_email) {
          const atRes = await client.query('SELECT id FROM users WHERE email = $1', [app.assigned_to_email]);
          assignedToId = atRes.rows[0]?.id || null;
        }
        await client.query(
          `INSERT INTO verification_applications
            (application_number,instrument_id,applicant_id,application_type,status,assigned_to,scheduled_date,remarks)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
          [app.application_number, instrId, applicantId, app.application_type,
          app.status, assignedToId, app.scheduled_date || null, app.remarks || null]
        );
      }
    }

    // Seed verifications
    for (const v of DEMO_VERIFICATIONS) {
      const appRes = await client.query('SELECT id FROM verification_applications WHERE application_number = $1', [v.application_number]);
      const appId = appRes.rows[0]?.id;
      const offRes = await client.query('SELECT id FROM users WHERE email = $1', [v.officer_email]);
      const offId = offRes.rows[0]?.id;
      if (appId && offId) {
        const { rows } = await client.query('SELECT id FROM verification_records WHERE application_id = $1', [appId]);
        if (!rows.length) {
          await client.query(
            `INSERT INTO verification_records
              (application_id, officer_id, inspection_date, instrument_condition, accuracy_result, seal_condition, document_result, observations, latitude, longitude, photo_url, result)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
            [appId, offId, v.inspection_date, v.instrument_condition, v.accuracy_result, v.seal_condition, v.document_result, v.observations, v.latitude, v.longitude, v.photo_url, v.result]
          );
        }
      }
    }

    client.release();
    console.log('✅ Seed data loaded for users, instruments, verification_applications, and verification_records.');
  } catch (err) {
    console.warn(`⚠️  PostgreSQL not reachable: ${err.message}`);
    console.log('ℹ️  Activating in-memory data store for demo/testing.');
    isMockDb = true;
    await seedMemory();
  }
}

// ─── In-memory seed ──────────────────────────────────────────────────────────
async function seedMemory() {
  memoryStore.users = [];
  memoryStore.instruments = [];
  memoryStore.applications = [];
  memoryStore.verifications = [];

  let uid = 1;
  for (const u of DEMO_USERS) {
    const hash = await bcrypt.hash(u.password, 10);
    memoryStore.users.push({
      id: uid++,
      name: u.name,
      email: u.email,
      password_hash: hash,
      role: u.role,
      phone: u.phone,
      created_at: new Date()
    });
  }

  let iid = 1;
  for (const inst of DEMO_INSTRUMENTS) {
    const owner = memoryStore.users.find(u => u.email === inst.owner_email);
    memoryStore.instruments.push({
      id: iid++,
      instrument_id: inst.instrument_id,
      owner_id: owner?.id,
      instrument_type: inst.instrument_type,
      manufacturer: inst.manufacturer,
      model: inst.model,
      serial_number: inst.serial_number,
      capacity: inst.capacity,
      location: inst.location,
      registration_date: inst.registration_date,
      status: inst.status,
      created_at: new Date()
    });
  }

  let aid = 1;
  for (const app of DEMO_APPLICATIONS) {
    const instr = memoryStore.instruments.find(i => i.instrument_id === app.instrument_id_ref);
    const applicant = memoryStore.users.find(u => u.email === app.applicant_email);
    const assignedTo = app.assigned_to_email ? memoryStore.users.find(u => u.email === app.assigned_to_email) : null;
    memoryStore.applications.push({
      id: aid++,
      application_number: app.application_number,
      instrument_id: instr?.id,
      instrument_db_id: instr?.id,
      instrument_id_ref: app.instrument_id_ref,
      instrument_code: app.instrument_id_ref,
      instrument_type: instr?.instrument_type,
      instrument_serial: instr?.serial_number,
      serial_number: instr?.serial_number,
      instrument_location: instr?.location,
      applicant_id: applicant?.id,
      applicant_name: applicant?.name,
      applicant_email: applicant?.email,
      applicant_phone: applicant?.phone,
      application_type: app.application_type,
      status: app.status,
      assigned_to: assignedTo?.id || null,
      assigned_to_name: assignedTo?.name || null,
      assigned_to_email: assignedTo?.email || null,
      assigned_to_role: assignedTo?.role || null,
      scheduled_date: app.scheduled_date || null,
      remarks: app.remarks || null,
      created_at: new Date(),
      updated_at: new Date()
    });
  }

  let vid = 1;
  for (const v of DEMO_VERIFICATIONS) {
    const app = memoryStore.applications.find(a => a.application_number === v.application_number);
    const officer = memoryStore.users.find(u => u.email === v.officer_email);
    if (app && officer) {
      memoryStore.verifications.push({
        id: vid++,
        application_id: app.id,
        application_number: app.application_number,
        applicant_id: app.applicant_id,
        applicant_name: app.applicant_name,
        applicant_email: app.applicant_email,
        officer_id: officer.id,
        officer_name: officer.name,
        officer_email: officer.email,
        inspection_date: v.inspection_date,
        instrument_condition: v.instrument_condition,
        accuracy_result: v.accuracy_result,
        seal_condition: v.seal_condition,
        document_result: v.document_result,
        observations: v.observations,
        latitude: v.latitude,
        longitude: v.longitude,
        photo_url: v.photo_url,
        result: v.result,
        created_at: new Date()
      });
    }
  }

  let cid = 1;
  for (const c of DEMO_CERTIFICATES) {
    const app = memoryStore.applications.find(a => a.application_number === c.application_number);
    const instr = memoryStore.instruments.find(i => i.instrument_id === c.instrument_id_ref);
    const owner = memoryStore.users.find(u => u.email === c.issued_to_email);
    if (app && instr && owner) {
      memoryStore.certificates.push({
        id: cid++,
        certificate_number: c.certificate_number,
        application_id: app.id,
        application_number: app.application_number,
        instrument_id: instr.id,
        instrument_code: instr.instrument_id,
        instrument_type: instr.instrument_type,
        serial_number: instr.serial_number,
        model: instr.model,
        capacity: instr.capacity,
        instrument_location: instr.location,
        issued_to: owner.id,
        issued_to_name: owner.name,
        issued_to_email: owner.email,
        issued_date: c.issued_date,
        valid_until: c.valid_until,
        status: c.status,
        pdf_url: c.pdf_url,
        qr_token: c.qr_token,
        qr_url: `http://localhost:5173/verify/${c.certificate_number}`,
        issued_by: 'Legal Metrology Department (Govt. of India)',
        officer_name: app.assigned_to_name || 'Rajesh Sharma (LMO Officer)',
        created_at: new Date()
      });
    }
  }

  console.log('✅ In-memory seed complete: users, instruments, verification_applications, verification_records, certificates.');
}

// ─── Unified query interface ─────────────────────────────────────────────────
async function query(text, params = []) {
  if (!isMockDb && pool) return pool.query(text, params);

  const t = text.toLowerCase().trim();

  // ── USERS ──
  if (t.includes('from users where email = $1')) {
    const u = memoryStore.users.find(u => u.email.toLowerCase() === (params[0] || '').toLowerCase());
    return { rows: u ? [{ ...u }] : [] };
  }
  if (t.includes('from users where id = $1')) {
    const u = memoryStore.users.find(u => u.id === parseInt(params[0], 10));
    return { rows: u ? [{ ...u }] : [] };
  }
  if (t.includes('select id, name, role from users where role in') || t.includes('from users where role in')) {
    const roles = params;
    const filtered = memoryStore.users.filter(u => roles.includes(u.role));
    return { rows: filtered.map(u => ({ id: u.id, name: u.name, role: u.role, email: u.email })) };
  }
  if (t.startsWith('insert into users')) {
    const [name, email, password_hash, role, phone] = params;
    const nu = { id: memoryStore.users.length + 1, name, email, password_hash, role, phone: phone || null, created_at: new Date() };
    memoryStore.users.push(nu);
    return { rows: [{ ...nu }] };
  }
  if (t.includes('select') && t.includes('from users')) {
    return { rows: [...memoryStore.users] };
  }

  // ── INSTRUMENTS ──
  if (t.startsWith('insert into instruments')) {
    const [instrument_id, owner_id, instrument_type, manufacturer, model, serial_number, capacity, location, registration_date, status] = params;
    const ni = { id: memoryStore.instruments.length + 1, instrument_id, owner_id: parseInt(owner_id, 10), instrument_type, manufacturer, model, serial_number, capacity, location, registration_date, status, created_at: new Date() };
    memoryStore.instruments.push(ni);
    const owner = memoryStore.users.find(u => u.id === ni.owner_id);
    return { rows: [{ ...ni, owner_name: owner?.name, owner_email: owner?.email, owner_phone: owner?.phone }] };
  }
  if (t.includes('from instruments') && (t.includes('where i.owner_id = $1') || t.includes('where owner_id = $1'))) {
    const oid = parseInt(params[0], 10);
    const rows = memoryStore.instruments.filter(i => i.owner_id === oid).map(i => {
      const owner = memoryStore.users.find(u => u.id === i.owner_id);
      return { ...i, owner_name: owner?.name, owner_email: owner?.email, owner_phone: owner?.phone };
    });
    return { rows };
  }
  if (t.includes('from instruments') && !t.includes('where')) {
    const rows = memoryStore.instruments.map(i => {
      const owner = memoryStore.users.find(u => u.id === i.owner_id);
      return { ...i, owner_name: owner?.name, owner_email: owner?.email, owner_phone: owner?.phone };
    });
    return { rows };
  }
  if (t.includes('from instruments') && (t.includes('where i.id = $1') || t.includes('where id = $1') || t.includes('where instrument_id = $1') || t.includes('where i.instrument_id = $1'))) {
    const target = params[0];
    const inst = memoryStore.instruments.find(i => i.id === parseInt(target, 10) || i.instrument_id === String(target));
    if (!inst) return { rows: [] };
    const owner = memoryStore.users.find(u => u.id === inst.owner_id);
    return { rows: [{ ...inst, owner_name: owner?.name, owner_email: owner?.email, owner_phone: owner?.phone }] };
  }
  if (t.startsWith('update instruments')) {
    const targetId = params[params.length - 1];
    const idx = memoryStore.instruments.findIndex(i => i.id === parseInt(targetId, 10) || i.instrument_id === targetId);
    if (idx !== -1) {
      const cur = memoryStore.instruments[idx];
      const updated = { ...cur, ...(params[0] !== undefined && { instrument_type: params[0] }), ...(params[1] !== undefined && { manufacturer: params[1] }), ...(params[2] !== undefined && { model: params[2] }), ...(params[3] !== undefined && { serial_number: params[3] }), ...(params[4] !== undefined && { capacity: params[4] }), ...(params[5] !== undefined && { location: params[5] }), ...(params[6] !== undefined && { status: params[6] }) };
      memoryStore.instruments[idx] = updated;
      return { rows: [{ ...updated }] };
    }
    return { rows: [] };
  }
  if (t.startsWith('delete from instruments')) {
    const idx = memoryStore.instruments.findIndex(i => i.id === parseInt(params[0], 10) || i.instrument_id === params[0]);
    if (idx !== -1) { const d = memoryStore.instruments.splice(idx, 1); return { rows: d }; }
    return { rows: [] };
  }

  // ── VERIFICATION APPLICATIONS ──
  if (t.startsWith('insert into verification_applications')) {
    const application_number = params[0];
    const instrument_id = parseInt(params[1], 10);
    const applicant_id = parseInt(params[2], 10);
    const application_type = params[3];
    // Handle varying parameter counts
    let status = 'SUBMITTED';
    let remarks = null;
    if (params.length >= 5 && params[4]) {
      if (params[4] === 'SUBMITTED' || params[4] === 'ASSIGNED' || params[4] === 'SCHEDULED' || params[4] === 'FIELD_VERIFICATION' || params[4] === 'UNDER_REVIEW' || params[4] === 'APPROVED' || params[4] === 'REJECTED') {
        status = params[4];
        remarks = params[5] || null;
      } else {
        remarks = params[4];
      }
    }

    const instr = memoryStore.instruments.find(i => i.id === instrument_id || i.instrument_id === String(params[1]));
    const applicant = memoryStore.users.find(u => u.id === applicant_id);
    const na = {
      id: memoryStore.applications.length + 1,
      application_number,
      instrument_id: instr?.id || instrument_id,
      instrument_db_id: instr?.id || instrument_id,
      instrument_id_ref: instr?.instrument_id,
      instrument_code: instr?.instrument_id,
      instrument_type: instr?.instrument_type,
      instrument_serial: instr?.serial_number,
      serial_number: instr?.serial_number,
      instrument_location: instr?.location,
      applicant_id: applicant?.id || applicant_id,
      applicant_name: applicant?.name,
      applicant_email: applicant?.email,
      applicant_phone: applicant?.phone,
      application_type,
      status,
      assigned_to: null,
      assigned_to_name: null,
      assigned_to_email: null,
      assigned_to_role: null,
      scheduled_date: null,
      remarks: remarks || null,
      created_at: new Date(),
      updated_at: new Date()
    };
    memoryStore.applications.push(na);
    return { rows: [{ ...na }] };
  }

  // SELECT all applications
  if (t.includes('from verification_applications') && !t.includes('where') && !t.includes('verification_records') && !t.includes('certificates')) {
    const rows = memoryStore.applications.map(a => ({ ...a }));
    return { rows };
  }

  // SELECT by applicant_id
  if (t.includes('from verification_applications') && t.includes('where') && t.includes('applicant_id = $1')) {
    const aid = parseInt(params[0], 10);
    return { rows: memoryStore.applications.filter(a => a.applicant_id === aid).map(a => ({ ...a })) };
  }

  // SELECT by assigned_to
  if (t.includes('from verification_applications') && t.includes('where') && t.includes('assigned_to = $1')) {
    const aid = parseInt(params[0], 10);
    return { rows: memoryStore.applications.filter(a => a.assigned_to === aid).map(a => ({ ...a })) };
  }

  // SELECT by id or application_number
  if (t.includes('from verification_applications') && (t.includes('where a.id = $1') || t.includes('where id = $1') || t.includes('where application_number = $1') || t.includes('where a.application_number = $1'))) {
    const target = params[0];
    const app = memoryStore.applications.find(a => a.id === parseInt(target, 10) || a.application_number === String(target));
    return { rows: app ? [{ ...app }] : [] };
  }

  // UPDATE verification_applications status
  if (t.startsWith('update verification_applications') && t.includes('set status')) {
    const targetId = params[params.length - 1];
    const idx = memoryStore.applications.findIndex(a => a.id === parseInt(targetId, 10) || a.application_number === String(targetId));
    if (idx !== -1) {
      const fields = {};
      if (params.length >= 3) {
        fields.status = params[0];
        if (params[1] !== null && params[1] !== undefined) fields.remarks = params[1];
      } else if (params.length === 2) {
        fields.status = params[0];
      }
      memoryStore.applications[idx] = { ...memoryStore.applications[idx], ...fields, updated_at: new Date() };
      return { rows: [{ ...memoryStore.applications[idx] }] };
    }
    return { rows: [] };
  }

  // UPDATE assigned_to + status
  if (t.startsWith('update verification_applications') && t.includes('assigned_to')) {
    const targetId = params[params.length - 1];
    const idx = memoryStore.applications.findIndex(a => a.id === parseInt(targetId, 10) || a.application_number === String(targetId));
    if (idx !== -1) {
      const assigneeId = params[0] ? parseInt(params[0], 10) : null;
      const assignee = assigneeId ? memoryStore.users.find(u => u.id === assigneeId) : null;
      memoryStore.applications[idx] = {
        ...memoryStore.applications[idx],
        assigned_to: assigneeId,
        assigned_to_name: assignee?.name || null,
        assigned_to_email: assignee?.email || null,
        assigned_to_role: assignee?.role || null,
        status: 'ASSIGNED',
        remarks: params[1] !== undefined && params[1] !== null ? params[1] : memoryStore.applications[idx].remarks,
        updated_at: new Date()
      };
      return { rows: [{ ...memoryStore.applications[idx] }] };
    }
    return { rows: [] };
  }

  // UPDATE scheduled_date + status
  if (t.startsWith('update verification_applications') && t.includes('scheduled_date')) {
    const targetId = params[params.length - 1];
    const idx = memoryStore.applications.findIndex(a => a.id === parseInt(targetId, 10) || a.application_number === String(targetId));
    if (idx !== -1) {
      memoryStore.applications[idx] = {
        ...memoryStore.applications[idx],
        scheduled_date: params[0],
        status: 'SCHEDULED',
        remarks: params[1] !== undefined && params[1] !== null ? params[1] : memoryStore.applications[idx].remarks,
        updated_at: new Date()
      };
      return { rows: [{ ...memoryStore.applications[idx] }] };
    }
    return { rows: [] };
  }

  // ── VERIFICATION RECORDS ──
  if (t.startsWith('insert into verification_records')) {
    const [application_id, officer_id, inspection_date, instrument_condition, accuracy_result, seal_condition, document_result, observations, latitude, longitude, photo_url, result] = params;
    const app = memoryStore.applications.find(a => a.id === parseInt(application_id, 10) || a.application_number === String(application_id));
    const officer = memoryStore.users.find(u => u.id === parseInt(officer_id, 10));
    const nr = {
      id: memoryStore.verifications.length + 1,
      application_id: app?.id || parseInt(application_id, 10),
      application_number: app?.application_number || null,
      applicant_id: app?.applicant_id || null,
      applicant_name: app?.applicant_name || null,
      applicant_email: app?.applicant_email || null,
      instrument_type: app?.instrument_type || null,
      officer_id: officer?.id || parseInt(officer_id, 10),
      officer_name: officer?.name || null,
      officer_email: officer?.email || null,
      inspection_date: inspection_date || new Date().toISOString().split('T')[0],
      instrument_condition: instrument_condition || 'PASS',
      accuracy_result: accuracy_result || 'PASS',
      seal_condition: seal_condition || 'PASS',
      document_result: document_result || 'PASS',
      observations: observations || null,
      latitude: latitude !== undefined && latitude !== null ? parseFloat(latitude) : null,
      longitude: longitude !== undefined && longitude !== null ? parseFloat(longitude) : null,
      photo_url: photo_url || null,
      result: result || 'PASS',
      created_at: new Date()
    };
    memoryStore.verifications.push(nr);
    return { rows: [{ ...nr }] };
  }

  // SELECT verification_records by application_id
  if (t.includes('from verification_records') && (t.includes('where vr.application_id = $1') || t.includes('where application_id = $1'))) {
    const target = params[0];
    const rec = memoryStore.verifications.find(v => v.application_id === parseInt(target, 10) || v.application_number === String(target));
    return { rows: rec ? [{ ...rec }] : [] };
  }

  // SELECT verification_records by id
  if (t.includes('from verification_records') && (t.includes('where vr.id = $1') || t.includes('where id = $1'))) {
    const target = parseInt(params[0], 10);
    const rec = memoryStore.verifications.find(v => v.id === target);
    return { rows: rec ? [{ ...rec }] : [] };
  }

  // SELECT all verification_records
  if (t.includes('from verification_records') && !t.includes('where')) {
    const rows = memoryStore.verifications.map(v => ({ ...v }));
    return { rows };
  }

  // UPDATE verification_records
  if (t.startsWith('update verification_records')) {
    const targetId = parseInt(params[params.length - 1], 10);
    const idx = memoryStore.verifications.findIndex(v => v.id === targetId || v.application_id === targetId);
    if (idx !== -1) {
      const cur = memoryStore.verifications[idx];
      const updated = {
        ...cur,
        ...(params[0] !== undefined && { instrument_condition: params[0] }),
        ...(params[1] !== undefined && { accuracy_result: params[1] }),
        ...(params[2] !== undefined && { seal_condition: params[2] }),
        ...(params[3] !== undefined && { document_result: params[3] }),
        ...(params[4] !== undefined && { observations: params[4] }),
        ...(params[5] !== undefined && { latitude: parseFloat(params[5]) }),
        ...(params[6] !== undefined && { longitude: parseFloat(params[6]) }),
        ...(params[7] !== undefined && { photo_url: params[7] }),
        ...(params[8] !== undefined && { result: params[8] })
      };
      memoryStore.verifications[idx] = updated;
      return { rows: [{ ...updated }] };
    }
    return { rows: [] };
  }

  // ── CERTIFICATES ──
  if (t.startsWith('insert into certificates')) {
    const [certificate_number, application_id, instrument_id, issued_to, issued_date, valid_until, status, pdf_url, qr_token] = params;
    const app = memoryStore.applications.find(a => a.id === parseInt(application_id, 10) || a.application_number === String(application_id));
    const instr = memoryStore.instruments.find(i => i.id === parseInt(instrument_id, 10) || i.instrument_id === String(instrument_id));
    const owner = memoryStore.users.find(u => u.id === parseInt(issued_to, 10));

    const nc = {
      id: memoryStore.certificates.length + 1,
      certificate_number,
      application_id: app?.id || parseInt(application_id, 10),
      application_number: app?.application_number || null,
      instrument_id: instr?.id || parseInt(instrument_id, 10),
      instrument_code: instr?.instrument_id || null,
      instrument_type: instr?.instrument_type || app?.instrument_type || null,
      serial_number: instr?.serial_number || app?.instrument_serial || null,
      model: instr?.model || null,
      capacity: instr?.capacity || null,
      instrument_location: instr?.location || app?.instrument_location || null,
      issued_to: owner?.id || parseInt(issued_to, 10),
      issued_to_name: owner?.name || null,
      issued_to_email: owner?.email || null,
      issued_date: issued_date || new Date().toISOString().split('T')[0],
      valid_until: valid_until,
      status: status || 'VALID',
      pdf_url: pdf_url || `/api/certificates/${certificate_number}/pdf`,
      qr_token: qr_token || generateQrToken(),
      qr_url: `http://localhost:5173/verify/${certificate_number}`,
      issued_by: 'Legal Metrology Department (Govt. of India)',
      officer_name: app?.assigned_to_name || 'Rajesh Sharma (LMO Officer)',
      created_at: new Date()
    };
    memoryStore.certificates.push(nc);
    return { rows: [{ ...nc }] };
  }

  // SELECT certificate by certificate_number
  if (t.includes('from certificates') && (t.includes('where c.certificate_number = $1') || t.includes('where certificate_number = $1'))) {
    const target = String(params[0]).toUpperCase();
    const cert = memoryStore.certificates.find(c => c.certificate_number.toUpperCase() === target);
    return { rows: cert ? [{ ...cert }] : [] };
  }

  // SELECT certificate by application_id
  if (t.includes('from certificates') && (t.includes('where c.application_id = $1') || t.includes('where application_id = $1'))) {
    const target = parseInt(params[0], 10);
    const cert = memoryStore.certificates.find(c => c.application_id === target);
    return { rows: cert ? [{ ...cert }] : [] };
  }

  // SELECT certificate by qr_token
  if (t.includes('from certificates') && (t.includes('where c.qr_token = $1') || t.includes('where qr_token = $1'))) {
    const target = String(params[0]);
    const cert = memoryStore.certificates.find(c => c.qr_token === target);
    return { rows: cert ? [{ ...cert }] : [] };
  }

  // SELECT all certificates
  if (t.includes('from certificates') && !t.includes('where')) {
    const rows = memoryStore.certificates.map(c => ({ ...c }));
    return { rows };
  }

  return { rows: [] };
}

module.exports = {
  initDatabase,
  query,
  isMockDb: () => isMockDb,
  generateAppNumber,
  generateCertificateNumber,
  generateQrToken,
  DEMO_USERS,
  DEMO_INSTRUMENTS,
  DEMO_APPLICATIONS,
  DEMO_VERIFICATIONS,
  DEMO_CERTIFICATES
};
