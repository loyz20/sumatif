const { successResponse } = require('../../utils/response');
const mataPelajaranService = require('./service');

async function list(req, res, next) {
  try {
    const result = await mataPelajaranService.list(req.query);
    return successResponse(res, result);
  } catch (error) {
    return next(error);
  }
}

async function create(req, res, next) {
  try {
    const result = await mataPelajaranService.create(req.body);
    return successResponse(res, result, 'Success', 201);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  list,
  create,
};
