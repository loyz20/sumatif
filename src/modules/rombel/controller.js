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
    const result = await rombelService.detail(req.params.id, req.query);
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
    const result = await rombelService.listAnggota(req.params.id, req.query);
    return successResponse(res, result);
  } catch (error) {
    return next(error);
  }
}

async function listPembelajaran(req, res, next) {
  try {
    const result = await rombelService.listPembelajaran(req.params.id, req.query);
    return successResponse(res, result);
  } catch (error) {
    return next(error);
  }
}

async function update(req, res, next) {
  try {
    const result = await rombelService.update(req.params.id, req.body, req.query);
    return successResponse(res, result);
  } catch (error) {
    return next(error);
  }
}

async function remove(req, res, next) {
  try {
    await rombelService.remove(req.params.id, req.query);
    return successResponse(res, null, 'Data berhasil dihapus');
  } catch (error) {
    return next(error);
  }
}

const { logActivity } = require('../../shared/activityLog');

async function importData(req, res, next) {
  try {
    const result = await rombelService.importData(req.body.items, req.user.sekolah_id);
    await logActivity({
      userId: req.user.id,
      action: 'IMPORT_ROMBEL',
      entityType: 'rombel',
      entityId: null,
      description: `Mengimpor ${result.successCount} data rombel/kelas`
    });
    return successResponse(res, result, 'Import completed', 201);
  } catch (error) {
    return next(error);
  }
}

async function stats(req, res, next) {
  try {
    const result = await rombelService.stats(req.query);
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
  addAnggota,
  listAnggota,
  listPembelajaran,
  importData,
  stats,
};
