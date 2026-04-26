const ErrorCode = require('../../constants/errorCodes');
const siswaModel = require('./model');
const { createError, parsePagination } = require('../shared/service');

async function list(query) {
  const pagination = parsePagination(query, 'nama', new Set(['nama', 'nis', 'nisn', 'nik', 'tanggal_lahir', 'kelas', 'jenis_kelamin']));
  const sekolahId = query.sekolah_id ? String(query.sekolah_id).trim() : '';
  const jenisKelamin = query.jenis_kelamin;
  const rombelId = query.rombel_id;

  return siswaModel.listSiswa({ 
    ...pagination, 
    sekolahId, 
    jenisKelamin, 
    rombelId 
  });
}

async function detail(id, query) {
  const sekolahId = query.sekolah_id ? String(query.sekolah_id).trim() : '';
  const siswa = await siswaModel.findSiswaById(id, sekolahId);
  if (!siswa) {
    throw createError('Data siswa tidak ditemukan', 404, ErrorCode.NOT_FOUND);
  }

  return siswa;
}

async function create(data) {
  if (!data.nama || !data.nis) {
    throw createError('Nama dan NIS wajib diisi', 400, ErrorCode.VALIDATION_ERROR);
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
  const sekolahId = data.sekolah_id ? String(data.sekolah_id).trim() : '';
  const siswa = await siswaModel.findSiswaById(id, sekolahId);
  if (!siswa) {
    throw createError('Data siswa tidak ditemukan', 404, ErrorCode.NOT_FOUND);
  }

  try {
    return await siswaModel.updateSiswa(id, data, sekolahId);
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

async function remove(id, query) {
  const sekolahId = query.sekolah_id ? String(query.sekolah_id).trim() : '';
  const deleted = await siswaModel.deleteSiswa(id, sekolahId);
  if (!deleted) {
    throw createError('Data siswa tidak ditemukan', 404, ErrorCode.NOT_FOUND);
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
      // Check if NIS already exists in this school
      const existing = await siswaModel.findSiswaByNis(item.nis, sekolahId);
      
      if (existing) {
        await update(existing.id, item);
      } else {
        await create(item);
      }
      
      successCount++;
    } catch (error) {
      failedCount++;
      errors.push({ item, error: error.message || 'Gagal mengimpor' });
    }
  }

  return { successCount, failedCount, errors };
}

async function stats(query) {
  const sekolahId = query.sekolah_id;
  return await siswaModel.getSiswaStats(sekolahId);
}

module.exports = {
  list,
  detail,
  create,
  update,
  remove,
  importData,
  stats,
};

