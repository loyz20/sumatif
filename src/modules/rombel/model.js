const crypto = require('crypto');
const { pool } = require('../../config/db');

async function listRombel({ search, page, limit, sortField, sortDirection, tahunAjaranId }) {
  const filters = [];
  const values = [];

  if (sekolahId) {
    filters.push('r.sekolah_id = ?');
    values.push(sekolahId);
  }

  if (tahunAjaranId) {
    filters.push('r.tahun_ajaran_id = ?');
    values.push(tahunAjaranId);
  }

  if (search) {
    filters.push('(r.nama LIKE ? OR s.nama LIKE ? OR p.nama LIKE ?)');
    const keyword = `%${search}%`;
    values.push(keyword, keyword, keyword);
  }

  const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  const [countRows] = await pool.query(
    `SELECT COUNT(*) AS total
     FROM rombel r
     LEFT JOIN sekolah s ON s.id = r.sekolah_id
     LEFT JOIN ptk p ON p.id = r.wali_kelas_ptk_id
     ${whereClause}`,
    values
  );

  const total = Number(countRows[0]?.total || 0);
  const offset = (page - 1) * limit;

  const [rows] = await pool.query(
    `SELECT r.id, r.sekolah_id, r.tahun_ajaran_id, r.nama, r.tingkat, r.wali_kelas_ptk_id,
            s.nama AS sekolah_nama,
            p.nama AS wali_kelas_nama
     FROM rombel r
     LEFT JOIN sekolah s ON s.id = r.sekolah_id
     LEFT JOIN ptk p ON p.id = r.wali_kelas_ptk_id
     ${whereClause}
     ORDER BY r.${sortField} ${sortDirection}
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

async function findRombelById(id, sekolahId) {
  const values = [id];
  let filter = '';
  if (sekolahId) {
    filter = ' AND sekolah_id = ?';
    values.push(sekolahId);
  }

  const [rows] = await pool.query(
    `SELECT id, sekolah_id, tahun_ajaran_id, nama, tingkat, wali_kelas_ptk_id
     FROM rombel
     WHERE id = ?${filter}
     LIMIT 1`,
    values
  );

  return rows[0] || null;
}

async function createRombel(data) {
  const id = crypto.randomUUID();
  await pool.query(
    `INSERT INTO rombel (id, sekolah_id, tahun_ajaran_id, nama, tingkat, wali_kelas_ptk_id)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id, data.sekolah_id, data.tahun_ajaran_id, data.nama, data.tingkat, data.wali_kelas_ptk_id]
  );

  return findRombelById(id);
}

async function addAnggotaRombel(rombelId, pesertaDidikId) {
  const id = crypto.randomUUID();
  await pool.query(
    'INSERT INTO anggota_rombel (id, rombel_id, peserta_didik_id) VALUES (?, ?, ?)',
    [id, rombelId, pesertaDidikId]
  );

  const [rows] = await pool.query(
    `SELECT ar.id, ar.rombel_id, ar.peserta_didik_id, pd.nama AS peserta_didik_nama
     FROM anggota_rombel ar
     JOIN peserta_didik pd ON pd.id = ar.peserta_didik_id
     WHERE ar.id = ?
     LIMIT 1`,
    [id]
  );

  return rows[0] || null;
}

async function listAnggotaRombel(rombelId) {
  const [rows] = await pool.query(
    `SELECT ar.id, ar.rombel_id, ar.peserta_didik_id, pd.nama AS peserta_didik_nama, pd.nisn
     FROM anggota_rombel ar
     JOIN peserta_didik pd ON pd.id = ar.peserta_didik_id
     WHERE ar.rombel_id = ?
     ORDER BY pd.nama ASC`,
    [rombelId]
  );

  return rows;
}

module.exports = {
  listRombel,
  findRombelById,
  createRombel,
  addAnggotaRombel,
  listAnggotaRombel,
};
