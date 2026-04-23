const ErrorCode = require('../../constants/errorCodes');
const registrasiModel = require('./model');
const { createError } = require('../shared/service');

async function create(data) {
  try {
    return await registrasiModel.createRegistrasi(data);
  } catch (error) {
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      throw createError('Data peserta didik atau sekolah tidak ditemukan', 404, ErrorCode.NOT_FOUND);
    }

    throw error;
  }
}

module.exports = {
  create,
};

