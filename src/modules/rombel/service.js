const ErrorCode = require('../../constants/errorCodes');
const rombelModel = require('./model');
const pembelajaranModel = require('../pembelajaran/model');
const { createError, parsePagination } = require('../shared/service');

async function list(query) {
  const pagination = parsePagination(query, 'nama', new Set(['nama', 'tingkat']));
  const sekolahId = query.sekolah_id ? String(query.sekolah_id).trim() : '';
  const tahunAjaranId = query.tahun_ajaran_id ? String(query.tahun_ajaran_id).trim() : '';
  return rombelModel.listRombel({ ...pagination, sekolahId, tahunAjaranId });
}

async function detail(id, query) {
  const sekolahId = query.sekolah_id ? String(query.sekolah_id).trim() : '';
  const rombel = await rombelModel.findRombelById(id, sekolahId);
  if (!rombel) {
    throw createError('Data rombel tidak ditemukan', 404, ErrorCode.NOT_FOUND);
  }

  return rombel;
}

async function create(data) {
  try {
    return await rombelModel.createRombel(data);
  } catch (error) {
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      throw createError('Data relasi rombel tidak ditemukan', 404, ErrorCode.NOT_FOUND);
    }

    throw error;
  }
}

async function addAnggota(rombelId, data) {
  const sekolahId = data.sekolah_id ? String(data.sekolah_id).trim() : '';
  const rombel = await rombelModel.findRombelById(rombelId, sekolahId);
  if (!rombel) {
    throw createError('Data rombel tidak ditemukan', 404, ErrorCode.NOT_FOUND);
  }

  try {
    return await rombelModel.addAnggotaRombel(rombelId, data.peserta_didik_id);
  } catch (error) {
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      throw createError('Data peserta didik tidak ditemukan', 404, ErrorCode.NOT_FOUND);
    }

    throw error;
  }
}

async function listAnggota(rombelId, query) {
  const sekolahId = query.sekolah_id ? String(query.sekolah_id).trim() : '';
  const rombel = await rombelModel.findRombelById(rombelId, sekolahId);
  if (!rombel) {
    throw createError('Data rombel tidak ditemukan', 404, ErrorCode.NOT_FOUND);
  }

  return rombelModel.listAnggotaRombel(rombelId);
}

async function listPembelajaran(rombelId, query) {
  const sekolahId = query.sekolah_id ? String(query.sekolah_id).trim() : '';
  const rombel = await rombelModel.findRombelById(rombelId, sekolahId);
  if (!rombel) {
    throw createError('Data rombel tidak ditemukan', 404, ErrorCode.NOT_FOUND);
  }

  return pembelajaranModel.listPembelajaranByRombel(rombelId);
}

async function update(id, data, query) {
  const sekolahId = query.sekolah_id ? String(query.sekolah_id).trim() : '';
  const rombel = await rombelModel.findRombelById(id, sekolahId);
  
  if (!rombel) {
    throw createError('Data tidak ditemukan', 404, ErrorCode.NOT_FOUND);
  }

  try {
    return await rombelModel.updateRombel(id, data, sekolahId);
  } catch (error) {
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      throw createError('Data relasi rombel tidak ditemukan', 400, ErrorCode.VALIDATION_ERROR);
    }
    throw error;
  }
}

async function remove(id, query) {
  const sekolahId = query.sekolah_id ? String(query.sekolah_id).trim() : '';
  const rombel = await rombelModel.findRombelById(id, sekolahId);
  
  if (!rombel) {
    throw createError('Data tidak ditemukan', 404, ErrorCode.NOT_FOUND);
  }

  try {
    await rombelModel.deleteRombel(id, sekolahId);
    return true;
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      throw createError('Rombel ini tidak dapat dihapus karena masih digunakan', 400, ErrorCode.VALIDATION_ERROR);
    }
    throw error;
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
};

