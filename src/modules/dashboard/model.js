const { pool } = require('../../config/db');

const getDashboardCounts = async (sekolahId) => {
  const connection = await pool.getConnection();
  try {
    const [
      [peserta_didik],
      [guru],
      [mapel],
      [rombels],
      [distribution]
    ] = await Promise.all([
      connection.query('SELECT COUNT(*) as total FROM peserta_didik WHERE sekolah_id = ?', [sekolahId]),
      connection.query('SELECT COUNT(*) as total FROM ptk WHERE sekolah_id = ?', [sekolahId]),
      connection.query('SELECT COUNT(*) as total FROM mata_pelajaran WHERE sekolah_id = ?', [sekolahId]),
      connection.query('SELECT COUNT(*) as total FROM rombel WHERE sekolah_id = ?', [sekolahId]),
      connection.query(`
        SELECT r.nama as name, COUNT(ar.peserta_didik_id) as value 
        FROM rombel r 
        LEFT JOIN anggota_rombel ar ON r.id = ar.rombel_id 
        WHERE r.sekolah_id = ?
        GROUP BY r.id, r.nama 
        ORDER BY value DESC 
        LIMIT 5
      `, [sekolahId])
    ]);

    return {
      totalSiswa: peserta_didik[0].total,
      totalGuru: guru[0].total,
      totalMapel: mapel[0].total,
      totalKelas: rombels[0].total,
      distribution: distribution
    };
  } finally {
    connection.release();
  }
};

const getRecentActivities = async (sekolahId, limit = 10) => {
  const [rows] = await pool.query(
    `SELECT a.id, a.action, a.description, a.created_at, u.username, u.role
     FROM activity_logs a
     LEFT JOIN users u ON a.user_id = u.id
     WHERE u.sekolah_id = ?
     ORDER BY a.created_at DESC
     LIMIT ?`,
    [sekolahId, limit]
  );
  return rows;
};

const getPengumuman = async (sekolahId, limit = 5) => {
  const [rows] = await pool.query(
    `SELECT id, title, content, type, created_at
     FROM pengumuman
     WHERE sekolah_id = ? AND is_active = TRUE
     ORDER BY created_at DESC
     LIMIT ?`,
    [sekolahId, limit]
  );
  return rows;
};

const getAttendanceStats = async (sekolahId, guruId) => {
  const [rows] = await pool.query(`
    SELECT 
        j.tanggal as date,
        SUM(CASE WHEN jk.status = 'Hadir' THEN 1 ELSE 0 END) as hadir,
        SUM(CASE WHEN jk.status != 'Hadir' THEN 1 ELSE 0 END) as absen
    FROM jurnal j
    JOIN jurnal_kehadiran jk ON j.id = jk.jurnal_id
    WHERE j.sekolah_id = ? AND j.guru_id = ?
    GROUP BY j.tanggal
    ORDER BY j.tanggal DESC
    LIMIT 7
  `, [sekolahId, guruId]);
  
  const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  return rows.reverse().map(row => ({
    name: days[new Date(row.date).getDay()],
    hadir: Number(row.hadir),
    absen: Number(row.absen)
  }));
};

const getBKStats = async (sekolahId) => {
  // Get all students and their net points
  const [rows] = await pool.query(`
    SELECT 
      pd.id,
      (IFNULL((SELECT SUM(poin_snapshot) FROM pelanggaran_siswa WHERE peserta_didik_id = pd.id AND sekolah_id = ?), 0) - 
       IFNULL((SELECT SUM(poin) FROM reward_siswa WHERE peserta_didik_id = pd.id AND sekolah_id = ?), 0)) as net_poin
    FROM peserta_didik pd
    WHERE pd.sekolah_id = ?
  `, [sekolahId, sekolahId, sekolahId]);

  const total = rows.length;
  const critical = rows.filter(r => r.net_poin > 50).length;
  const warning = rows.filter(r => r.net_poin > 20 && r.net_poin <= 50).length;
  const aman = total - critical - warning;

  const [konselingMonth] = await pool.query(`
    SELECT COUNT(*) as total FROM konseling 
    WHERE sekolah_id = ? AND MONTH(tanggal) = MONTH(CURRENT_DATE()) AND YEAR(tanggal) = YEAR(CURRENT_DATE())
  `, [sekolahId]);

  return {
    critical,
    warning,
    aman,
    total,
    konselingMonth: konselingMonth[0].total
  };
};

const getStudentDashboardData = async (sekolahId, studentId) => {
  // BK Summary
  const [violations] = await pool.query(`SELECT SUM(poin_snapshot) as total FROM pelanggaran_siswa WHERE peserta_didik_id = ? AND sekolah_id = ?`, [studentId, sekolahId]);
  const [rewards] = await pool.query(`SELECT SUM(poin) as total FROM reward_siswa WHERE peserta_didik_id = ? AND sekolah_id = ?`, [studentId, sekolahId]);
  
  // Attendance Summary
  const [attendance] = await pool.query(`
    SELECT 
      SUM(CASE WHEN status = 'Hadir' THEN 1 ELSE 0 END) as hadir,
      COUNT(*) as total
    FROM jurnal_kehadiran jk
    JOIN jurnal j ON jk.jurnal_id = j.id
    WHERE jk.peserta_didik_id = ? AND j.sekolah_id = ?
  `, [studentId, sekolahId]);

  const vPoin = Number(violations[0]?.total || 0);
  const rPoin = Number(rewards[0]?.total || 0);
  const netPoin = vPoin - rPoin;
  
  let status = 'Aman';
  if (netPoin > 50) status = 'Pembinaan';
  else if (netPoin > 20) status = 'Peringatan';

  return {
    netPoin,
    status,
    totalPelanggaran: vPoin,
    totalReward: rPoin,
    attendance: {
      hadir: Number(attendance[0]?.hadir || 0),
      total: Number(attendance[0]?.total || 0)
    }
  };
};

module.exports = {
  getDashboardCounts,
  getRecentActivities,
  getPengumuman,
  getAttendanceStats,
  getBKStats,
  getStudentDashboardData
};
