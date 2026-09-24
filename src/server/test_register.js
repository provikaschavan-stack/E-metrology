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
  console.log('🧪 TESTING USER & OFFICER REGISTRATION (API & RBAC)');
  console.log('====================================================');

  const randSuffix = Math.floor(1000 + Math.random() * 9000);

  // 1. Register new Trader / User (BUSINESS)
  const traderEmail = `new.trader.${randSuffix}@mumbaimarket.in`;
  const regTrader = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/register',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    name: `Mumbai Agro Retailers Pvt Ltd #${randSuffix}`,
    email: traderEmail,
    password: 'Password@123',
    role: 'BUSINESS',
    phone: '+91 98200 55443'
  });

  if (regTrader.status === 201 && regTrader.data.data?.token) {
    console.log('✅ 1. Registered New Business / Trader (User):', {
      id: regTrader.data.data.user.id,
      name: regTrader.data.data.user.name,
      email: regTrader.data.data.user.email,
      role: regTrader.data.data.user.role
    });
  } else {
    console.error('❌ 1. Trader registration failed:', regTrader);
    process.exit(1);
  }

  // 2. Register new Legal Metrology Officer (LMO)
  const officerEmail = `inspector.patil.${randSuffix}@lmo.gov.in`;
  const regOfficer = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/register',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    name: `Inspector Suresh Patil (Zone-${randSuffix % 10 + 1})`,
    email: officerEmail,
    password: 'Password@123',
    role: 'LMO',
    phone: '+91 98220 88776'
  });

  if (regOfficer.status === 201 && regOfficer.data.data?.token) {
    console.log('✅ 2. Registered New Legal Metrology Officer (LMO):', {
      id: regOfficer.data.data.user.id,
      name: regOfficer.data.data.user.name,
      email: regOfficer.data.data.user.email,
      role: regOfficer.data.data.user.role
    });
  } else {
    console.error('❌ 2. Officer registration failed:', regOfficer);
    process.exit(1);
  }

  // 3. Register new GATC Testing Lab Head (GATC)
  const labEmail = `director.lab.${randSuffix}@gatc-nagpur.gov.in`;
  const regLab = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/register',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    name: `Nagpur Regional GATC Standard Calibration Facility`,
    email: labEmail,
    password: 'Password@123',
    role: 'GATC',
    phone: '+91 98110 33221'
  });

  if (regLab.status === 201 && regLab.data.data?.token) {
    console.log('✅ 3. Registered New GATC Lab Head (Officer):', {
      id: regLab.data.data.user.id,
      name: regLab.data.data.user.name,
      email: regLab.data.data.user.email,
      role: regLab.data.data.user.role
    });
  } else {
    console.error('❌ 3. GATC Lab registration failed:', regLab);
    process.exit(1);
  }

  // 4. Test Login with Newly Registered Accounts
  const loginTrader = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { email: traderEmail, password: 'Password@123' });

  if (loginTrader.status === 200 && loginTrader.data.data?.token) {
    console.log('✅ 4a. Authenticated Newly Registered Trader successfully. Token length:', loginTrader.data.data.token.length);
  } else {
    console.error('❌ 4a. Trader login failed:', loginTrader);
    process.exit(1);
  }

  const loginOfficer = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { email: officerEmail, password: 'Password@123' });

  if (loginOfficer.status === 200 && loginOfficer.data.data?.token) {
    console.log('✅ 4b. Authenticated Newly Registered Officer successfully. Role:', loginOfficer.data.data.user.role);
  } else {
    console.error('❌ 4b. Officer login failed:', loginOfficer);
    process.exit(1);
  }

  // 5. Test Duplicate Email Rejection
  const dupReg = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/register',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    name: 'Duplicate Attempt',
    email: traderEmail,
    password: 'Password@123',
    role: 'BUSINESS'
  });

  if (dupReg.status === 409) {
    console.log('✅ 5. Duplicate email rejection (409 Conflict) handled correctly.');
  } else {
    console.error('❌ 5. Duplicate email was not properly rejected with 409:', dupReg);
    process.exit(1);
  }

  console.log('====================================================');
  console.log('🎉 ALL USER & OFFICER REGISTRATION TESTS PASSED!');
  console.log('====================================================');
}

runTests().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
