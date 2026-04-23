const ErrorCode = require('../../constants/errorCodes');
const siswaModel = require('./model');
const { createError, parsePagination } = require('../shared/service');

async function list(query) {
  const pagination = parsePagination(query, 'nama', new Set(['nama', 'nisn', 'nik', 'tanggal_lahir']));
  const sekolahId = query.sekolah_id ? String(query.sekolah_id).trim() : '';
  return siswaModel.listSiswa({ ...pagination, sekolahId });
}

async function detail(id) {
  const siswa = await siswaModel.findSiswaById(id);
  if (!siswa) {
    throw createError('Data siswa tidak ditemukan', 404, ErrorCode.NOT_FOUND);
  }

  return siswa;
}

async function create(data) {
  const conflicts = await siswaModel.findSiswaConflicts({ nisn: data.nisn, nik: data.nik });
  if (conflicts.length > 0) {
    throw createError('Data siswa duplikat', 409, ErrorCode.DUPLICATE_DATA);
  }

  try {
    return await siswaModel.createSiswa(data);
  } catch (error) {
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      throw createError('Data sekolah tidak ditemukan', 404, ErrorCode.NOT_FOUND);
    }

    if (error.code === 'ER_DUP_ENTRY') {
      throw createError('Data siswa duplikat', 409, ErrorCode.DUPLICATE_DATA);
    }

    throw error;
  }
}

async function update(id, data) {
  const siswa = await siswaModel.findSiswaById(id);
  if (!siswa) {
    throw createError('Data siswa tidak ditemukan', 404, ErrorCode.NOT_FOUND);
  }

  const conflicts = await siswaModel.findSiswaConflicts({ nisn: data.nisn, nik: data.nik }, id);
  if (conflicts.length > 0) {
    throw createError('Data siswa duplikat', 409, ErrorCode.DUPLICATE_DATA);
  }

  try {
    return await siswaModel.updateSiswa(id, data);
  } catch (error) {
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      throw createError('Data sekolah tidak ditemukan', 404, ErrorCode.NOT_FOUND);
    }

    if (error.code === 'ER_DUP_ENTRY') {
      throw createError('Data siswa duplikat', 409, ErrorCode.DUPLICATE_DATA);
    }

    throw error;
  }
}

async function remove(id) {
  const deleted = await siswaModel.deleteSiswa(id);
  if (!deleted) {
    throw createError('Data siswa tidak ditemukan', 404, ErrorCode.NOT_FOUND);
  }

  return true;
}

module.exports = {
  list,
  detail,
  create,
  update,
  remove,
};

