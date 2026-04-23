const crypto = require('crypto');
const { pool } = require('../../config/db');

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

async function createRefreshToken({ userId, token, expiresAt }) {
  const id = crypto.randomUUID();
  await pool.query(
    `INSERT INTO auth_refresh_tokens (id, user_id, token, expires_at)
     VALUES (?, ?, ?, ?)`,
    [id, userId, token, expiresAt]
  );

  return {
    id,
    user_id: userId,
    token,
    expires_at: expiresAt,
    revoked_at: null,
  };
}

async function findRefreshToken(token) {
  const [rows] = await pool.query(
    `SELECT id, user_id, token, expires_at, revoked_at, created_at
     FROM auth_refresh_tokens
     WHERE token = ?
     LIMIT 1`,
    [token]
  );

  return rows[0] || null;
}

async function revokeRefreshToken(token) {
  await pool.query(
    `UPDATE auth_refresh_tokens
     SET revoked_at = NOW()
     WHERE token = ? AND revoked_at IS NULL`,
    [token]
  );
}

async function revokeAllRefreshTokensByUserId(userId) {
  await pool.query(
    `UPDATE auth_refresh_tokens
     SET revoked_at = NOW()
     WHERE user_id = ? AND revoked_at IS NULL`,
    [userId]
  );
}

module.exports = {
  findUserByUsername,
  findUserById,
  createRefreshToken,
  findRefreshToken,
  revokeRefreshToken,
  revokeAllRefreshTokensByUserId,
};
