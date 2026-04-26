const ErrorCode = require('../../constants/errorCodes');
const mataPelajaranModel = require('./model');
const { createError, parsePagination } = require('../shared/service');

async function list(query) {
  const pagination = parsePagination(query, 'nama', new Set(['nama', 'kode']));
  const sekolahId = query.sekolah_id;
  return mataPelajaranModel.listMataPelajaran({ ...pagination, sekolahId });
}

async function create(data) {
  try {
    return await mataPelajaranModel.createMataPelajaran(data);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw createError('Kode mata pelajaran sudah terdaftar', 409, ErrorCode.DUPLICATE_DATA);
    }
    throw error;
  }
}

async function update(id, data) {
  const sekolahId = data.sekolah_id;
  if (!sekolahId) throw createError('Sekolah ID is required', 400);
  const success = await mataPelajaranModel.updateMataPelajaran(id, data, sekolahId);
  if (!success) throw createError('Mata pelajaran tidak ditemukan atau akses ditolak', 404);
  return { id, ...data };
}

async function remove(id, query) {
  const sekolahId = query.sekolah_id;
  if (!sekolahId) throw createError('Sekolah ID is required', 400);
  const success = await mataPelajaranModel.deleteMataPelajaran(id, sekolahId);
  if (!success) throw createError('Mata pelajaran tidak ditemukan atau akses ditolak', 404);
  return { id, deleted: true };
}

async function importData(dataList, sekolahId) {
  let successCount = 0;
  let failedCount = 0;
  const errors = [];

  for (const item of dataList) {
    try {
      item.sekolah_id = sekolahId;
      await create(item);
      successCount++;
    } catch (error) {
      failedCount++;
      errors.push({ item, error: error.message || 'Gagal mengimpor' });
    }
  }

  return { successCount, failedCount, errors };
}

module.exports = {
  list,
  create,
  update,
  remove,
  importData,
};
