const { pool } = require('../../config/db');

async function listSemester({ search, page, limit, sortField, sortDirection, tahunAjaranId }) {
  const filters = [];
  const values = [];

  if (tahunAjaranId) {
    filters.push('s.tahun_ajaran_id = ?');
    values.push(tahunAjaranId);
  }

  if (search) {
    filters.push('(s.nama LIKE ? OR ta.tahun LIKE ?)');
    const keyword = `%${search}%`;
    values.push(keyword, keyword);
  }

  const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  const [countRows] = await pool.query(
    `SELECT COUNT(*) AS total
     FROM semester s
     LEFT JOIN tahun_ajaran ta ON ta.id = s.tahun_ajaran_id
     ${whereClause}`,
    values
  );

  const total = Number(countRows[0]?.total || 0);
  const offset = (page - 1) * limit;

  const [rows] = await pool.query(
    `SELECT s.id, s.tahun_ajaran_id, s.nama, s.aktif, ta.tahun
     FROM semester s
     LEFT JOIN tahun_ajaran ta ON ta.id = s.tahun_ajaran_id
     ${whereClause}
     ORDER BY s.${sortField} ${sortDirection}
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
  listSemester,
};