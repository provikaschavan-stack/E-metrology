const db = require('../config/db');

async function create({
  instrument_id,
  owner_id,
  instrument_type,
  manufacturer,
  model,
  serial_number,
  capacity,
  location,
  registration_date,
  status = 'PENDING_VERIFICATION'
}) {
  const queryText = `
    INSERT INTO instruments (
      instrument_id,
      owner_id,
      instrument_type,
      manufacturer,
      model,
      serial_number,
      capacity,
      location,
      registration_date,
      status
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING id, instrument_id, owner_id, instrument_type, manufacturer, model, serial_number, capacity, location, registration_date, status, created_at;
  `;

  const values = [
    instrument_id,
    owner_id,
    instrument_type,
    manufacturer,
    model,
    serial_number,
    capacity,
    location,
    registration_date || new Date().toISOString().split('T')[0],
    status
  ];

  const res = await db.query(queryText, values);
  return res.rows[0];
}

async function findAll() {
  const queryText = `
    SELECT 
      i.id,
      i.instrument_id,
      i.owner_id,
      u.name AS owner_name,
      u.email AS owner_email,
      u.phone AS owner_phone,
      i.instrument_type,
      i.manufacturer,
      i.model,
      i.serial_number,
      i.capacity,
      i.location,
      i.registration_date,
      i.status,
      i.created_at
    FROM instruments i
    LEFT JOIN users u ON i.owner_id = u.id
    ORDER BY i.id DESC;
  `;
  const res = await db.query(queryText);
  return res.rows;
}

async function findByOwnerId(owner_id) {
  const queryText = `
    SELECT 
      i.id,
      i.instrument_id,
      i.owner_id,
      u.name AS owner_name,
      u.email AS owner_email,
      i.instrument_type,
      i.manufacturer,
      i.model,
      i.serial_number,
      i.capacity,
      i.location,
      i.registration_date,
      i.status,
      i.created_at
    FROM instruments i
    LEFT JOIN users u ON i.owner_id = u.id
    WHERE i.owner_id = $1
    ORDER BY i.id DESC;
  `;
  const res = await db.query(queryText, [owner_id]);
  return res.rows;
}

async function findById(id) {
  const queryText = `
    SELECT 
      i.id,
      i.instrument_id,
      i.owner_id,
      u.name AS owner_name,
      u.email AS owner_email,
      u.phone AS owner_phone,
      i.instrument_type,
      i.manufacturer,
      i.model,
      i.serial_number,
      i.capacity,
      i.location,
      i.registration_date,
      i.status,
      i.created_at
    FROM instruments i
    LEFT JOIN users u ON i.owner_id = u.id
    WHERE i.id = $1 OR i.instrument_id = $1;
  `;
  const res = await db.query(queryText, [id]);
  return res.rows[0] || null;
}

async function update(id, {
  instrument_type,
  manufacturer,
  model,
  serial_number,
  capacity,
  location,
  status
}) {
  const queryText = `
    UPDATE instruments
    SET 
      instrument_type = COALESCE($1, instrument_type),
      manufacturer = COALESCE($2, manufacturer),
      model = COALESCE($3, model),
      serial_number = COALESCE($4, serial_number),
      capacity = COALESCE($5, capacity),
      location = COALESCE($6, location),
      status = COALESCE($7, status)
    WHERE id = $8 OR instrument_id = $8
    RETURNING id, instrument_id, owner_id, instrument_type, manufacturer, model, serial_number, capacity, location, registration_date, status, created_at;
  `;

  const values = [
    instrument_type,
    manufacturer,
    model,
    serial_number,
    capacity,
    location,
    status,
    id
  ];

  const res = await db.query(queryText, values);
  return res.rows[0] || null;
}

async function deleteById(id) {
  const queryText = `
    DELETE FROM instruments
    WHERE id = $1 OR instrument_id = $1
    RETURNING id, instrument_id;
  `;
  const res = await db.query(queryText, [id]);
  return res.rows[0] || null;
}

module.exports = {
  create,
  findAll,
  findByOwnerId,
  findById,
  update,
  deleteById
};
