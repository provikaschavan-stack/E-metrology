const assert = require('assert');
const http = require('http');

const BASE_URL = 'http://localhost:5000/api';

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const fullPath = path.startsWith('/') ? path : '/' + path;
    const url = new URL('/api' + fullPath, 'http://localhost:5000');
    const headers = options.headers || {};
    if (options.body && typeof options.body === 'object') {
      options.body = JSON.stringify(options.body);
      headers['Content-Type'] = 'application/json';
    }

    const req = http.request(
      url,
      {
        method: options.method || 'GET',
        headers
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          let parsed;
          try {
            parsed = JSON.parse(data);
          } catch {
            parsed = data;
          }
          resolve({ status: res.statusCode, headers: res.headers, body: parsed });
        });
      }
    );

    req.on('error', reject);
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

async function login(email, password) {
  const res = await request('/auth/login', {
    method: 'POST',
    body: { email, password }
  });
  if (res.status !== 200) {
    throw new Error(`Login failed for ${email}: ${JSON.stringify(res.body)}`);
  }
  return res.body.data.token;
}

async function runVerificationTests() {
  console.log('====================================================');
  console.log('🧪 TESTING FIELD VERIFICATION MODULE (APIs & WORKFLOW)');
  console.log('====================================================');

  // Step 1: Login all roles
  const traderToken = await login('trader@bharatretail.in', 'Password@123');
  const lmoToken = await login('officer.sharma@lmo.gov.in', 'Password@123');
  const gatcToken = await login('lab.head@gatc-pune.gov.in', 'Password@123');
  const adminToken = await login('controller.hq@doca.gov.in', 'Password@123');
  console.log('✅ 1. Logged in as Trader (BUSINESS), LMO Officer, GATC Lab, and Metrology Controller (ADMIN).');

  // Step 2: Test GET /api/verifications/:id (Seeded verification)
  const getByIdRes = await request('/verifications/1', {
    headers: { Authorization: `Bearer ${lmoToken}` }
  });
  assert.strictEqual(getByIdRes.status, 200, 'GET /api/verifications/1 should return 200');
  assert.strictEqual(getByIdRes.body.data.result, 'PASS', 'Verification result should be PASS');
  console.log('✅ 2. GET /api/verifications/:id -> Found verification record #1 with joined details.');

  // Step 3: Test GET /api/verifications/application/:applicationId
  const getByAppRes = await request('/verifications/application/APP-2026-0001', {
    headers: { Authorization: `Bearer ${traderToken}` }
  });
  assert.strictEqual(getByAppRes.status, 200, 'GET /api/verifications/application/APP-2026-0001 should return 200');
  assert.strictEqual(getByAppRes.body.data.officer_name, 'Rajesh Sharma (LMO Officer)');
  console.log('✅ 3. GET /api/verifications/application/:appId -> Fetched inspection record for applicant.');

  // Step 4: LMO creates verification for assigned application APP-2026-0002
  const createRes = await request('/verifications', {
    method: 'POST',
    headers: { Authorization: `Bearer ${lmoToken}` },
    body: {
      application_number: 'APP-2026-0002',
      inspection_date: '2026-08-27',
      instrument_condition: 'PASS - Fuel dispenser nozzle calibration intact',
      accuracy_result: 'PASS - Metering error within 0.05% under 20L check measure',
      seal_condition: 'PASS - Secure tamper-evident wire seal affixed',
      document_result: 'PASS - Weights & Measures verification book signed',
      observations: 'Inspected 4-arm MPD dispenser. Flow rate and delivery measure verified on-site.',
      latitude: 18.5204,
      longitude: 73.8567,
      photo_url: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80',
      result: 'PASS'
    }
  });

  assert.strictEqual(createRes.status, 201, `POST /api/verifications should return 201: ${JSON.stringify(createRes.body)}`);
  assert.strictEqual(createRes.body.data.result, 'PASS');
  assert.strictEqual(createRes.body.data.application_status, 'UNDER_REVIEW', 'Application status should advance to UNDER_REVIEW');
  const newVerificationId = createRes.body.data.id;
  console.log(`✅ 4. LMO: POST /api/verifications -> Status: 201 Verification ID: #${newVerificationId} Application transitioned to: UNDER_REVIEW`);

  // Step 5: Check Application Status in Application API
  const appCheckRes = await request('/applications/APP-2026-0002', {
    headers: { Authorization: `Bearer ${lmoToken}` }
  });
  assert.strictEqual(appCheckRes.status, 200);
  const appData = appCheckRes.body.data.application || appCheckRes.body.data;
  assert.strictEqual(appData.status, 'UNDER_REVIEW', 'Application status must be UNDER_REVIEW in database');
  console.log('✅ 5. Verified Application record state: status is now UNDER_REVIEW with officer inspection notes.');

  // Step 6: Test PUT /api/verifications/:id (Update inspection observation)
  const updateRes = await request(`/verifications/${newVerificationId}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${lmoToken}` },
    body: {
      observations: 'Updated: On-site verification completed and counter-signed by station manager.',
      result: 'PASS'
    }
  });
  assert.strictEqual(updateRes.status, 200, `PUT /api/verifications/${newVerificationId} should return 200`);
  assert.ok(updateRes.body.data.observations.includes('counter-signed'));
  console.log('✅ 6. LMO: PUT /api/verifications/:id -> Observations and details updated successfully.');

  // Step 7: RBAC & Validation Checks
  // 7a: Trader cannot submit field verification
  const forbiddenRes1 = await request('/verifications', {
    method: 'POST',
    headers: { Authorization: `Bearer ${traderToken}` },
    body: { application_number: 'APP-2026-0002', result: 'PASS' }
  });
  assert.strictEqual(forbiddenRes1.status, 403, 'Trader should get 403 Forbidden');
  console.log('✅ 7a. RBAC: BUSINESS attempting to submit field verification -> 403 Forbidden as expected.');

  // 7b: Invalid result value
  const badResultRes = await request('/verifications', {
    method: 'POST',
    headers: { Authorization: `Bearer ${lmoToken}` },
    body: { application_number: 'APP-2026-0002', result: 'INVALID_RESULT' }
  });
  assert.strictEqual(badResultRes.status, 400, 'Invalid result should return 400 Bad Request');
  console.log('✅ 7b. Validation: Invalid result value rejected with 400 Bad Request.');

  console.log('====================================================');
  console.log('🎉 ALL FIELD VERIFICATION MODULE TESTS PASSED!');
  console.log('====================================================');
}

if (require.main === module) {
  runVerificationTests()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ Test failed:', err);
      process.exit(1);
    });
}

module.exports = { runVerificationTests };
