const ErrorCode = require('../../constants/errorCodes');
const mataPelajaranModel = require('./model');
const { createError, parsePagination } = require('../shared/service');

async function list(query) {
  const pagination = parsePagination(query, 'nama', new Set(['nama', 'kode']));
  return mataPelajaranModel.listMataPelajaran(pagination);
}

async function create(data) {
  try {
    return await mataPelajaranModel.createMataPelajaran(data);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw createError('Kode mata pelajaran sudah terdaftar', 409, ErrorCode.DUPLICATE_DATA);
    }

    throw error;
  }
}

module.exports = {
  list,
  create,
};

