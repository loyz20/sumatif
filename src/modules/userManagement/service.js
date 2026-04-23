const ErrorCode = require('../../constants/errorCodes');
const userManagementModel = require('./model');
const { createError, parsePagination } = require('../shared/service');

async function list(query, actor) {
  const pagination = parsePagination(query, 'username', new Set(['username', 'role', 'created_at']));
  let sekolahId = query.sekolah_id ? String(query.sekolah_id).trim() : '';

  // If actor is admin, force their sekolah_id
  if (actor.role === 'admin') {
    sekolahId = actor.sekolah_id;
  } else if (actor.role === 'superadmin') {
    // Optional: if superadmin only manages admins, we could filter here
    // but typically they can see all for monitoring.
  }

  return userManagementModel.listUsers({ ...pagination, sekolahId });
}

async function detail(id, actor) {
  const user = await userManagementModel.findUserById(id);
  if (!user) {
    throw createError('Data pengguna tidak ditemukan', 404, ErrorCode.NOT_FOUND);
  }

  // Admin can only see their own school's users
  if (actor.role === 'admin' && user.sekolah_id !== actor.sekolah_id) {
    throw createError('Anda tidak memiliki akses ke data ini', 403, ErrorCode.FORBIDDEN);
  }

  return user;
}

async function create(data, actor) {
  // Rules check
  if (actor.role === 'superadmin') {
    if (data.role !== 'admin') {
      throw createError('Superadmin hanya dapat menambah akun Admin Sekolah', 403, ErrorCode.FORBIDDEN);
    }
  } else if (actor.role === 'admin') {
    if (data.role === 'superadmin') {
      throw createError('Admin tidak dapat menambah akun Superadmin', 403, ErrorCode.FORBIDDEN);
    }
    // Enforce school affiliation for admin creators
    data.sekolah_id = actor.sekolah_id;
  } else {
    throw createError('Akses ditolak', 403, ErrorCode.FORBIDDEN);
  }

  try {
    return await userManagementModel.createUser(data);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw createError('Username sudah terdaftar', 409, ErrorCode.DUPLICATE_DATA);
    }

    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      throw createError('Data sekolah tidak ditemukan', 404, ErrorCode.NOT_FOUND);
    }

    throw error;
  }
}

async function update(id, data, actor) {
  const user = await userManagementModel.findUserById(id);
  if (!user) {
    throw createError('Data pengguna tidak ditemukan', 404, ErrorCode.NOT_FOUND);
  }

  // Rules check for target
  if (actor.role === 'superadmin') {
    if (user.role !== 'admin') {
      throw createError('Superadmin hanya dapat mengelola akun Admin Sekolah', 403, ErrorCode.FORBIDDEN);
    }
    // Cannot change target to superadmin
    if (data.role && data.role !== 'admin') {
      throw createError('Hanya dapat mengubah ke role Admin Sekolah', 403, ErrorCode.FORBIDDEN);
    }
  } else if (actor.role === 'admin') {
    if (user.role === 'superadmin') {
      throw createError('Admin tidak dapat mengelola akun Superadmin', 403, ErrorCode.FORBIDDEN);
    }
    if (user.sekolah_id !== actor.sekolah_id) {
      throw createError('Anda tidak memiliki akses ke data ini', 403, ErrorCode.FORBIDDEN);
    }
    if (data.role === 'superadmin') {
      throw createError('Tidak dapat mengubah ke role Superadmin', 403, ErrorCode.FORBIDDEN);
    }
  }

  try {
    return await userManagementModel.updateUser(id, data);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw createError('Username sudah digunakan', 409, ErrorCode.DUPLICATE_DATA);
    }
    throw error;
  }
}

async function remove(id, actor) {
  const user = await userManagementModel.findUserById(id);
  if (!user) {
    throw createError('Data pengguna tidak ditemukan', 404, ErrorCode.NOT_FOUND);
  }

  // Rules check
  if (actor.role === 'superadmin') {
    if (user.role !== 'admin') {
      throw createError('Superadmin hanya dapat menghapus akun Admin Sekolah', 403, ErrorCode.FORBIDDEN);
    }
  } else if (actor.role === 'admin') {
    if (user.role === 'superadmin') {
      throw createError('Admin tidak dapat menghapus akun Superadmin', 403, ErrorCode.FORBIDDEN);
    }
    if (user.sekolah_id !== actor.sekolah_id) {
      throw createError('Anda tidak memiliki akses ke data ini', 403, ErrorCode.FORBIDDEN);
    }
  }

  const deleted = await userManagementModel.deleteUser(id);
  if (!deleted) {
    throw createError('Data pengguna tidak ditemukan', 404, ErrorCode.NOT_FOUND);
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

