const semesterModel = require('./model');
const { parsePagination } = require('../shared/service');

async function list(query) {
  const pagination = parsePagination(query, 'nama', new Set(['nama', 'aktif']));
  const tahunAjaranId = query.tahun_ajaran_id ? String(query.tahun_ajaran_id).trim() : '';
  return semesterModel.listSemester({ ...pagination, tahunAjaranId });
}

module.exports = {
  list,
};

