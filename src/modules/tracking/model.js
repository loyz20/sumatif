const crypto = require('crypto');
const { pool } = require('../../config/db');

async function createTracking(data) {
  const id = crypto.randomUUID();
  await pool.query(
    `INSERT INTO tracking_lokasi (id, peserta_didik_id, latitude, longitude, tracked_at)
     VALUES (?, ?, ?, ?, ?)`,
    [id, data.peserta_didik_id, data.latitude, data.longitude, data.timestamp]
  );

  const [rows] = await pool.query(
    'SELECT id, peserta_didik_id, latitude, longitude, tracked_at FROM tracking_lokasi WHERE id = ? LIMIT 1',
    [id]
  );

  return rows[0] || null;
}

module.exports = {
  createTracking,
};
