const crypto = require('crypto');
const { pool } = require('../../config/db');
const { hashPassword } = require('../../utils/password');

async function createUser(data) {
  const id = crypto.randomUUID();
  const passwordHashed = hashPassword(data.password);

  await pool.query(
    `INSERT INTO users (id, sekolah_id, username, password, role, ref_id)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id, data.sekolah_id || null, data.username, passwordHashed, data.role, data.ref_id || null]
  );

  const [rows] = await pool.query(
    `SELECT id, sekolah_id, username, role, ref_id
     FROM users
     WHERE id = ?
     LIMIT 1`,
    [id]
  );

  return rows[0] || null;
}

module.exports = {
  createUser,
};
