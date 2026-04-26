const { successResponse } = require('../../utils/response');
const sumatifService = require('./service');
const { logActivity } = require('../../shared/activityLog');

async function create(req, res, next) {
  try {
    const result = await sumatifService.create(req.body, req.user.id, req.user.sekolah_id);
    await logActivity({
      userId: req.user.id,
      action: 'CREATE_NILAI_SUMATIF',
      entityType: 'nilai_sumatif',
      entityId: result.id,
      description: `Input nilai sumatif untuk siswa ${result.siswa_nama} - Mapel: ${result.nama_mapel_snapshot}`
    });
    return successResponse(res, result, 'Berhasil menyimpan nilai sumatif', 201);
  } catch (error) {
    return next(error);
  }
}

async function getReport(req, res, next) {
  try {
    const { rombel_id, semester_id } = req.query;
    const result = await sumatifService.getReport(rombel_id, semester_id, req.user.sekolah_id);
    return successResponse(res, result);
  } catch (error) {
    return next(error);
  }
}

async function getDetail(req, res, next) {
  try {
    const result = await sumatifService.getDetail(req.params.id, req.user.sekolah_id);
    return successResponse(res, result);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  create,
  getReport,
  getDetail,
};
