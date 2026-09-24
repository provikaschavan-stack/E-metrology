const db = require('../config/db');

async function findByEmail(email) {
  const res = await db.query(
    'SELECT id, name, email, password_hash, role, phone, created_at FROM users WHERE email = $1',
    [email]
  );
  return res.rows[0] || null;
}

async function findById(id) {
  const res = await db.query(
    'SELECT id, name, email, role, phone, created_at FROM users WHERE id = $1',
    [id]
  );
  return res.rows[0] || null;
}

async function create({ name, email, password_hash, role, phone }) {
  const res = await db.query(
    'INSERT INTO users (name, email, password_hash, role, phone) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role, phone, created_at',
    [name, email, password_hash, role, phone]
  );
  return res.rows[0];
}

module.exports = {
  findByEmail,
  findById,
  create
};
