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

module.exports = {
  list,
  create,
};
