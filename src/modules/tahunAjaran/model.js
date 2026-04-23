const crypto = require('crypto');
const { pool } = require('../../config/db');

async function listTahunAjaran({ search, page, limit, sortField, sortDirection, sekolahId }) {
  const filters = [];
  const values = [];

  if (sekolahId) {
    filters.push('ta.sekolah_id = ?');
    values.push(sekolahId);
  }

  if (search) {
    filters.push('(ta.tahun LIKE ? OR s.nama LIKE ?)');
    const keyword = `%${search}%`;
    values.push(keyword, keyword);
  }

  const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  const [countRows] = await pool.query(
    `SELECT COUNT(*) AS total
     FROM tahun_ajaran ta
     LEFT JOIN sekolah s ON s.id = ta.sekolah_id
     ${whereClause}`,
    values
  );

  const total = Number(countRows[0]?.total || 0);
  const offset = (page - 1) * limit;

  const [rows] = await pool.query(
    `SELECT ta.id, ta.sekolah_id, ta.tahun, ta.aktif, s.nama AS sekolah_nama
     FROM tahun_ajaran ta
     LEFT JOIN sekolah s ON s.id = ta.sekolah_id
     ${whereClause}
     ORDER BY ta.${sortField} ${sortDirection}
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

async function createTahunAjaran(data) {
  const id = crypto.randomUUID();
  await pool.query('INSERT INTO tahun_ajaran (id, sekolah_id, tahun, aktif) VALUES (?, ?, ?, ?)', [
    id,
    data.sekolah_id,
    data.tahun,
    Boolean(data.aktif),
  ]);

  const [rows] = await pool.query('SELECT id, sekolah_id, tahun, aktif FROM tahun_ajaran WHERE id = ? LIMIT 1', [id]);
  return rows[0] || null;
}

async function updateTahunAjaran(id, data, sekolahId) {
  const [result] = await pool.query(
    'UPDATE tahun_ajaran SET tahun = ?, aktif = ? WHERE id = ? AND sekolah_id = ?',
    [data.tahun, Boolean(data.aktif), id, sekolahId]
  );
  return result.affectedRows > 0;
}

async function deleteTahunAjaran(id, sekolahId) {
  const [result] = await pool.query(
    'DELETE FROM tahun_ajaran WHERE id = ? AND sekolah_id = ?',
    [id, sekolahId]
  );
  return result.affectedRows > 0;
}

module.exports = {
  listTahunAjaran,
  createTahunAjaran,
  updateTahunAjaran,
  deleteTahunAjaran,
};
