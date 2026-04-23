const ErrorCode = require('../../constants/errorCodes');
const ptkModel = require('./model');
const { createError } = require('../shared/service');

function parsePagination(query) {
  const page = Math.max(Number.parseInt(query.page || '1', 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(query.limit || '10', 10) || 10, 1), 100);
  const search = query.search ? String(query.search).trim() : '';
  const sekolahId = query.sekolah_id ? String(query.sekolah_id).trim() : '';
  const sort = query.sort ? String(query.sort).trim() : 'nama:asc';

  const [sortFieldRaw, sortDirectionRaw] = sort.split(':');
  const allowedSortFields = new Set([
    'nama',
    'nik',
    'nip',
    'nuptk',
    'jenis_kelamin',
    'tanggal_lahir',
    'pendidikan_terakhir',
    'created_at',
  ]);
  const sortField = allowedSortFields.has(sortFieldRaw) ? sortFieldRaw : 'nama';
  const sortDirection = String(sortDirectionRaw || 'asc').toLowerCase() === 'desc' ? 'DESC' : 'ASC';

  return { page, limit, search, sekolahId, sortField, sortDirection };
}

async function list(query) {
  const pagination = parsePagination(query);
  return ptkModel.listPtk(pagination);
}

async function detail(id) {
  const ptk = await ptkModel.findPtkById(id);

  if (!ptk) {
    throw createError('Data PTK tidak ditemukan', 404, ErrorCode.NOT_FOUND);
  }

  return ptk;
}

async function create(data) {
  const conflicts = await ptkModel.findPtkConflicts({
    nik: data.nik,
    nip: data.nip,
    nuptk: data.nuptk,
  });

  if (conflicts.length > 0) {
    throw createError('Data PTK duplikat', 409, ErrorCode.DUPLICATE_DATA);
  }

  try {
    return await ptkModel.createPtk(data);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw createError('Data PTK duplikat', 409, ErrorCode.DUPLICATE_DATA);
    }

    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      throw createError('Data sekolah tidak ditemukan', 404, ErrorCode.NOT_FOUND);
    }

    throw error;
  }
}

async function update(id, data) {
  const ptk = await ptkModel.findPtkById(id);
  if (!ptk) {
    throw createError('Data PTK tidak ditemukan', 404, ErrorCode.NOT_FOUND);
  }

  const conflicts = await ptkModel.findPtkConflicts(
    {
      nik: data.nik,
      nip: data.nip,
      nuptk: data.nuptk,
    },
    id
  );

  if (conflicts.length > 0) {
    throw createError('Data PTK duplikat', 409, ErrorCode.DUPLICATE_DATA);
  }

  try {
    return await ptkModel.updatePtk(id, data);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw createError('Data PTK duplikat', 409, ErrorCode.DUPLICATE_DATA);
    }

    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      throw createError('Data sekolah tidak ditemukan', 404, ErrorCode.NOT_FOUND);
    }

    throw error;
  }
}

async function remove(id) {
  const deleted = await ptkModel.deletePtk(id);

  if (!deleted) {
    throw createError('Data PTK tidak ditemukan', 404, ErrorCode.NOT_FOUND);
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
