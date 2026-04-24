const crypto = require('crypto');
const { pool } = require('../../config/db');

async function listSiswa({ search, page, limit, sortField, sortDirection, sekolahId }) {
  const filters = [];
  const values = [];

  if (sekolahId) {
    filters.push('p.sekolah_id = ?');
    values.push(sekolahId);
  }

  if (search) {
    filters.push('(p.nama LIKE ? OR p.nis LIKE ? OR p.nisn LIKE ? OR p.nik LIKE ?)');
    const keyword = `%${search}%`;
    values.push(keyword, keyword, keyword, keyword);
  }

  const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  const [countRows] = await pool.query(`SELECT COUNT(*) AS total FROM peserta_didik p ${whereClause}`, values);
  const total = Number(countRows[0]?.total || 0);
  const offset = (page - 1) * limit;

  const [rows] = await pool.query(
    `SELECT p.id, p.sekolah_id, p.nama, p.nis, p.nisn, p.nik, p.jenis_kelamin, p.tanggal_lahir, p.nama_ayah, p.nama_ibu, r.tingkat, r.nama as kelas, ar.rombel_id
     FROM peserta_didik p
     LEFT JOIN anggota_rombel ar ON p.id = ar.peserta_didik_id
     LEFT JOIN rombel r ON ar.rombel_id = r.id
     ${whereClause}
     ORDER BY p.${sortField} ${sortDirection}
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

async function findSiswaById(id, sekolahId) {
  const values = [id];
  let filter = '';
  
  if (sekolahId) {
    filter = ' AND p.sekolah_id = ?';
    values.push(sekolahId);
  }

  const [rows] = await pool.query(
    `SELECT p.id, p.sekolah_id, p.nama, p.nis, p.nisn, p.nik, p.jenis_kelamin, p.tanggal_lahir, p.nama_ayah, p.nama_ibu, ar.rombel_id
     FROM peserta_didik p
     LEFT JOIN anggota_rombel ar ON p.id = ar.peserta_didik_id
     WHERE p.id = ?${filter}
     LIMIT 1`,
    values
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
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    await connection.query(
      `INSERT INTO peserta_didik (
        id, sekolah_id, nama, nis, nisn, nik, jenis_kelamin, tanggal_lahir, nama_ayah, nama_ibu
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        data.sekolah_id || null,
        data.nama,
        data.nis,
        data.nisn || null,
        data.nik || null,
        data.jenis_kelamin || null,
        data.tanggal_lahir || null,
        data.nama_ayah || null,
        data.nama_ibu || null,
      ]
    );

    if (data.rombel_id) {
      await connection.query(
        `INSERT INTO anggota_rombel (id, rombel_id, peserta_didik_id) VALUES (?, ?, ?)`,
        [crypto.randomUUID(), data.rombel_id, id]
      );
    }
    await connection.commit();
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }

  return findSiswaById(id);
}

const SISWA_UPDATABLE_FIELDS = new Set([
  'sekolah_id', 'nama', 'nis', 'nisn', 'nik', 'jenis_kelamin',
  'tanggal_lahir', 'nama_ayah', 'nama_ibu',
]);

async function updateSiswa(id, data, sekolahId) {
  const fields = [];
  const values = [];

  for (const [key, value] of Object.entries(data)) {
    if (SISWA_UPDATABLE_FIELDS.has(key)) {
      fields.push(`${key} = ?`);
      if (['nisn', 'nik', 'jenis_kelamin', 'tanggal_lahir', 'nama_ayah', 'nama_ibu'].includes(key) && value === '') {
        values.push(null);
      } else {
        values.push(value);
      }
    }
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    if (fields.length > 0) {
      values.push(id, sekolahId);
      await connection.query(`UPDATE peserta_didik SET ${fields.join(', ')} WHERE id = ? AND sekolah_id = ?`, values);
    }

    if (data.rombel_id !== undefined) {
      await connection.query(`DELETE FROM anggota_rombel WHERE peserta_didik_id = ?`, [id]);
      if (data.rombel_id) {
        await connection.query(
          `INSERT INTO anggota_rombel (id, rombel_id, peserta_didik_id) VALUES (?, ?, ?)`,
          [crypto.randomUUID(), data.rombel_id, id]
        );
      }
    }
    
    await connection.commit();
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }

  return findSiswaById(id);
}

async function deleteSiswa(id, sekolahId) {
  const values = [id];
  let filter = '';
  if (sekolahId) {
    filter = ' AND sekolah_id = ?';
    values.push(sekolahId);
  }
  const [result] = await pool.query(`DELETE FROM peserta_didik WHERE id = ?${filter}`, values);
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
