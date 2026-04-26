const ErrorCode = require('../../constants/errorCodes');
const pembelajaranModel = require('./model');
const { createError } = require('../shared/service');

async function create(data) {
  try {
    return await pembelajaranModel.createPembelajaran(data);
  } catch (error) {
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      throw createError('Data rombel, mata pelajaran, atau PTK tidak ditemukan', 404, ErrorCode.NOT_FOUND);
    }
    throw error;
  }
}

async function update(id, data) {
  const sekolahId = data.sekolah_id;
  if (!sekolahId) throw createError('Sekolah ID is required', 400);
  const success = await pembelajaranModel.updatePembelajaran(id, data, sekolahId);
  if (!success) throw createError('Data pembelajaran tidak ditemukan atau akses ditolak', 404);
  return { id, ...data };
}

async function remove(id, query) {
  const sekolahId = query.sekolah_id;
  if (!sekolahId) throw createError('Sekolah ID is required', 400);
  const success = await pembelajaranModel.deletePembelajaran(id, sekolahId);
  if (!success) throw createError('Data pembelajaran tidak ditemukan atau akses ditolak', 404);
  return { id, deleted: true };
}

async function list(query, reqUser) {
  const sekolahId = query.sekolah_id;
  const { limit = 50, page = 1 } = query;
  const offset = (page - 1) * limit;
  
  // If user is a guru, filter by their PTK ID (ref_id)
  const ptkId = reqUser.role === 'guru' ? reqUser.ref_id : null;
  
  return pembelajaranModel.listPembelajaran(sekolahId, limit, offset, ptkId);
}

async function listByRombel(rombelId, query) {
  const sekolahId = query.sekolah_id;
  return pembelajaranModel.listPembelajaranByRombel(rombelId, sekolahId);
}

async function listKomponen(pembelajaranId, semesterId) {
  return await pembelajaranModel.listKomponen(pembelajaranId, semesterId);
}

async function saveKomponen(pembelajaranId, semesterId, sekolahId, komponenList, userId) {
  return await pembelajaranModel.saveKomponen(pembelajaranId, semesterId, sekolahId, komponenList, userId);
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
