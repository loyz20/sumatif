const ErrorCode = require('../../constants/errorCodes');
const tahunAjaranModel = require('./model');
const { createError, parsePagination } = require('../shared/service');

async function list(query) {
  const pagination = parsePagination(query, 'tahun', new Set(['tahun', 'aktif']));
  const sekolahId = query.sekolah_id ? String(query.sekolah_id).trim() : '';
  return tahunAjaranModel.listTahunAjaran({ ...pagination, sekolahId });
}

async function create(data) {
  try {
    return await tahunAjaranModel.createTahunAjaran(data);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw createError('Tahun ajaran sudah terdaftar', 409, ErrorCode.DUPLICATE_DATA);
    }

    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      throw createError('Data sekolah tidak ditemukan', 404, ErrorCode.NOT_FOUND);
    }

    throw error;
  }
}

async function update(id, data) {
  const sekolahId = data.sekolah_id;
  if (!sekolahId) throw createError('Sekolah ID is required', 400);
  const success = await tahunAjaranModel.updateTahunAjaran(id, data, sekolahId);
  if (!success) throw createError('Tahun ajaran tidak ditemukan atau akses ditolak', 404);
  return { id, ...data };
}

async function remove(id, query) {
  const sekolahId = query.sekolah_id;
  if (!sekolahId) throw createError('Sekolah ID is required', 400);
  const success = await tahunAjaranModel.deleteTahunAjaran(id, sekolahId);
  if (!success) throw createError('Tahun ajaran tidak ditemukan atau akses ditolak', 404);
  return { id, deleted: true };
}

module.exports = {
  list,
  create,
  update,
  remove,
};

