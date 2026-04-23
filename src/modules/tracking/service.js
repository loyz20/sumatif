const ErrorCode = require('../../constants/errorCodes');
const trackingModel = require('./model');
const { createError } = require('../shared/service');

async function create(data) {
  try {
    return await trackingModel.createTracking(data);
  } catch (error) {
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      throw createError('Data peserta didik tidak ditemukan', 404, ErrorCode.NOT_FOUND);
    }

    throw error;
  }
}

module.exports = {
  create,
};

