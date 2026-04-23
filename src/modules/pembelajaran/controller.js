const { successResponse } = require('../../utils/response');
const pembelajaranService = require('./service');

async function create(req, res, next) {
  try {
    const result = await pembelajaranService.create(req.body);
    return successResponse(res, result, 'Success', 201);
  } catch (error) {
    return next(error);
  }
}

async function update(req, res, next) {
  try {
    const result = await pembelajaranService.update(req.params.id, req.body);
    return successResponse(res, result);
  } catch (error) {
    return next(error);
  }
}

async function remove(req, res, next) {
  try {
    const result = await pembelajaranService.remove(req.params.id, req.query);
    return successResponse(res, result);
  } catch (error) {
    return next(error);
  }
}

async function listByRombel(req, res, next) {
  try {
    const result = await pembelajaranService.listByRombel(req.params.rombelId, req.query);
    return successResponse(res, result);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  create,
  update,
  remove,
  listByRombel,
};
