const crypto = require('crypto');
const BimbinganKonselingModel = require('./model');
const { successResponse, errorResponse } = require('../../utils/response');

class BimbinganKonselingController {
  static async list(req, res, next) {
    try {
      const sekolahId = req.user.sekolah_id;
      const { studentId, guruId } = req.query;
      
      const data = await BimbinganKonselingModel.listBySchool(sekolahId, { studentId, guruId });
      return successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const sekolahId = req.user.sekolah_id;
      
      const data = await BimbinganKonselingModel.findById(id, sekolahId);
      if (!data) {
        return errorResponse(res, 'Data konseling tidak ditemukan', null, 404);
      }
      
      return successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const sekolahId = req.user.sekolah_id;
      const {
        peserta_didik_id, guru_bk_id, tanggal, masalah, tindakan, catatan, is_private
      } = req.body;

      const id = crypto.randomUUID();
      await BimbinganKonselingModel.create({
        id,
        sekolah_id: sekolahId,
        peserta_didik_id,
        guru_bk_id: guru_bk_id || req.user.id,
        tanggal,
        masalah,
        tindakan,
        catatan,
        is_private: is_private ?? 1
      });

      return successResponse(res, { id }, 'Data konseling berhasil dicatat', 201);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const sekolahId = req.user.sekolah_id;
      
      const success = await BimbinganKonselingModel.update(id, sekolahId, req.body);
      if (!success) {
        return errorResponse(res, 'Gagal memperbarui data konseling', null, 400);
      }

      return successResponse(res, null, 'Data konseling berhasil diperbarui');
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const sekolahId = req.user.sekolah_id;
      
      const success = await BimbinganKonselingModel.delete(id, sekolahId);
      if (!success) {
        return errorResponse(res, 'Gagal menghapus data konseling', null, 400);
      }

      return successResponse(res, null, 'Data konseling berhasil dihapus');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = BimbinganKonselingController;
