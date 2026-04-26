const { successResponse } = require('../../utils/response');
const ptkService = require('./service');
const { logActivity } = require('../../shared/activityLog');

async function list(req, res, next) {
  try {
    const result = await ptkService.list(req.query);
    return successResponse(res, result);
  } catch (error) {
    return next(error);
  }
}

async function detail(req, res, next) {
  try {
    const result = await ptkService.detail(req.params.id, req.query);
    return successResponse(res, result);
  } catch (error) {
    return next(error);
  }
}

async function create(req, res, next) {
  try {
    const result = await ptkService.create(req.body);
    await logActivity({
      userId: req.user.id,
      action: 'CREATE_PTK',
      entityType: 'ptk',
      entityId: result.id,
      description: `Menambahkan data guru/PTK baru: ${result.nama}`
    });
    return successResponse(res, result, 'Success', 201);
  } catch (error) {
    return next(error);
  }
}

async function update(req, res, next) {
  try {
    const result = await ptkService.update(req.params.id, req.body);
    await logActivity({
      userId: req.user.id,
      action: 'UPDATE_PTK',
      entityType: 'ptk',
      entityId: result.id,
      description: `Memperbarui data guru/PTK: ${result.nama}`
    });
    return successResponse(res, result);
  } catch (error) {
    return next(error);
  }
}

async function remove(req, res, next) {
  try {
    await ptkService.remove(req.params.id, req.query);
    await logActivity({
      userId: req.user.id,
      action: 'DELETE_PTK',
      entityType: 'ptk',
      entityId: req.params.id,
      description: `Menghapus data guru/PTK dengan ID: ${req.params.id}`
    });
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

async function importData(req, res, next) {
  try {
    const result = await ptkService.importData(req.body.items, req.user.sekolah_id);
    await logActivity({
      userId: req.user.id,
      action: 'IMPORT_PTK',
      entityType: 'ptk',
      entityId: null,
      description: `Mengimpor ${result.successCount} data guru/PTK`
    });
    return successResponse(res, result, 'Import completed', 201);
  } catch (error) {
    return next(error);
  }
}

async function stats(req, res, next) {
  try {
    const result = await ptkService.stats(req.query);
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
  importData,
  stats,
};
