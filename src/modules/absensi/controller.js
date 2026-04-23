const { successResponse } = require('../../utils/response');
const absensiService = require('./service');

async function masuk(req, res, next) {
  try {
    const result = await absensiService.masuk(req.body);
    return successResponse(res, result);
  } catch (error) {
    return next(error);
  }
}

async function keluar(req, res, next) {
  try {
    const result = await absensiService.keluar(req.body);
    return successResponse(res, result);
  } catch (error) {
    return next(error);
  }
}

async function rekap(req, res, next) {
  try {
    const result = await absensiService.rekap(req.query);
    return successResponse(res, result);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  masuk,
  keluar,
  rekap,
};
