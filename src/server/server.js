const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const db = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const instrumentRoutes = require('./routes/instrument.routes');
const applicationRoutes = require('./routes/application.routes');
const verificationRoutes = require('./routes/verification.routes');
const certificateRoutes = require('./routes/certificate.routes');
const publicRoutes = require('./routes/public.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging in development
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'e-Metrology Backend API',
    ps_id: '26036',
    timestamp: new Date().toISOString(),
    db_mode: db.isMockDb() ? 'in-memory (postgres fallback)' : 'postgresql-live'
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/instruments', instrumentRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/verifications', verificationRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/public', publicRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// Start Server
async function startServer() {
  await db.initDatabase();

  const server = app.listen(env.PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 e-Metrology Backend running at http://localhost:${env.PORT}`);
    console.log(`📌 PS ID: 26036 - Legal Metrology Online Verification`);
    console.log(`🔐 JWT Auth & RBAC Active (BUSINESS, LMO, GATC, ADMIN)`);
    console.log(`⚖️ Instrument Management API Active at /api/instruments`);
    console.log(`=======================================================`);
  });

  return server;
}

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
