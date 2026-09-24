const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const NODE_ENV = process.env.NODE_ENV || 'development';
const JWT_SECRET = process.env.JWT_SECRET || (NODE_ENV === 'production' ? null : 'local-development-only-change-me');
const SUPABASE_DB_URL = process.env.SUPABASE_DB_URL || null;
const DATABASE_URL = SUPABASE_DB_URL || process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/emetrology';
const DATABASE_SSL = String(process.env.DATABASE_SSL || (SUPABASE_DB_URL ? 'true' : 'false')).toLowerCase() === 'true';

if (NODE_ENV === 'production' && (!JWT_SECRET || JWT_SECRET.length < 32)) {
  throw new Error('JWT_SECRET must be configured with at least 32 characters in production.');
}

module.exports = {
  PORT: process.env.PORT || 5000,
  DATABASE_URL,
  DATABASE_SSL,
  DATABASE_PROVIDER: SUPABASE_DB_URL ? 'supabase' : 'postgresql',
  DB_USER: process.env.DB_USER || 'postgres',
  DB_PASSWORD: process.env.DB_PASSWORD || 'postgres',
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: parseInt(process.env.DB_PORT || '5432', 10),
  DB_NAME: process.env.DB_NAME || 'emetrology',
  JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  NODE_ENV,
  PUBLIC_APP_URL: process.env.PUBLIC_APP_URL || 'http://localhost:5173',
  CORS_ORIGINS: (process.env.CORS_ORIGINS || 'http://localhost:5173').split(',').map(origin => origin.trim()).filter(Boolean)
};
