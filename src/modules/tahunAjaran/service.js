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

module.exports = {
  list,
  create,
};

