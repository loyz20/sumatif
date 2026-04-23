const ErrorCode = require('../../constants/errorCodes');
const rombelModel = require('./model');
const pembelajaranModel = require('../pembelajaran/model');
const { createError, parsePagination } = require('../shared/service');

async function list(query) {
  const pagination = parsePagination(query, 'nama', new Set(['nama', 'tingkat']));
  const tahunAjaranId = query.tahun_ajaran_id ? String(query.tahun_ajaran_id).trim() : '';
  return rombelModel.listRombel({ ...pagination, tahunAjaranId });
}

async function detail(id) {
  const rombel = await rombelModel.findRombelById(id);
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
  const rombel = await rombelModel.findRombelById(rombelId);
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

async function listAnggota(rombelId) {
  const rombel = await rombelModel.findRombelById(rombelId);
  if (!rombel) {
    throw createError('Data rombel tidak ditemukan', 404, ErrorCode.NOT_FOUND);
  }

  return rombelModel.listAnggotaRombel(rombelId);
}

async function listPembelajaran(rombelId) {
  const rombel = await rombelModel.findRombelById(rombelId);
  if (!rombel) {
    throw createError('Data rombel tidak ditemukan', 404, ErrorCode.NOT_FOUND);
  }

  return pembelajaranModel.listPembelajaranByRombel(rombelId);
}

module.exports = {
  list,
  detail,
  create,
  addAnggota,
  listAnggota,
  listPembelajaran,
};

