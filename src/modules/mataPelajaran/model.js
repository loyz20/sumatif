const crypto = require('crypto');
const { pool } = require('../../config/db');

async function listMataPelajaran({ search, page, limit, sortField, sortDirection }) {
  const filters = [];
  const values = [];

  if (search) {
    filters.push('(nama LIKE ? OR kode LIKE ?)');
    const keyword = `%${search}%`;
    values.push(keyword, keyword);
  }

  const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  const [countRows] = await pool.query(`SELECT COUNT(*) AS total FROM mata_pelajaran ${whereClause}`, values);
  const total = Number(countRows[0]?.total || 0);
  const offset = (page - 1) * limit;

  const [rows] = await pool.query(
    `SELECT id, nama, kode
     FROM mata_pelajaran
     ${whereClause}
     ORDER BY ${sortField} ${sortDirection}
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

async function createMataPelajaran(data) {
  const id = crypto.randomUUID();
  await pool.query('INSERT INTO mata_pelajaran (id, nama, kode) VALUES (?, ?, ?)', [id, data.nama, data.kode]);

  const [rows] = await pool.query('SELECT id, nama, kode FROM mata_pelajaran WHERE id = ? LIMIT 1', [id]);
  return rows[0] || null;
}

module.exports = {
  listMataPelajaran,
  createMataPelajaran,
};