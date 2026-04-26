const { successResponse } = require('../../utils/response');
const presensiModel = require('./model');
const { logActivity } = require('../../utils/logger');

async function save(req, res, next) {
  try {
    const result = await presensiModel.upsertPresensi(req.user.sekolah_id, req.body, req.user.id);
    
    // Log Activity
    logActivity({
      user_id: req.user.id,
      action: 'INPUT_PRESENSI_PEMBELAJARAN',
      entity_type: 'pembelajaran',
      entity_id: req.body.pembelajaran_id,
      description: `Input presensi mata pelajaran untuk tanggal ${req.body.tanggal}. Jumlah siswa: ${req.body.items.length}`
    });

    return successResponse(res, result, 'Presensi berhasil disimpan');
  } catch (error) {
    return next(error);
  }
}

async function list(req, res, next) {
  try {
    const { pembelajaran_id, tanggal } = req.query;
    const result = await presensiModel.listPresensi(req.user.sekolah_id, pembelajaran_id, tanggal);
    return successResponse(res, result);
  } catch (error) {
    return next(error);
  }
}

async function rekap(req, res, next) {
  try {
    const { pembelajaran_id, semester_id } = req.query;
    const result = await presensiModel.getRekapPresensi(req.user.sekolah_id, pembelajaran_id, semester_id);
    return successResponse(res, result);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  save,
  list,
  rekap,
};
