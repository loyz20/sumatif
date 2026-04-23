const ErrorCode = require('../../constants/errorCodes');
const ptkModel = require('../ptk/model');
const ptkRiwayatModel = require('./model');
const { createError } = require('../shared/service');

async function listPendidikan(ptkId) {
  const ptk = await ptkModel.findPtkById(ptkId);
  if (!ptk) {
    throw createError('Data PTK tidak ditemukan', 404, ErrorCode.NOT_FOUND);
  }

  return ptkRiwayatModel.listRiwayatPendidikanPtk(ptkId);
}

async function createPendidikan(ptkId, data) {
  const ptk = await ptkModel.findPtkById(ptkId);
  if (!ptk) {
    throw createError('Data PTK tidak ditemukan', 404, ErrorCode.NOT_FOUND);
  }

  return ptkRiwayatModel.createRiwayatPendidikanPtk(ptkId, data);
}

async function listKepangkatan(ptkId) {
  const ptk = await ptkModel.findPtkById(ptkId);
  if (!ptk) {
    throw createError('Data PTK tidak ditemukan', 404, ErrorCode.NOT_FOUND);
  }

  return ptkRiwayatModel.listRiwayatKepangkatanPtk(ptkId);
}

module.exports = {
  listPendidikan,
  createPendidikan,
  listKepangkatan,
};

