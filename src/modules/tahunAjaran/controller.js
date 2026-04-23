const { successResponse } = require('../../utils/response');
const tahunAjaranService = require('./service');

async function list(req, res, next) {
  try {
    const result = await tahunAjaranService.list(req.query);
    return successResponse(res, result);
  } catch (error) {
    return next(error);
  }
}

async function create(req, res, next) {
  try {
    const result = await tahunAjaranService.create(req.body);
    return successResponse(res, result, 'Success', 201);
  } catch (error) {
    return next(error);
  }
}

async function update(req, res, next) {
  try {
    const result = await tahunAjaranService.update(req.params.id, req.body);
    return successResponse(res, result);
  } catch (error) {
    return next(error);
  }
}

async function remove(req, res, next) {
  try {
    const result = await tahunAjaranService.remove(req.params.id, req.query);
    return successResponse(res, result);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  list,
  create,
  update,
  remove,
};
