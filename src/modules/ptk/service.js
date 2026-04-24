const ErrorCode = require('../../constants/errorCodes');
const ptkModel = require('./model');
const { createError, parsePagination } = require('../shared/service');

const PTK_SORT_FIELDS = new Set([
  'nama', 'nik', 'nip', 'nuptk',
  'jenis_kelamin', 'tanggal_lahir', 'pendidikan_terakhir', 'created_at',
]);

async function list(query) {
  const pagination = parsePagination(query, 'nama', PTK_SORT_FIELDS);
  const sekolahId = query.sekolah_id ? String(query.sekolah_id).trim() : '';
  return ptkModel.listPtk({ ...pagination, sekolahId });
}

async function detail(id, query) {
  const sekolahId = query.sekolah_id;
  const ptk = await ptkModel.findPtkById(id, sekolahId);

  if (!ptk) {
    throw createError('Data PTK tidak ditemukan', 404, ErrorCode.NOT_FOUND);
  }

  return ptk;
}

const userManagementModel = require('../userManagement/model');

async function create(data) {
  const conflicts = await ptkModel.findPtkConflicts({
    nik: data.nik,
    nip: data.nip,
    nuptk: data.nuptk,
  });

  if (conflicts.length > 0) {
    throw createError('Data PTK duplikat', 409, ErrorCode.DUPLICATE_DATA);
  }

  let ptk;
  try {
    ptk = await ptkModel.createPtk(data);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw createError('Data PTK duplikat', 409, ErrorCode.DUPLICATE_DATA);
    }

    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      throw createError('Data sekolah tidak ditemukan', 404, ErrorCode.NOT_FOUND);
    }

    throw error;
  }

  // Auto-create guru user
  const guruUsername = data.nip;
  const guruPassword = 'guru123';

  try {
    const guruUser = await userManagementModel.createUser({
      sekolah_id: ptk.sekolah_id,
      username: guruUsername,
      password: guruPassword,
      role: 'guru',
      ref_id: ptk.id,
    });

    return {
      ...ptk,
      user: {
        id: guruUser.id,
        username: guruUsername,
        default_password: guruPassword,
      },
    };
  } catch (error) {
    // If user creation fails (e.g. duplicate username), still return the created PTK
    return ptk;
  }
}

async function update(id, data) {
  const sekolahId = data.sekolah_id;
  const ptk = await ptkModel.findPtkById(id, sekolahId);
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
    return await ptkModel.updatePtk(id, data, sekolahId);
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

async function remove(id, query) {
  const sekolahId = query.sekolah_id;
  const deleted = await ptkModel.deletePtk(id, sekolahId);

  if (!deleted) {
    throw createError('Data PTK tidak ditemukan', 404, ErrorCode.NOT_FOUND);
  }

  return true;
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
  detail,
  create,
  update,
  remove,
  importData,
};
