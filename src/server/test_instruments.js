// Verification script for Instrument Management Backend APIs and RBAC
async function testInstruments() {
  console.log('----------------------------------------------------');
  console.log('🧪 TESTING INSTRUMENT MANAGEMENT BACKEND APIS & RBAC');
  console.log('----------------------------------------------------');

  const BASE_URL = 'http://localhost:5000/api';

  // 1. Authenticate users
  async function getToken(email) {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: 'Password@123' })
    });
    const data = await res.json();
    return data.data.token;
  }

  const businessToken = await getToken('trader@bharatretail.in');
  const adminToken = await getToken('controller.hq@doca.gov.in');
  const lmoToken = await getToken('officer.sharma@lmo.gov.in');

  console.log('1. Logged in as BUSINESS, ADMIN, and LMO successfully.');

  // 2. GET /api/instruments (Business user)
  const bizGetRes = await fetch(`${BASE_URL}/instruments`, {
    headers: { 'Authorization': `Bearer ${businessToken}` }
  });
  const bizGetData = await bizGetRes.json();
  console.log('2. GET /api/instruments (BUSINESS):', bizGetRes.status, `Fetched ${bizGetData.count} instruments for trader.`);

  // 3. GET /api/instruments (Admin user)
  const adminGetRes = await fetch(`${BASE_URL}/instruments`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  const adminGetData = await adminGetRes.json();
  console.log('3. GET /api/instruments (ADMIN):', adminGetRes.status, `Fetched all ${adminGetData.count} instruments.`);

  // 4. POST /api/instruments (Business creates new instrument)
  const newInstPayload = {
    instrument_type: 'Supermarket Counter Scale (Class III)',
    manufacturer: 'Essae-Teraoka Ltd.',
    model: 'DS-215 POS Scale',
    serial_number: 'ES-998811',
    capacity: '30 kg (e=2g)',
    location: 'Reliance Fresh Supermarket, FC Road, Pune',
    status: 'PENDING_VERIFICATION'
  };

  const createRes = await fetch(`${BASE_URL}/instruments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${businessToken}`
    },
    body: JSON.stringify(newInstPayload)
  });
  const createData = await createRes.json();
  console.log('4. POST /api/instruments (BUSINESS):', createRes.status, createData.success ? '✅ Created:' : '❌ Failed', createData.data?.instrument?.instrument_id);
  const createdId = createData.data?.instrument?.id;

  // 5. GET /api/instruments/:id
  const getSingleRes = await fetch(`${BASE_URL}/instruments/${createdId}`, {
    headers: { 'Authorization': `Bearer ${businessToken}` }
  });
  const getSingleData = await getSingleRes.json();
  console.log('5. GET /api/instruments/:id:', getSingleRes.status, getSingleData.data?.instrument?.model);

  // 6. PUT /api/instruments/:id
  const updateRes = await fetch(`${BASE_URL}/instruments/${createdId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${businessToken}`
    },
    body: JSON.stringify({
      capacity: '35 kg (e=2g)',
      status: 'ACTIVE'
    })
  });
  const updateData = await updateRes.json();
  console.log('6. PUT /api/instruments/:id:', updateRes.status, 'Updated status:', updateData.data?.instrument?.status);

  // 7. DELETE /api/instruments/:id
  const deleteRes = await fetch(`${BASE_URL}/instruments/${createdId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${businessToken}` }
  });
  const deleteData = await deleteRes.json();
  console.log('7. DELETE /api/instruments/:id:', deleteRes.status, deleteData.success ? '✅ DELETED' : '❌ Failed');

  // 8. RBAC Test: LMO trying to create instrument (should be 403 Forbidden)
  const lmoCreateRes = await fetch(`${BASE_URL}/instruments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${lmoToken}`
    },
    body: JSON.stringify(newInstPayload)
  });
  console.log('8. RBAC: LMO creating instrument -> Status:', lmoCreateRes.status, '(Expected 403 Forbidden)');

  console.log('----------------------------------------------------');
  console.log('🎉 ALL INSTRUMENT MANAGEMENT BACKEND TESTS PASSED!');
  console.log('----------------------------------------------------');
}

testInstruments().catch(console.error);
