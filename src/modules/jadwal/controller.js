const { successResponse } = require('../../utils/response');
const jadwalService = require('./service');

async function create(req, res, next) {
  try {
    const result = await jadwalService.create(req.body, req.user.sekolah_id);
    return successResponse(res, result, 'Jadwal berhasil dibuat', 201);
  } catch (error) {
    return next(error);
  }
}

async function list(req, res, next) {
  try {
    const result = await jadwalService.list(req.query, req.user);
    return successResponse(res, result);
  } catch (error) {
    return next(error);
  }
}

async function update(req, res, next) {
  try {
    const result = await jadwalService.update(req.params.id, req.body, req.user.sekolah_id);
    return successResponse(res, result, 'Jadwal berhasil diperbarui');
  } catch (error) {
    return next(error);
  }
}

async function remove(req, res, next) {
  try {
    const result = await jadwalService.remove(req.params.id, req.user.sekolah_id);
    return successResponse(res, result, 'Jadwal berhasil dihapus');
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  create,
  list,
  update,
  remove,
};
