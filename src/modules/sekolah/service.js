const ErrorCode = require('../../constants/errorCodes');
const sekolahModel = require('./model');
const userManagementModel = require('../userManagement/model');
const { createError, parsePagination } = require('../shared/service');

const SEKOLAH_SORT_FIELDS = new Set([
  'created_at', 'nama', 'npsn', 'status',
  'provinsi', 'kabupaten', 'kecamatan', 'desa',
]);

async function list(query) {
  const pagination = parsePagination(query, 'created_at', SEKOLAH_SORT_FIELDS);
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
  let sekolah;

  try {
    sekolah = await sekolahModel.createSekolah(data);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw createError('NPSN sudah terdaftar', 409, ErrorCode.DUPLICATE_DATA);
    }
    throw error;
  }

  // Auto-create admin user for the new school
  const adminUsername = `admin_${data.npsn}`;
  const adminPassword = 'admin123';

  try {
    const adminUser = await userManagementModel.createUser({
      sekolah_id: sekolah.id,
      username: adminUsername,
      password: adminPassword,
      role: 'admin',
    });

    return {
      ...sekolah,
      admin_user: {
        id: adminUser.id,
        username: adminUsername,
        default_password: adminPassword,
      },
    };
  } catch (error) {
    // If admin creation fails due to duplicate username, still return school
    // but warn about the admin user
    if (error.code === 'ER_DUP_ENTRY') {
      return {
        ...sekolah,
        admin_user: null,
        admin_warning: `Username "${adminUsername}" sudah digunakan. Silakan buat admin secara manual.`,
      };
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
