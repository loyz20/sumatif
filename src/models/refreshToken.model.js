const { pool } = require('../config/db');

async function createRefreshToken({ userId, token, expiresAt }) {
  await pool.query(
    `INSERT INTO auth_refresh_tokens (id, user_id, token, expires_at)
     VALUES (UUID(), ?, ?, ?)`,
    [userId, token, expiresAt]
  );
}

async function findRefreshToken(token) {
  const [rows] = await pool.query(
    `SELECT id, user_id, token, expires_at, revoked_at
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
     SET revoked_at = CURRENT_TIMESTAMP
     WHERE token = ? AND revoked_at IS NULL`,
    [token]
  );
}

async function revokeAllRefreshTokensByUserId(userId) {
  await pool.query(
    `UPDATE auth_refresh_tokens
     SET revoked_at = CURRENT_TIMESTAMP
     WHERE user_id = ? AND revoked_at IS NULL`,
    [userId]
  );
}

module.exports = {
  createRefreshToken,
  findRefreshToken,
  revokeRefreshToken,
  revokeAllRefreshTokensByUserId,
};
