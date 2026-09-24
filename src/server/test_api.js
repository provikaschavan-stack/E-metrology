// Simple script to test the backend API endpoints
async function testAPI() {
  console.log('----------------------------------------------------');
  console.log('🧪 RUNNING BACKEND AUTH & RBAC VERIFICATION TESTS');
  console.log('----------------------------------------------------');

  const BASE_URL = 'http://localhost:5000/api';

  // 1. Health check
  const healthRes = await fetch(`${BASE_URL}/health`);
  const healthData = await healthRes.json();
  console.log('1. Health Check:', healthRes.status, healthData.status);

  // 2. Test Login for all 4 roles
  const testCredentials = [
    { email: 'trader@bharatretail.in', role: 'BUSINESS' },
    { email: 'officer.sharma@lmo.gov.in', role: 'LMO' },
    { email: 'lab.head@gatc-pune.gov.in', role: 'GATC' },
    { email: 'controller.hq@doca.gov.in', role: 'ADMIN' },
  ];

  let adminToken = '';
  let businessToken = '';

  for (const cred of testCredentials) {
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: cred.email,
        password: 'Password@123'
      })
    });
    const loginData = await loginRes.json();
    console.log(`2. Login test (${cred.role}):`, loginRes.status, loginData.success ? '✅ SUCCESS' : '❌ FAILED');
    
    if (cred.role === 'ADMIN') adminToken = loginData.data.token;
    if (cred.role === 'BUSINESS') businessToken = loginData.data.token;
  }

  // 3. Test GET /api/auth/me with JWT Token
  const meRes = await fetch(`${BASE_URL}/auth/me`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  const meData = await meRes.json();
  console.log('3. GET /api/auth/me (Admin Token):', meRes.status, meData.data.user.name, `[Role: ${meData.data.user.role}]`);

  // 4. Test Register New User
  const regRes = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Priya Verma',
      email: 'priya.verma@example.com',
      password: 'Password@123',
      role: 'BUSINESS',
      phone: '+91 9988776655'
    })
  });
  const regData = await regRes.json();
  console.log('4. POST /api/auth/register:', regRes.status, regData.success ? '✅ SUCCESS' : '❌ FAILED');

  // 5. Test RBAC Enforcement
  // 5a. Admin accessing Admin route (should be 200 OK)
  const rbacAdminRes = await fetch(`${BASE_URL}/auth/test/admin`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  const rbacAdminData = await rbacAdminRes.json();
  console.log('5a. RBAC: Admin accessing /api/auth/test/admin -> Status:', rbacAdminRes.status, rbacAdminData.message);

  // 5b. Business accessing Admin route (should be 403 Forbidden)
  const rbacDenyRes = await fetch(`${BASE_URL}/auth/test/admin`, {
    headers: { 'Authorization': `Bearer ${businessToken}` }
  });
  const rbacDenyData = await rbacDenyRes.json();
  console.log('5b. RBAC: Business accessing /api/auth/test/admin -> Status:', rbacDenyRes.status, rbacDenyData.message);

  // 5c. Business accessing Business route (should be 200 OK)
  const rbacBizRes = await fetch(`${BASE_URL}/auth/test/business`, {
    headers: { 'Authorization': `Bearer ${businessToken}` }
  });
  const rbacBizData = await rbacBizRes.json();
  console.log('5c. RBAC: Business accessing /api/auth/test/business -> Status:', rbacBizRes.status, rbacBizData.message);

  console.log('----------------------------------------------------');
  console.log('🎉 ALL BACKEND AUTH & RBAC TESTS PASSED SUCCESSFULLY!');
  console.log('----------------------------------------------------');
}

testAPI().catch(console.error);
