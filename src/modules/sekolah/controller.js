const { successResponse } = require('../../utils/response');
const sekolahService = require('./service');
const { logActivity } = require('../../shared/activityLog');

async function list(req, res, next) {
  try {
    const result = await sekolahService.list(req.query);
    return successResponse(res, result);
  } catch (error) {
    return next(error);
  }
}

async function detail(req, res, next) {
  try {
    const result = await sekolahService.detail(req.params.id);
    return successResponse(res, result);
  } catch (error) {
    return next(error);
  }
}

async function create(req, res, next) {
  try {
    const result = await sekolahService.create(req.body);
    await logActivity({
      userId: req.user.id,
      action: 'CREATE_SEKOLAH',
      entityType: 'sekolah',
      entityId: result.id,
      description: `Mendaftarkan profil sekolah baru: ${result.nama}`
    });
    return successResponse(res, result, 'Success', 201);
  } catch (error) {
    return next(error);
  }
}

async function update(req, res, next) {
  try {
    // Security check: admin can only update their own school
    if (req.user.role === 'admin' && req.user.sekolah_id !== req.params.id) {
        const error = new Error('Anda tidak memiliki akses untuk memperbarui sekolah lain');
        error.status = 403;
        throw error;
    }

    const result = await sekolahService.update(req.params.id, req.body);
    await logActivity({
      userId: req.user.id,
      action: 'UPDATE_SEKOLAH',
      entityType: 'sekolah',
      entityId: result.id,
      description: `Memperbarui profil sekolah: ${result.nama}`
    });
    return successResponse(res, result);
  } catch (error) {
    return next(error);
  }
}

async function uploadLogo(req, res, next) {
  try {
    if (!req.file) {
      const error = new Error('File logo harus diunggah');
      error.status = 400;
      throw error;
    }

    // Security check: admin can only update their own school
    if (req.user.role === 'admin' && req.user.sekolah_id !== req.params.id) {
      const error = new Error('Anda tidak memiliki akses untuk memperbarui sekolah lain');
      error.status = 403;
      throw error;
    }

    const logoUrl = `/uploads/logos/${req.file.filename}`;
    const result = await sekolahService.updateLogo(req.params.id, logoUrl);
    
    await logActivity({
      userId: req.user.id,
      action: 'UPDATE_LOGO_SEKOLAH',
      entityType: 'sekolah',
      entityId: req.params.id,
      description: `Memperbarui logo sekolah ID: ${req.params.id}`
    });

    return successResponse(res, { logo_url: logoUrl }, 'Logo berhasil diperbarui');
  } catch (error) {
    return next(error);
  }
}

async function remove(req, res, next) {
  try {
    await sekolahService.remove(req.params.id);
    await logActivity({
      userId: req.user.id,
      action: 'DELETE_SEKOLAH',
      entityType: 'sekolah',
      entityId: req.params.id,
      description: `Menghapus data sekolah dengan ID: ${req.params.id}`
    });
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

async function stats(req, res, next) {
  try {
    const result = await sekolahService.getStats();
    return successResponse(res, result);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  list,
  detail,
  create,
  update,
  uploadLogo,
  remove,
  stats,
};
