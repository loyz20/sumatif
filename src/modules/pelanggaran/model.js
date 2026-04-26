const crypto = require('crypto');
const { pool } = require('../../config/db');

async function listMasterPelanggaran(sekolahId) {
  const [rows] = await pool.query(
    'SELECT * FROM master_pelanggaran WHERE sekolah_id = ? ORDER BY kategori, nama',
    [sekolahId]
  );
  return rows;
}

async function createMasterPelanggaran(sekolahId, data) {
  const id = crypto.randomUUID();
  await pool.query(
    'INSERT INTO master_pelanggaran (id, sekolah_id, kategori, nama, poin) VALUES (?, ?, ?, ?, ?)',
    [id, sekolahId, data.kategori, data.nama, data.poin]
  );
  return id;
}

async function logPelanggaranSiswa(sekolahId, data, userId) {
  const id = crypto.randomUUID();
  // Get point snapshot from master
  const [master] = await pool.query('SELECT poin FROM master_pelanggaran WHERE id = ?', [data.master_pelanggaran_id]);
  const poin = master[0]?.poin || 0;

  await pool.query(
    `INSERT INTO pelanggaran_siswa (id, sekolah_id, peserta_didik_id, master_pelanggaran_id, tanggal, catatan, poin_snapshot, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, sekolahId, data.peserta_didik_id, data.master_pelanggaran_id, data.tanggal, data.catatan, poin, userId]
  );
  return id;
}

async function getStudentHistory(sekolahId, studentId) {
  const [rows] = await pool.query(
    `SELECT ps.*, mp.nama as pelanggaran_nama, mp.kategori, u.username as reporter
     FROM pelanggaran_siswa ps
     JOIN master_pelanggaran mp ON ps.master_pelanggaran_id = mp.id
     LEFT JOIN users u ON ps.created_by = u.id
     WHERE ps.peserta_didik_id = ? AND ps.sekolah_id = ?
     ORDER BY ps.tanggal DESC`,
    [studentId, sekolahId]
  );
  return rows;
}

async function getTopViolationStudents(sekolahId) {
  const [rows] = await pool.query(
    `SELECT pd.id, pd.nama, pd.nis, SUM(ps.poin_snapshot) as total_poin, COUNT(ps.id) as total_insiden
     FROM peserta_didik pd
     JOIN pelanggaran_siswa ps ON pd.id = ps.peserta_didik_id
     WHERE ps.sekolah_id = ?
     GROUP BY pd.id
     ORDER BY total_poin DESC
     LIMIT 10`,
    [sekolahId]
  );
  return rows;
}

async function updateMasterPelanggaran(sekolahId, id, data) {
  const [result] = await pool.query(
    'UPDATE master_pelanggaran SET kategori = ?, nama = ?, poin = ? WHERE id = ? AND sekolah_id = ?',
    [data.kategori, data.nama, data.poin, id, sekolahId]
  );
  return result.affectedRows > 0;
}

async function deleteMasterPelanggaran(sekolahId, id) {
  const [result] = await pool.query(
    'DELETE FROM master_pelanggaran WHERE id = ? AND sekolah_id = ?',
    [id, sekolahId]
  );
  return result.affectedRows > 0;
}

async function getIncidentDetail(incidentId) {
  const [rows] = await pool.query(`
    SELECT 
        ps.*, 
        pd.nama as student_name, 
        mp.nama as violation_name,
        u_student.id as student_user_id,
        u_wali.id as wali_user_id
    FROM pelanggaran_siswa ps
    JOIN peserta_didik pd ON ps.peserta_didik_id = pd.id
    JOIN master_pelanggaran mp ON ps.master_pelanggaran_id = mp.id
    LEFT JOIN anggota_rombel ar ON pd.id = ar.peserta_didik_id
    LEFT JOIN rombel r ON ar.rombel_id = r.id
    LEFT JOIN users u_student ON pd.id = u_student.ref_id AND u_student.role = 'siswa'
    LEFT JOIN users u_wali ON r.wali_kelas_ptk_id = u_wali.ref_id AND u_wali.role = 'guru'
    WHERE ps.id = ?
  `, [incidentId]);
  return rows[0];
}

async function logRewardSiswa(sekolahId, data) {
  const id = crypto.randomUUID();
  await pool.query(
    `INSERT INTO reward_siswa (id, sekolah_id, peserta_didik_id, nama, poin, tanggal)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id, sekolahId, data.peserta_didik_id, data.nama, data.poin, data.tanggal]
  );
  return id;
}

async function getStudentRewardHistory(sekolahId, studentId) {
  const [rows] = await pool.query(
    `SELECT * FROM reward_siswa WHERE peserta_didik_id = ? AND sekolah_id = ? ORDER BY tanggal DESC`,
    [studentId, sekolahId]
  );
  return rows;
}

async function listAllRewards(sekolahId) {
  const [rows] = await pool.query(
    `SELECT r.*, pd.nama as student_name, pd.nis as student_nis
     FROM reward_siswa r
     JOIN peserta_didik pd ON r.peserta_didik_id = pd.id
     WHERE r.sekolah_id = ?
     ORDER BY r.tanggal DESC, r.created_at DESC`,
    [sekolahId]
  );
  return rows;
}

async function deleteRewardSiswa(sekolahId, id) {
  const [result] = await pool.query(
    'DELETE FROM reward_siswa WHERE id = ? AND sekolah_id = ?',
    [id, sekolahId]
  );
  return result.affectedRows > 0;
}

async function getStudentBKSummary(sekolahId, studentId) {
  const [[violations]] = await pool.query(
    `SELECT IFNULL(SUM(poin_snapshot), 0) as total_pelanggaran, COUNT(id) as total_kasus 
     FROM pelanggaran_siswa WHERE peserta_didik_id = ? AND sekolah_id = ?`,
    [studentId, sekolahId]
  );

  const [[rewards]] = await pool.query(
    `SELECT IFNULL(SUM(poin), 0) as total_reward, COUNT(id) as total_prestasi 
     FROM reward_siswa WHERE peserta_didik_id = ? AND sekolah_id = ?`,
    [studentId, sekolahId]
  );

  const total_poin = violations.total_pelanggaran - rewards.total_reward;
  
  let status = 'Aman';
  if (total_poin > 50) status = 'Pembinaan';
  else if (total_poin > 20) status = 'Peringatan';

  return {
    violations: violations.total_pelanggaran,
    rewards: rewards.total_reward,
    total_poin,
    total_kasus: violations.total_kasus,
    total_prestasi: rewards.total_prestasi,
    status
  };
}

module.exports = {
  listMasterPelanggaran,
  createMasterPelanggaran,
  updateMasterPelanggaran,
  deleteMasterPelanggaran,
  logPelanggaranSiswa,
  logRewardSiswa,
  listAllRewards,
  deleteRewardSiswa,
  getStudentHistory,
  getStudentRewardHistory,
  getStudentBKSummary,
  getTopViolationStudents,
  getIncidentDetail,
};
