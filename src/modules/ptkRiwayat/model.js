const crypto = require('crypto');
const { pool } = require('../../config/db');

async function listRiwayatPendidikanPtk(ptkId) {
  const [rows] = await pool.query(
    `SELECT id, ptk_id, jenjang, nama_instansi, tahun_lulus
     FROM ptk_riwayat_pendidikan
     WHERE ptk_id = ?
     ORDER BY tahun_lulus DESC, jenjang ASC`,
    [ptkId]
  );

  return rows;
}

async function createRiwayatPendidikanPtk(ptkId, data) {
  const id = crypto.randomUUID();
  await pool.query(
    `INSERT INTO ptk_riwayat_pendidikan (id, ptk_id, jenjang, nama_instansi, tahun_lulus)
     VALUES (?, ?, ?, ?, ?)`,
    [id, ptkId, data.jenjang, data.nama_instansi, data.tahun_lulus]
  );

  const [rows] = await pool.query(
    `SELECT id, ptk_id, jenjang, nama_instansi, tahun_lulus
     FROM ptk_riwayat_pendidikan
     WHERE id = ?
     LIMIT 1`,
    [id]
  );

  return rows[0] || null;
}

async function listRiwayatKepangkatanPtk(ptkId) {
  const [rows] = await pool.query(
    `SELECT id, ptk_id, pangkat, golongan, tmt
     FROM ptk_riwayat_kepangkatan
     WHERE ptk_id = ?
     ORDER BY tmt DESC`,
    [ptkId]
  );

  return rows;
}

module.exports = {
  listRiwayatPendidikanPtk,
  createRiwayatPendidikanPtk,
  listRiwayatKepangkatanPtk,
};
