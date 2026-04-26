const crypto = require('crypto');
const { pool } = require('../../config/db');

async function createJadwal(data) {
  const id = crypto.randomUUID();
  await pool.query(
    `INSERT INTO jadwal_pembelajaran (id, sekolah_id, pembelajaran_id, hari, jam_mulai, jam_selesai, ruangan)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id, data.sekolah_id, data.pembelajaran_id, data.hari, data.jam_mulai, data.jam_selesai, data.ruangan]
  );
  return findJadwalById(id, data.sekolah_id);
}

async function findJadwalById(id, sekolahId) {
  const [rows] = await pool.query(
    `SELECT j.*, mp.nama as mata_pelajaran_nama, r.nama as rombel_nama, p.nama as ptk_nama
     FROM jadwal_pembelajaran j
     JOIN pembelajaran pb ON j.pembelajaran_id = pb.id
     JOIN mata_pelajaran mp ON pb.mata_pelajaran_id = mp.id
     JOIN rombel r ON pb.rombel_id = r.id
     JOIN ptk p ON pb.ptk_id = p.id
     WHERE j.id = ? AND j.sekolah_id = ?`,
    [id, sekolahId]
  );
  return rows[0] || null;
}

async function listJadwal(sekolahId, filters = {}) {
  let query = `
    SELECT j.*, mp.nama as mata_pelajaran_nama, r.nama as rombel_nama, p.nama as ptk_nama
    FROM jadwal_pembelajaran j
    JOIN pembelajaran pb ON j.pembelajaran_id = pb.id
    JOIN mata_pelajaran mp ON pb.mata_pelajaran_id = mp.id
    JOIN rombel r ON pb.rombel_id = r.id
    JOIN ptk p ON pb.ptk_id = p.id
    WHERE j.sekolah_id = ?
  `;
  const values = [sekolahId];

  if (filters.hari) {
    query += ' AND j.hari = ?';
    values.push(filters.hari);
  }
  if (filters.rombel_id) {
    query += ' AND pb.rombel_id = ?';
    values.push(filters.rombel_id);
  }
  if (filters.ptk_id) {
    query += ' AND pb.ptk_id = ?';
    values.push(filters.ptk_id);
  }

  query += ' ORDER BY FIELD(j.hari, "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"), j.jam_mulai ASC';
  
  const [rows] = await pool.query(query, values);
  return rows;
}

async function updateJadwal(id, data, sekolahId) {
  const [result] = await pool.query(
    `UPDATE jadwal_pembelajaran 
     SET hari = ?, jam_mulai = ?, jam_selesai = ?, ruangan = ?
     WHERE id = ? AND sekolah_id = ?`,
    [data.hari, data.jam_mulai, data.jam_selesai, data.ruangan, id, sekolahId]
  );
  return result.affectedRows > 0;
}

async function deleteJadwal(id, sekolahId) {
  const [result] = await pool.query(
    'DELETE FROM jadwal_pembelajaran WHERE id = ? AND sekolah_id = ?',
    [id, sekolahId]
  );
  return result.affectedRows > 0;
}

module.exports = {
  createJadwal,
  findJadwalById,
  listJadwal,
  updateJadwal,
  deleteJadwal,
};
