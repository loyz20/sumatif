const { successResponse } = require('../../utils/response');
const mataPelajaranService = require('./service');
const { logActivity } = require('../../shared/activityLog');

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
    await logActivity({
      userId: req.user.id,
      action: 'CREATE_MAPEL',
      entityType: 'mata_pelajaran',
      entityId: result.id,
      description: `Menambahkan mata pelajaran baru: ${result.nama}`
    });
    return successResponse(res, result, 'Success', 201);
  } catch (error) {
    return next(error);
  }
}

async function update(req, res, next) {
  try {
    const result = await mataPelajaranService.update(req.params.id, req.body);
    await logActivity({
      userId: req.user.id,
      action: 'UPDATE_MAPEL',
      entityType: 'mata_pelajaran',
      entityId: result.id,
      description: `Memperbarui mata pelajaran: ${result.nama}`
    });
    return successResponse(res, result);
  } catch (error) {
    return next(error);
  }
}

async function remove(req, res, next) {
  try {
    const result = await mataPelajaranService.remove(req.params.id, req.query);
    await logActivity({
      userId: req.user.id,
      action: 'DELETE_MAPEL',
      entityType: 'mata_pelajaran',
      entityId: req.params.id,
      description: `Menghapus mata pelajaran dengan ID: ${req.params.id}`
    });
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
