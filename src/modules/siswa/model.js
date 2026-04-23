const crypto = require('crypto');
const { pool } = require('../../config/db');

async function listSiswa({ search, page, limit, sortField, sortDirection, sekolahId }) {
  const filters = [];
  const values = [];

  if (sekolahId) {
    filters.push('sekolah_id = ?');
    values.push(sekolahId);
  }

  if (search) {
    filters.push('(nama LIKE ? OR nisn LIKE ? OR nik LIKE ?)');
    const keyword = `%${search}%`;
    values.push(keyword, keyword, keyword);
  }

  const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  const [countRows] = await pool.query(`SELECT COUNT(*) AS total FROM peserta_didik ${whereClause}`, values);
  const total = Number(countRows[0]?.total || 0);
  const offset = (page - 1) * limit;

  const [rows] = await pool.query(
    `SELECT id, sekolah_id, nama, nisn, nik, jenis_kelamin, tanggal_lahir, nama_ayah, nama_ibu
     FROM peserta_didik
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

async function findSiswaById(id) {
  const [rows] = await pool.query(
    `SELECT id, sekolah_id, nama, nisn, nik, jenis_kelamin, tanggal_lahir, nama_ayah, nama_ibu
     FROM peserta_didik
     WHERE id = ?
     LIMIT 1`,
    [id]
  );

  return rows[0] || null;
}

async function findSiswaConflicts({ nisn, nik }, exceptId) {
  const conditions = [];
  const values = [];

  if (nisn) {
    conditions.push('nisn = ?');
    values.push(nisn);
  }

  if (nik) {
    conditions.push('nik = ?');
    values.push(nik);
  }

  if (!conditions.length) {
    return [];
  }

  let query = `SELECT id, nisn, nik FROM peserta_didik WHERE (${conditions.join(' OR ')})`;
  if (exceptId) {
    query += ' AND id <> ?';
    values.push(exceptId);
  }

  const [rows] = await pool.query(query, values);
  return rows;
}

async function createSiswa(data) {
  const id = crypto.randomUUID();

  await pool.query(
    `INSERT INTO peserta_didik (
      id, sekolah_id, nama, nisn, nik, jenis_kelamin, tanggal_lahir, nama_ayah, nama_ibu
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      data.sekolah_id,
      data.nama,
      data.nisn,
      data.nik,
      data.jenis_kelamin,
      data.tanggal_lahir,
      data.nama_ayah || '-',
      data.nama_ibu || '-',
    ]
  );

  return findSiswaById(id);
}

async function updateSiswa(id, data) {
  const fields = [];
  const values = [];

  for (const [key, value] of Object.entries(data)) {
    fields.push(`${key} = ?`);
    values.push(value);
  }

  if (!fields.length) {
    return findSiswaById(id);
  }

  values.push(id);
  await pool.query(`UPDATE peserta_didik SET ${fields.join(', ')} WHERE id = ?`, values);
  return findSiswaById(id);
}

async function deleteSiswa(id) {
  const [result] = await pool.query('DELETE FROM peserta_didik WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  listSiswa,
  findSiswaById,
  findSiswaConflicts,
  createSiswa,
  updateSiswa,
  deleteSiswa,
};
