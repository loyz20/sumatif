const ErrorCode = require('../constants/errorCodes');
const sekolahModel = require('../models/sekolah.model');

function createError(message, statusCode, code) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.code = code;
  return error;
}

function parsePagination(query) {
  const page = Math.max(Number.parseInt(query.page || '1', 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(query.limit || '10', 10) || 10, 1), 100);
  const search = query.search ? String(query.search).trim() : '';
  const sort = query.sort ? String(query.sort).trim() : 'created_at:desc';

  const [sortFieldRaw, sortDirectionRaw] = sort.split(':');
  const allowedSortFields = new Set([
    'created_at',
    'nama',
    'npsn',
    'status',
    'provinsi',
    'kabupaten',
    'kecamatan',
    'desa',
  ]);
  const sortField = allowedSortFields.has(sortFieldRaw) ? sortFieldRaw : 'created_at';
  const sortDirection = String(sortDirectionRaw || 'desc').toLowerCase() === 'asc' ? 'ASC' : 'DESC';

  return { page, limit, search, sortField, sortDirection };
}

async function list(query) {
  const pagination = parsePagination(query);
  return sekolahModel.listSekolah(pagination);
}

async function detail(id) {
  const sekolah = await sekolahModel.findSekolahById(id);

  if (!sekolah) {
    throw createError('Data sekolah tidak ditemukan', 404, ErrorCode.NOT_FOUND);
  }

  return sekolah;
}

async function create(data) {
  try {
    return await sekolahModel.createSekolah(data);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw createError('NPSN sudah terdaftar', 409, ErrorCode.DUPLICATE_DATA);
    }

    throw error;
  }
}

async function update(id, data) {
  const sekolah = await sekolahModel.findSekolahById(id);
  if (!sekolah) {
    throw createError('Data sekolah tidak ditemukan', 404, ErrorCode.NOT_FOUND);
  }

  try {
    const updatedSekolah = await sekolahModel.updateSekolah(id, data);
    return updatedSekolah;
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw createError('NPSN sudah terdaftar', 409, ErrorCode.DUPLICATE_DATA);
    }

    throw error;
  }
}

async function remove(id) {
  const deleted = await sekolahModel.deleteSekolah(id);

  if (!deleted) {
    throw createError('Data sekolah tidak ditemukan', 404, ErrorCode.NOT_FOUND);
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
