const sumatifModel = require('./model');
const { createError } = require('../shared/service');
const ErrorCode = require('../../constants/errorCodes');

async function create(data, userId, sekolahId) {
  // 1. Validate total weight
  const totalBobot = data.komponen.reduce((acc, curr) => acc + curr.bobot, 0);
  if (Math.abs(totalBobot - 100) > 0.01) {
    throw createError('Total bobot komponen harus 100%', 400, ErrorCode.VALIDATION_ERROR);
  }

  const id = await sumatifModel.upsertSumatif(
    { ...data, sekolah_id: sekolahId, user_id: userId },
    data.komponen
  );
  return sumatifModel.findSumatifById(id, sekolahId);
}

async function getReport(rombelId, semesterId, sekolahId) {
  if (!rombelId || !semesterId) {
    throw createError('Rombel ID dan Semester ID wajib diisi', 400, ErrorCode.VALIDATION_ERROR);
  }
  return sumatifModel.listSumatifByRombel(rombelId, semesterId, sekolahId);
}

async function getDetail(id, sekolahId) {
  const result = await sumatifModel.findSumatifById(id, sekolahId);
  if (!result) {
    throw createError('Data nilai tidak ditemukan', 404, ErrorCode.NOT_FOUND);
  }
  return result;
}

module.exports = {
  create,
  getReport,
  getDetail,
};
