const crypto = require('crypto');
const { pool } = require('../../config/db');
const { hashPassword } = require('../../utils/password');

async function listUsers({ search, page, limit, sortField, sortDirection, sekolahId }) {
  const filters = [];
  const values = [];

  if (sekolahId) {
    filters.push('u.sekolah_id = ?');
    values.push(sekolahId);
  }

  if (search) {
    filters.push('(u.username LIKE ? OR u.role LIKE ?)');
    const keyword = `%${search}%`;
    values.push(keyword, keyword);
  }

  const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  const [countRows] = await pool.query(`SELECT COUNT(*) AS total FROM users u ${whereClause}`, values);
  const total = Number(countRows[0]?.total || 0);
  const offset = (page - 1) * limit;

  const [rows] = await pool.query(
    `SELECT u.id, u.sekolah_id, u.username, u.role, u.ref_id, u.created_at, s.nama as nama_sekolah
     FROM users u
     LEFT JOIN sekolah s ON u.sekolah_id = s.id
     ${whereClause}
     ORDER BY u.${sortField} ${sortDirection}
     LIMIT ? OFFSET ?`,
    [...values, limit, offset]
  );

  return {
    items: rows,
    pagination: {
      page,
      limit,
      total,
      total_pages: limit > 0 ? Math.ceil(total / limit) : 0,
    },
  };
}

async function findUserById(id) {
  const [rows] = await pool.query(
    `SELECT id, sekolah_id, username, role, ref_id, created_at
     FROM users
     WHERE id = ?
     LIMIT 1`,
    [id]
  );

  return rows[0] || null;
}

async function createUser(data) {
  const id = crypto.randomUUID();
  const passwordHashed = hashPassword(data.password);

  await pool.query(
    `INSERT INTO users (id, sekolah_id, username, password, role, ref_id)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id, data.sekolah_id || null, data.username, passwordHashed, data.role, data.ref_id || null]
  );

  return findUserById(id);
}

const USER_UPDATABLE_FIELDS = new Set(['sekolah_id', 'username', 'role', 'ref_id']);

async function updateUser(id, data) {
  const fields = [];
  const values = [];

  for (const [key, value] of Object.entries(data)) {
    if (USER_UPDATABLE_FIELDS.has(key)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  }

  if (data.password) {
    fields.push('password = ?');
    values.push(hashPassword(data.password));
  }

  if (!fields.length) {
    return findUserById(id);
  }

  values.push(id);
  await pool.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);
  return findUserById(id);
}

async function deleteUser(id) {
  const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  listUsers,
  findUserById,
  createUser,
  updateUser,
  deleteUser,
};
