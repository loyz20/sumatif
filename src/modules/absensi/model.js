const crypto = require('crypto');
const { pool } = require('../../config/db');

async function upsertAbsensiMasuk(data) {
  const tanggal = new Date().toISOString().slice(0, 10);
  const [rows] = await pool.query(
    `SELECT id
     FROM absensi
     WHERE peserta_didik_id = ? AND tanggal = ?
     LIMIT 1`,
    [data.peserta_didik_id, tanggal]
  );

  if (rows[0]?.id) {
    await pool.query(
      `UPDATE absensi
       SET jam_masuk = COALESCE(jam_masuk, NOW()), latitude_masuk = ?, longitude_masuk = ?
       WHERE id = ?`,
      [data.latitude, data.longitude, rows[0].id]
    );

    const [updated] = await pool.query('SELECT * FROM absensi WHERE id = ? LIMIT 1', [rows[0].id]);
    return updated[0] || null;
  }

  const id = crypto.randomUUID();
  await pool.query(
    `INSERT INTO absensi (
      id, peserta_didik_id, tanggal, jam_masuk, latitude_masuk, longitude_masuk
    ) VALUES (?, ?, ?, NOW(), ?, ?)`,
    [id, data.peserta_didik_id, tanggal, data.latitude, data.longitude]
  );

  const [created] = await pool.query('SELECT * FROM absensi WHERE id = ? LIMIT 1', [id]);
  return created[0] || null;
}

async function updateAbsensiKeluar(data) {
  const tanggal = new Date().toISOString().slice(0, 10);
  const [rows] = await pool.query(
    `SELECT id
     FROM absensi
     WHERE peserta_didik_id = ? AND tanggal = ?
     LIMIT 1`,
    [data.peserta_didik_id, tanggal]
  );

  if (!rows[0]?.id) {
    return null;
  }

  await pool.query(
    `UPDATE absensi
     SET jam_keluar = NOW(), latitude_keluar = ?, longitude_keluar = ?
     WHERE id = ?`,
    [data.latitude, data.longitude, rows[0].id]
  );

  const [updated] = await pool.query('SELECT * FROM absensi WHERE id = ? LIMIT 1', [rows[0].id]);
  return updated[0] || null;
}

async function rekapAbsensi({ pesertaDidikId, bulan, tahun, page, limit }) {
  const filters = [];
  const values = [];

  if (pesertaDidikId) {
    filters.push('a.peserta_didik_id = ?');
    values.push(pesertaDidikId);
  }

  if (bulan) {
    filters.push('MONTH(a.tanggal) = ?');
    values.push(Number(bulan));
  }

  if (tahun) {
    filters.push('YEAR(a.tanggal) = ?');
    values.push(Number(tahun));
  }

  const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  const [countRows] = await pool.query(`SELECT COUNT(*) AS total FROM absensi a ${whereClause}`, values);

  const total = Number(countRows[0]?.total || 0);
  const offset = (page - 1) * limit;

  const [rows] = await pool.query(
    `SELECT a.id, a.peserta_didik_id, a.tanggal, a.jam_masuk, a.jam_keluar,
            a.latitude_masuk, a.longitude_masuk, a.latitude_keluar, a.longitude_keluar,
            pd.nama AS peserta_didik_nama
     FROM absensi a
     JOIN peserta_didik pd ON pd.id = a.peserta_didik_id
     ${whereClause}
     ORDER BY a.tanggal DESC
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

module.exports = {
  upsertAbsensiMasuk,
  updateAbsensiKeluar,
  rekapAbsensi,
};
