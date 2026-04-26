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

async function list(req, res, next) {
  try {
    const result = await pembelajaranService.list(req.query, req.user);
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

async function listKomponen(req, res, next) {
  try {
    const { id } = req.params;
    const { semester_id } = req.query;
    const result = await pembelajaranService.listKomponen(id, semester_id);
    return successResponse(res, result);
  } catch (error) {
    return next(error);
  }
}

async function saveKomponen(req, res, next) {
  try {
    const { id } = req.params;
    const { semester_id, komponen } = req.body;
    const result = await pembelajaranService.saveKomponen(id, semester_id, req.user.sekolah_id, komponen, req.user.id);
    return successResponse(res, result);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  create,
  update,
  remove,
  list,
  listByRombel,
  listKomponen,
  saveKomponen,
};
