const { pool } = require('../../config/db');

async function listLogs(sekolahId, limit = 100, offset = 0, search = '') {
  const filters = ['(u.sekolah_id = ? OR u.role = \'superadmin\')'];
  const values = [sekolahId];

  if (search) {
    filters.push('(u.username LIKE ? OR al.action LIKE ? OR al.description LIKE ?)');
    const kw = `%${search}%`;
    values.push(kw, kw, kw);
  }

  const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

  const [rows] = await pool.query(
    `SELECT al.*, u.username 
     FROM activity_logs al
     LEFT JOIN users u ON al.user_id = u.id
     ${whereClause}
     ORDER BY al.created_at DESC
     LIMIT ? OFFSET ?`,
    [...values, parseInt(limit), parseInt(offset)]
  );

  const [total] = await pool.query(
    `SELECT COUNT(*) as count 
     FROM activity_logs al
     LEFT JOIN users u ON al.user_id = u.id
     ${whereClause}`,
    values
  );

  return { items: rows, total: total[0].count };
}

async function getLogStats(sekolahId) {
  const [today] = await pool.query(
    `SELECT COUNT(*) as count 
     FROM activity_logs al
     LEFT JOIN users u ON al.user_id = u.id
     WHERE (u.sekolah_id = ? OR u.role = 'superadmin') 
     AND DATE(al.created_at) = CURDATE()`,
    [sekolahId]
  );

  const [critical] = await pool.query(
    `SELECT COUNT(*) as count 
     FROM activity_logs al
     LEFT JOIN users u ON al.user_id = u.id
     WHERE (u.sekolah_id = ? OR u.role = 'superadmin') 
     AND (al.action LIKE 'DELETE%' OR al.action LIKE 'UPDATE%')`,
    [sekolahId]
  );

  const [uniqueUsers] = await pool.query(
    `SELECT COUNT(DISTINCT al.user_id) as count 
     FROM activity_logs al
     LEFT JOIN users u ON al.user_id = u.id
     WHERE (u.sekolah_id = ? OR u.role = 'superadmin')`,
    [sekolahId]
  );

  return {
    today: today[0].count,
    critical: critical[0].count,
    uniqueUsers: uniqueUsers[0].count
  };
}

module.exports = {
  listLogs,
  getLogStats,
};
