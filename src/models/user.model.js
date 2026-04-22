const { pool } = require('../config/db');

async function findUserByUsername(username) {
  const [rows] = await pool.query(
    `SELECT id, sekolah_id, username, password, role, ref_id
     FROM users
     WHERE username = ?
     LIMIT 1`,
    [username]
  );

  return rows[0] || null;
}

async function findUserById(id) {
  const [rows] = await pool.query(
    `SELECT id, sekolah_id, username, password, role, ref_id
     FROM users
     WHERE id = ?
     LIMIT 1`,
    [id]
  );

  return rows[0] || null;
}

module.exports = {
  findUserByUsername,
  findUserById,
};
