const http = require('http');

function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body), headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, data: body, headers: res.headers });
        }
      });
    });
    req.on('error', reject);
    if (data) {
      req.write(typeof data === 'string' ? data : JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('====================================================');
  console.log('🧪 TESTING DIGITAL CERTIFICATES & PUBLIC QR VERIFICATION');
  console.log('====================================================');

  // 1. Test Public Verification (UNAUTHENTICATED) for VALID certificate
  const pubValid = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/public/verify/LM-CERT-2026-00001',
    method: 'GET'
  });

  if (pubValid.status === 200 && pubValid.data?.data?.status === 'VALID') {
    console.log('✅ 1. Public Verify (VALID): Status: 200', {
      cert: pubValid.data.data.certificate_number,
      instrument_id: pubValid.data.data.instrument_id,
      instrument_type: pubValid.data.data.instrument_type,
      serial_number: pubValid.data.data.serial_number,
      verification_date: pubValid.data.data.verification_date,
      valid_until: pubValid.data.data.valid_until,
      status: pubValid.data.data.status,
      issued_by: pubValid.data.data.issued_by
    });
  } else {
    console.error('❌ 1. Public Verify (VALID) Failed:', pubValid);
    process.exit(1);
  }

  // 2. Test Public Verification for EXPIRING_SOON certificate
  const pubExpiring = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/public/verify/LM-CERT-2026-00084',
    method: 'GET'
  });

  if (pubExpiring.status === 200 && pubExpiring.data?.data?.status === 'EXPIRING_SOON') {
    console.log('✅ 2. Public Verify (EXPIRING_SOON): Status: 200', {
      cert: pubExpiring.data.data.certificate_number,
      status: pubExpiring.data.data.status,
      valid_until: pubExpiring.data.data.valid_until
    });
  } else {
    console.error('❌ 2. Public Verify (EXPIRING_SOON) Failed:', pubExpiring);
    process.exit(1);
  }

  // 3. Test Public Verification for EXPIRED certificate
  const pubExpired = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/public/verify/LM-CERT-2025-00411',
    method: 'GET'
  });

  if (pubExpired.status === 200 && pubExpired.data?.data?.status === 'EXPIRED') {
    console.log('✅ 3. Public Verify (EXPIRED): Status: 200', {
      cert: pubExpired.data.data.certificate_number,
      status: pubExpired.data.data.status
    });
  } else {
    console.error('❌ 3. Public Verify (EXPIRED) Failed:', pubExpired);
    process.exit(1);
  }

  // 4. Test Public Verification for INVALID / Non-existent certificate
  const pubInvalid = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/public/verify/LM-CERT-UNKNOWN-999',
    method: 'GET'
  });

  if (pubInvalid.status === 200 && pubInvalid.data?.data?.status === 'INVALID') {
    console.log('✅ 4. Public Verify (INVALID / Not Found): Status: 200 -> Status: INVALID');
  } else {
    console.error('❌ 4. Public Verify (INVALID) Failed:', pubInvalid);
    process.exit(1);
  }

  // 5. Test Detailed Certificate Endpoint GET /api/certificates/:certificateNumber
  const detailedCert = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/certificates/LM-CERT-2026-00001',
    method: 'GET'
  });

  if (detailedCert.status === 200 && detailedCert.data?.data?.certificate_number === 'LM-CERT-2026-00001') {
    console.log('✅ 5. GET /api/certificates/:certNumber -> Found details with QR URL:', detailedCert.data.data.qr_url);
  } else {
    console.error('❌ 5. Detailed Certificate Fetch Failed:', detailedCert);
    process.exit(1);
  }

  // 6. Test Automatic Certificate Generation on Application Approval
  // 6a. Login as Trader (BUSINESS) to submit app
  const traderLogin = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { email: 'trader@bharatretail.in', password: 'Password@123' });
  const traderToken = traderLogin.data.data.token;

  // 6b. Login as Admin
  const adminLogin = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { email: 'controller.hq@doca.gov.in', password: 'Password@123' });
  const adminToken = adminLogin.data.data.token;

  // 6c. Login as LMO
  const lmoLogin = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { email: 'officer.sharma@lmo.gov.in', password: 'Password@123' });
  const lmoToken = lmoLogin.data.data.token;

  // 6d. Submit new verification application
  const submitApp = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/applications',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${traderToken}`
    }
  }, {
    instrument_id: 'INS-2026-00001',
    application_type: 'VERIFICATION',
    remarks: 'Statutory verification cycle 2026-2027.'
  });

  const appObj = submitApp.data.data.application || submitApp.data.data;
  const newAppId = appObj.id;
  const newAppNo = appObj.application_number;
  console.log(`✅ 6a. Trader submitted application: ${newAppNo} (ID: ${newAppId})`);

  // 6e. Admin assigns to LMO
  await request({
    hostname: 'localhost',
    port: 5000,
    path: `/api/applications/${newAppId}/assign`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    }
  }, {
    assigned_to: 2,
    remarks: 'Assigned to Rajesh Sharma (LMO).'
  });

  // 6f. LMO schedules
  await request({
    hostname: 'localhost',
    port: 5000,
    path: `/api/applications/${newAppId}/schedule`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${lmoToken}`
    }
  }, {
    scheduled_date: '2026-08-30',
    remarks: 'Scheduled for scale accuracy verification.'
  });

  // 6g. LMO conducts field verification
  await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/verifications',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${lmoToken}`
    }
  }, {
    application_id: newAppId,
    inspection_date: '2026-08-30',
    instrument_condition: 'PASS - Housing intact',
    accuracy_result: 'PASS - Error ±0.01g',
    seal_condition: 'PASS - Lead seal intact',
    document_result: 'PASS - Model cert verified',
    observations: 'Instrument meets all statutory precision standards.',
    result: 'PASS'
  });

  // 6h. LMO Approves Application -> Must trigger automatic Certificate generation
  const approveRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: `/api/applications/${newAppId}`,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${lmoToken}`
    }
  }, {
    status: 'APPROVED',
    remarks: 'Approved after successful physical verification.'
  });

  console.log('✅ 6b. Application approved. Status:', approveRes.data.data?.status);

  // 6i. Verify that Digital Certificate was automatically created
  const allCertsRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/certificates',
    method: 'GET'
  });

  const generatedCert = allCertsRes.data.data.find(c => c.application_id === newAppId || c.application_number === newAppNo);
  if (generatedCert) {
    console.log('✅ 6c. Digital Certificate Automatically Generated:', {
      certificate_number: generatedCert.certificate_number,
      application_number: generatedCert.application_number,
      status: generatedCert.status,
      valid_until: generatedCert.valid_until,
      qr_token: generatedCert.qr_token,
      qr_url: generatedCert.qr_url
    });

    // 6j. Test Public Verify on this newly generated certificate
    const newPubVerify = await request({
      hostname: 'localhost',
      port: 5000,
      path: `/api/public/verify/${generatedCert.certificate_number}`,
      method: 'GET'
    });

    if (newPubVerify.status === 200 && newPubVerify.data?.data?.status === 'VALID') {
      console.log('✅ 6d. Newly generated certificate is PUBLICLY VERIFIABLE without login:', newPubVerify.data.data);
    } else {
      console.error('❌ 6d. Public verification on newly generated certificate failed:', newPubVerify);
      process.exit(1);
    }
  } else {
    console.error('❌ 6c. Certificate was not found for approved application:', allCertsRes);
    process.exit(1);
  }

  console.log('====================================================');
  console.log('🎉 ALL DIGITAL CERTIFICATE & QR VERIFICATION TESTS PASSED!');
  console.log('====================================================');
}

runTests().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
