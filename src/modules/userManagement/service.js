const ErrorCode = require('../../constants/errorCodes');
const userManagementModel = require('./model');
const { createError } = require('../shared/service');

async function create(data) {
  try {
    return await userManagementModel.createUser(data);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw createError('Username sudah terdaftar', 409, ErrorCode.DUPLICATE_DATA);
    }

    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      throw createError('Data sekolah tidak ditemukan', 404, ErrorCode.NOT_FOUND);
    }

    throw error;
  }
}

module.exports = {
  create,
};

