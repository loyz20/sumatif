const { pool } = require('../../config/db');

const getDashboardCounts = async () => {
  const connection = await pool.getConnection();
  try {
    // Jalankan query secara paralel untuk efisiensi
    const [
      [peserta_didik],
      [guru],
      [mapel]
    ] = await Promise.all([
      connection.query('SELECT COUNT(*) as total FROM peserta_didik'),
      connection.query('SELECT COUNT(*) as total FROM ptk'),
      connection.query('SELECT COUNT(*) as total FROM mata_pelajaran')
    ]);

    return {
      totalSiswa: peserta_didik[0].total,
      totalGuru: guru[0].total,
      totalMapel: mapel[0].total
    };
  } finally {
    connection.release();
  }
};

const getRecentActivities = async (limit = 10) => {
  const [rows] = await pool.query(
    `SELECT a.id, a.action, a.description, a.created_at, u.username, u.role
     FROM activity_logs a
     LEFT JOIN users u ON a.user_id = u.id
     ORDER BY a.created_at DESC
     LIMIT ?`,
    [limit]
  );
  return rows;
};

const getPengumuman = async (limit = 5) => {
  const [rows] = await pool.query(
    `SELECT id, title, content, type, created_at
     FROM pengumuman
     ORDER BY created_at DESC
     LIMIT ?`,
    [limit]
  );
  return rows;
};

module.exports = {
  getDashboardCounts,
  getRecentActivities,
  getPengumuman
};
