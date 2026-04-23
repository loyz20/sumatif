const ErrorCode = require('../../constants/errorCodes');
const absensiModel = require('./model');
const { createError } = require('../shared/service');

async function masuk(data) {
  try {
    return await absensiModel.upsertAbsensiMasuk(data);
  } catch (error) {
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      throw createError('Data peserta didik tidak ditemukan', 404, ErrorCode.NOT_FOUND);
    }

    throw error;
  }
}

async function keluar(data) {
  const absensi = await absensiModel.updateAbsensiKeluar(data);
  if (!absensi) {
    throw createError('Data absensi masuk hari ini belum tersedia', 404, ErrorCode.NOT_FOUND);
  }

  return absensi;
}

async function rekap(query) {
  const page = Math.max(Number.parseInt(query.page || '1', 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(query.limit || '10', 10) || 10, 1), 100);
  const pesertaDidikId = query.peserta_didik_id ? String(query.peserta_didik_id).trim() : '';
  const bulan = query.bulan ? String(query.bulan) : '';
  const tahun = query.tahun ? String(query.tahun) : '';

  return absensiModel.rekapAbsensi({
    pesertaDidikId,
    bulan,
    tahun,
    page,
    limit,
  });
}

module.exports = {
  masuk,
  keluar,
  rekap,
};

