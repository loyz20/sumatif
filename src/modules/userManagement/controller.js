const { successResponse } = require('../../utils/response');
const userManagementService = require('./service');

async function list(req, res, next) {
  try {
    const result = await userManagementService.list(req.query, req.user);
    return successResponse(res, result);
  } catch (error) {
    return next(error);
  }
}

async function detail(req, res, next) {
  try {
    const result = await userManagementService.detail(req.params.id);
    return successResponse(res, result);
  } catch (error) {
    return next(error);
  }
}

async function create(req, res, next) {
  try {
    const result = await userManagementService.create(req.body, req.user);
    return successResponse(res, result, 'Success', 201);
  } catch (error) {
    return next(error);
  }
}

async function update(req, res, next) {
  try {
    const result = await userManagementService.update(req.params.id, req.body, req.user);
    return successResponse(res, result);
  } catch (error) {
    return next(error);
  }
}

async function remove(req, res, next) {
  try {
    await userManagementService.remove(req.params.id, req.user);
    return successResponse(res, null, 'Data pengguna berhasil dihapus');
  } catch (error) {
    return next(error);
  }
}

async function stats(req, res, next) {
  try {
    const result = await userManagementService.stats(req.user);
    return successResponse(res, result);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  list,
  detail,
  create,
  update,
  remove,
  stats,
};
