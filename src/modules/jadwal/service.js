const jadwalModel = require('./model');
const { createError } = require('../shared/service');
const ErrorCode = require('../../constants/errorCodes');

async function create(data, sekolahId) {
  try {
    return await jadwalModel.createJadwal({ ...data, sekolah_id: sekolahId });
  } catch (error) {
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      throw createError('Data pembelajaran tidak ditemukan', 404, ErrorCode.NOT_FOUND);
    }
    throw error;
  }
}

async function list(query, reqUser) {
  const sekolahId = reqUser.sekolah_id;
  const filters = { ...query };
  
  // If user is a guru, they might want to see their own schedule by default
  // But usually, they want to see the whole class schedule or their own.
  // We allow query params to decide.
  
  return await jadwalModel.listJadwal(sekolahId, filters);
}

async function update(id, data, sekolahId) {
  const success = await jadwalModel.updateJadwal(id, data, sekolahId);
  if (!success) {
    throw createError('Jadwal tidak ditemukan atau akses ditolak', 404, ErrorCode.NOT_FOUND);
  }
  return await jadwalModel.findJadwalById(id, sekolahId);
}

async function remove(id, sekolahId) {
  const success = await jadwalModel.deleteJadwal(id, sekolahId);
  if (!success) {
    throw createError('Jadwal tidak ditemukan atau akses ditolak', 404, ErrorCode.NOT_FOUND);
  }
  return { id, deleted: true };
}

module.exports = {
  create,
  list,
  update,
  remove,
};
