const { successResponse } = require('../../utils/response');
const rombelService = require('./service');

async function list(req, res, next) {
  try {
    const result = await rombelService.list(req.query);
    return successResponse(res, result);
  } catch (error) {
    return next(error);
  }
}

async function detail(req, res, next) {
  try {
    const result = await rombelService.detail(req.params.id);
    return successResponse(res, result);
  } catch (error) {
    return next(error);
  }
}

async function create(req, res, next) {
  try {
    const result = await rombelService.create(req.body);
    return successResponse(res, result, 'Success', 201);
  } catch (error) {
    return next(error);
  }
}

async function addAnggota(req, res, next) {
  try {
    const result = await rombelService.addAnggota(req.params.id, req.body);
    return successResponse(res, result, 'Success', 201);
  } catch (error) {
    return next(error);
  }
}

async function listAnggota(req, res, next) {
  try {
    const result = await rombelService.listAnggota(req.params.id);
    return successResponse(res, result);
  } catch (error) {
    return next(error);
  }
}

async function listPembelajaran(req, res, next) {
  try {
    const result = await rombelService.listPembelajaran(req.params.id);
    return successResponse(res, result);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  list,
  detail,
  create,
  addAnggota,
  listAnggota,
  listPembelajaran,
};
