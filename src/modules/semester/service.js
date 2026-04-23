const semesterModel = require('./model');
const { createError, parsePagination } = require('../shared/service');
const ErrorCode = require('../../constants/errorCodes');

async function list(query) {
  const pagination = parsePagination(query, 'nama', new Set(['nama', 'aktif']));
  const tahunAjaranId = query.tahun_ajaran_id ? String(query.tahun_ajaran_id).trim() : '';
  return semesterModel.listSemester({ ...pagination, tahunAjaranId });
}

async function create(data) {
  try {
    return await semesterModel.createSemester(data);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw createError('Semester sudah terdaftar untuk tahun ajaran ini', 409, ErrorCode.DUPLICATE_DATA);
    }
    throw error;
  }
}

async function update(id, data) {
  const sekolahId = data.sekolah_id;
  if (!sekolahId) throw createError('Sekolah ID is required', 400);
  const success = await semesterModel.updateSemester(id, data, sekolahId);
  if (!success) throw createError('Semester tidak ditemukan atau akses ditolak', 404);
  return { id, ...data };
}

async function remove(id, query) {
  const sekolahId = query.sekolah_id;
  if (!sekolahId) throw createError('Sekolah ID is required', 400);
  const success = await semesterModel.deleteSemester(id, sekolahId);
  if (!success) throw createError('Semester tidak ditemukan atau akses ditolak', 404);
  return { id, deleted: true };
}

module.exports = {
  list,
  create,
  update,
  remove,
};

