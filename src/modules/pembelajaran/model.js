const crypto = require('crypto');
const { pool } = require('../../config/db');

async function createPembelajaran(data) {
  const id = crypto.randomUUID();
  await pool.query(
    `INSERT INTO pembelajaran (id, rombel_id, mata_pelajaran_id, ptk_id, jam_per_minggu)
     VALUES (?, ?, ?, ?, ?)`,
    [id, data.rombel_id, data.mata_pelajaran_id, data.ptk_id, data.jam_per_minggu]
  );

  return findPembelajaranById(id);
}

async function findPembelajaranById(id) {
  const [rows] = await pool.query(
    `SELECT pb.id, pb.rombel_id, pb.mata_pelajaran_id, pb.ptk_id, pb.jam_per_minggu,
            mp.nama AS mata_pelajaran_nama,
            mp.kode AS mata_pelajaran_kode,
            p.nama AS ptk_nama
     FROM pembelajaran pb
     JOIN mata_pelajaran mp ON mp.id = pb.mata_pelajaran_id
     JOIN ptk p ON p.id = pb.ptk_id
     WHERE pb.id = ?
     LIMIT 1`,
    [id]
  );

  return rows[0] || null;
}

async function updatePembelajaran(id, data, sekolahId) {
  // Verify tenant through rombel
  const [result] = await pool.query(
    `UPDATE pembelajaran pb
     JOIN rombel r ON r.id = pb.rombel_id
     SET pb.mata_pelajaran_id = ?, pb.ptk_id = ?, pb.jam_per_minggu = ?
     WHERE pb.id = ? AND r.sekolah_id = ?`,
    [data.mata_pelajaran_id, data.ptk_id, data.jam_per_minggu, id, sekolahId]
  );
  return result.affectedRows > 0;
}

async function deletePembelajaran(id, sekolahId) {
  const [result] = await pool.query(
    `DELETE pb FROM pembelajaran pb
     JOIN rombel r ON r.id = pb.rombel_id
     WHERE pb.id = ? AND r.sekolah_id = ?`,
    [id, sekolahId]
  );
  return result.affectedRows > 0;
}

async function listPembelajaranByRombel(rombelId, sekolahId) {
  const [rows] = await pool.query(
    `SELECT pb.id, pb.rombel_id, pb.mata_pelajaran_id, pb.ptk_id, pb.jam_per_minggu,
            mp.nama AS mata_pelajaran_nama,
            mp.kode AS mata_pelajaran_kode,
            p.nama AS ptk_nama
     FROM pembelajaran pb
     JOIN mata_pelajaran mp ON mp.id = pb.mata_pelajaran_id
     JOIN ptk p ON p.id = pb.ptk_id
     JOIN rombel r ON r.id = pb.rombel_id
     WHERE pb.rombel_id = ? AND r.sekolah_id = ?
     ORDER BY mp.nama ASC`,
    [rombelId, sekolahId]
  );

  return rows;
}

module.exports = {
  createPembelajaran,
  findPembelajaranById,
  updatePembelajaran,
  deletePembelajaran,
  listPembelajaranByRombel,
};
