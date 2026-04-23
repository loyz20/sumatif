const ErrorCode = require('../../constants/errorCodes');
const pembelajaranModel = require('./model');
const { createError } = require('../shared/service');

async function create(data) {
  try {
    return await pembelajaranModel.createPembelajaran(data);
  } catch (error) {
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      throw createError('Data rombel, mata pelajaran, atau PTK tidak ditemukan', 404, ErrorCode.NOT_FOUND);
    }

    throw error;
  }
}

module.exports = {
  create,
};

