const crypto = require('crypto');
const { pool } = require('../../config/db');

async function createRegistrasi(data) {
  const id = crypto.randomUUID();
  await pool.query(
    `INSERT INTO registrasi (id, peserta_didik_id, sekolah_id, tanggal_masuk, status)
     VALUES (?, ?, ?, ?, ?)`,
    [id, data.peserta_didik_id, data.sekolah_id, data.tanggal_masuk, data.status]
  );

  const [rows] = await pool.query(
    `SELECT id, peserta_didik_id, sekolah_id, tanggal_masuk, status
     FROM registrasi
     WHERE id = ?
     LIMIT 1`,
    [id]
  );

  return rows[0] || null;
}

module.exports = {
  createRegistrasi,
};
