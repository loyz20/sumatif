const { successResponse } = require('../../utils/response');
const ptkRiwayatService = require('./service');

async function listPendidikan(req, res, next) {
  try {
    const result = await ptkRiwayatService.listPendidikan(req.params.id);
    return successResponse(res, result);
  } catch (error) {
    return next(error);
  }
}

async function createPendidikan(req, res, next) {
  try {
    const result = await ptkRiwayatService.createPendidikan(req.params.id, req.body);
    return successResponse(res, result, 'Success', 201);
  } catch (error) {
    return next(error);
  }
}

async function listKepangkatan(req, res, next) {
  try {
    const result = await ptkRiwayatService.listKepangkatan(req.params.id);
    return successResponse(res, result);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listPendidikan,
  createPendidikan,
  listKepangkatan,
};
