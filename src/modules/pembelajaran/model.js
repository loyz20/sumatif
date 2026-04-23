const crypto = require('crypto');
const { pool } = require('../../config/db');

async function createPembelajaran(data) {
  const id = crypto.randomUUID();
  await pool.query(
    `INSERT INTO pembelajaran (id, rombel_id, mata_pelajaran_id, ptk_id, jam_per_minggu)
     VALUES (?, ?, ?, ?, ?)`,
    [id, data.rombel_id, data.mata_pelajaran_id, data.ptk_id, data.jam_per_minggu]
  );

  const [rows] = await pool.query(
    `SELECT id, rombel_id, mata_pelajaran_id, ptk_id, jam_per_minggu
     FROM pembelajaran
     WHERE id = ?
     LIMIT 1`,
    [id]
  );

  return rows[0] || null;
}

async function listPembelajaranByRombel(rombelId) {
  const [rows] = await pool.query(
    `SELECT pb.id, pb.rombel_id, pb.mata_pelajaran_id, pb.ptk_id, pb.jam_per_minggu,
            mp.nama AS mata_pelajaran_nama,
            mp.kode AS mata_pelajaran_kode,
            p.nama AS ptk_nama
     FROM pembelajaran pb
     JOIN mata_pelajaran mp ON mp.id = pb.mata_pelajaran_id
     JOIN ptk p ON p.id = pb.ptk_id
     WHERE pb.rombel_id = ?
     ORDER BY mp.nama ASC`,
    [rombelId]
  );

  return rows;
}

module.exports = {
  createPembelajaran,
  listPembelajaranByRombel,
};
