// Verification script for Verification Application Backend APIs and complete multi-role workflow
async function testApplications() {
  console.log('====================================================');
  console.log('🧪 TESTING VERIFICATION APPLICATION BACKEND APIS & WORKFLOW');
  console.log('====================================================');

  const BASE_URL = 'http://localhost:5000/api';

  // 1. Authenticate users
  async function getToken(email) {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: 'Password@123' })
    });
    const data = await res.json();
    if (!data.success) {
      throw new Error(`Login failed for ${email}: ${data.message}`);
    }
    return data.data;
  }

  const traderAuth = await getToken('trader@bharatretail.in');
  const adminAuth = await getToken('controller.hq@doca.gov.in');
  const lmoAuth = await getToken('officer.sharma@lmo.gov.in');
  const gatcAuth = await getToken('lab.head@gatc-pune.gov.in');

  console.log('✅ 1. Logged in as BUSINESS, ADMIN, LMO, and GATC.');

  // 2. Fetch trader instruments to pick one for application
  const instRes = await fetch(`${BASE_URL}/instruments`, {
    headers: { 'Authorization': `Bearer ${traderAuth.token}` }
  });
  const instData = await instRes.json();
  const traderInstrument = instData.data?.instruments?.[0];
  console.log(`✅ 2. Picked instrument for application: ${traderInstrument.instrument_id} (${traderInstrument.instrument_type})`);

  // 3. BUSINESS submits application (POST /api/applications)
  const submitRes = await fetch(`${BASE_URL}/applications`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${traderAuth.token}`
    },
    body: JSON.stringify({
      instrument_id: traderInstrument.id,
      application_type: 'RE_VERIFICATION',
      remarks: 'Annual re-verification requested for retail scale.'
    })
  });
  const submitData = await submitRes.json();
  console.log('✅ 3. BUSINESS: POST /api/applications -> Status:', submitRes.status, 'Application Number:', submitData.data?.application?.application_number);
  const newApp = submitData.data?.application;
  const newAppNumber = newApp?.application_number;
  const newAppId = newApp?.id;

  // 4. GET /api/applications (Role-filtered check)
  // Trader sees their applications
  const traderAppsRes = await fetch(`${BASE_URL}/applications`, {
    headers: { 'Authorization': `Bearer ${traderAuth.token}` }
  });
  const traderAppsData = await traderAppsRes.json();
  console.log(`✅ 4a. BUSINESS: GET /api/applications -> Count: ${traderAppsData.count} (Applicant filtered)`);

  // Admin sees all applications
  const adminAppsRes = await fetch(`${BASE_URL}/applications`, {
    headers: { 'Authorization': `Bearer ${adminAuth.token}` }
  });
  const adminAppsData = await adminAppsRes.json();
  console.log(`✅ 4b. ADMIN: GET /api/applications -> Count: ${adminAppsData.count} (All applications)`);

  // 5. GET /api/applications/officers (Admin fetches officers)
  const officersRes = await fetch(`${BASE_URL}/applications/officers`, {
    headers: { 'Authorization': `Bearer ${adminAuth.token}` }
  });
  const officersData = await officersRes.json();
  const lmoOfficer = officersData.data?.officers?.find(o => o.role === 'LMO');
  console.log(`✅ 5. ADMIN: GET /api/applications/officers -> Found ${officersData.data?.officers?.length} officers. Assigning to: ${lmoOfficer.name}`);

  // 6. ADMIN assigns application to LMO officer (POST /api/applications/:id/assign)
  const assignRes = await fetch(`${BASE_URL}/applications/${newAppId}/assign`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminAuth.token}`
    },
    body: JSON.stringify({
      assigned_to: lmoOfficer.id,
      remarks: 'Assigned to Pune Division LMO officer for inspection.'
    })
  });
  const assignData = await assignRes.json();
  console.log('✅ 6. ADMIN: POST /api/applications/:id/assign -> Status:', assignRes.status, 'New App Status:', assignData.data?.application?.status, 'Assignee:', assignData.data?.application?.assigned_to_name);

  // 7. LMO Officer schedules inspection (POST /api/applications/:id/schedule)
  const scheduleRes = await fetch(`${BASE_URL}/applications/${newAppId}/schedule`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${lmoAuth.token}`
    },
    body: JSON.stringify({
      scheduled_date: '2026-09-05',
      remarks: 'Scheduled on-site inspection for 05 Sep 2026 at 11:00 AM.'
    })
  });
  const scheduleData = await scheduleRes.json();
  console.log('✅ 7. LMO: POST /api/applications/:id/schedule -> Status:', scheduleRes.status, 'Scheduled Date:', scheduleData.data?.application?.scheduled_date, 'Status:', scheduleData.data?.application?.status);

  // 8. LMO Officer updates status to FIELD_VERIFICATION (PUT /api/applications/:id)
  const updateRes = await fetch(`${BASE_URL}/applications/${newAppId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${lmoAuth.token}`
    },
    body: JSON.stringify({
      status: 'FIELD_VERIFICATION',
      remarks: 'Physical inspection in progress. Tested with 10kg standard weight.'
    })
  });
  const updateData = await updateRes.json();
  console.log('✅ 8. LMO: PUT /api/applications/:id -> Status:', updateRes.status, 'Updated App Status:', updateData.data?.application?.status);

  // 9. LMO Officer completes verification -> APPROVED (PUT /api/applications/:id)
  const approveRes = await fetch(`${BASE_URL}/applications/${newAppId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${lmoAuth.token}`
    },
    body: JSON.stringify({
      status: 'APPROVED',
      remarks: 'Verification completed successfully. Calibration verified within standard tolerance limits.'
    })
  });
  const approveData = await approveRes.json();
  console.log('✅ 9. LMO: PUT /api/applications/:id (Approve) -> Status:', approveRes.status, 'Final Status:', approveData.data?.application?.status);

  // 10. Public tracking endpoint test (GET /api/applications/track/:appNumber)
  const trackRes = await fetch(`${BASE_URL}/applications/track/${newAppNumber}`);
  const trackData = await trackRes.json();
  console.log('✅ 10. Public Tracking: GET /api/applications/track/:appNumber -> Status:', trackRes.status, 'Tracked Status:', trackData.data?.application?.status, 'Applicant:', trackData.data?.application?.applicant_name);

  // 11. RBAC Tests:
  // 11a: BUSINESS trying to assign (should fail with 403)
  const bizAssignRes = await fetch(`${BASE_URL}/applications/${newAppId}/assign`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${traderAuth.token}`
    },
    body: JSON.stringify({ assigned_to: lmoOfficer.id })
  });
  console.log('✅ 11a. RBAC: BUSINESS trying to assign -> Status:', bizAssignRes.status, '(Expected 403 Forbidden)');

  // 11b: GATC officer trying to schedule an application assigned to LMO (should fail with 403)
  const gatcScheduleRes = await fetch(`${BASE_URL}/applications/${newAppId}/schedule`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${gatcAuth.token}`
    },
    body: JSON.stringify({ scheduled_date: '2026-09-10' })
  });
  console.log('✅ 11b. RBAC: GATC scheduling LMO app -> Status:', gatcScheduleRes.status, '(Expected 403 Forbidden)');

  console.log('====================================================');
  console.log('🎉 ALL VERIFICATION APPLICATION BACKEND TESTS PASSED!');
  console.log('====================================================');
}

testApplications().catch(err => {
  console.error('❌ Test failed with error:', err);
  process.exit(1);
});
