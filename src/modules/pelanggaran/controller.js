const { successResponse } = require('../../utils/response');
const pelanggaranModel = require('./model');
const { logActivity } = require('../../utils/logger');

async function listMaster(req, res, next) {
  try {
    const result = await pelanggaranModel.listMasterPelanggaran(req.user.sekolah_id);
    return successResponse(res, result);
  } catch (error) {
    return next(error);
  }
}

async function createMaster(req, res, next) {
  try {
    const id = await pelanggaranModel.createMasterPelanggaran(req.user.sekolah_id, req.body);
    return successResponse(res, { id }, 'Tipe pelanggaran berhasil ditambahkan', 201);
  } catch (error) {
    return next(error);
  }
}

async function logIncident(req, res, next) {
  try {
    const { peserta_didik_id, peserta_didik_ids, master_pelanggaran_id } = req.body;
    
    // Support single or multiple IDs for backward compatibility and flexibility
    const ids = peserta_didik_ids || (peserta_didik_id ? [peserta_didik_id] : []);

    if (ids.length === 0 || !master_pelanggaran_id) {
      const error = new Error('Peserta didik dan tipe pelanggaran harus dipilih');
      error.status = 400;
      throw error;
    }

    // Process all students in the incident
    const results = await Promise.all(ids.map(async (studentId) => {
      const data = { ...req.body, peserta_didik_id: studentId };
      const incidentId = await pelanggaranModel.logPelanggaranSiswa(req.user.sekolah_id, data, req.user.id);
      
      // Audit Log for each student
      logActivity({
        user_id: req.user.id,
        action: 'LOG_PELANGGARAN_SISWA',
        entity_type: 'pelanggaran_siswa',
        entity_id: incidentId,
        description: `Mencatat pelanggaran siswa untuk peserta didik ID: ${studentId}`
      });

      // --- Notifications ---
      try {
        const detail = await pelanggaranModel.getIncidentDetail(incidentId);
        if (detail) {
          const NotificationService = require('../notification/service');
          
          // Notify Student
          if (detail.student_user_id) {
            await NotificationService.send(
              detail.student_user_id,
              'Pelanggaran Tercatat',
              `Anda tercatat melakukan pelanggaran: ${detail.violation_name}. Poin: ${detail.poin_snapshot}`,
              'warning'
            );
          }

          // Notify Wali Kelas
          if (detail.wali_user_id) {
            await NotificationService.send(
              detail.wali_user_id,
              'Pelanggaran Siswa',
              `Siswa ${detail.student_name} tercatat melakukan pelanggaran: ${detail.violation_name}.`,
              'warning'
            );
          }
        }
      } catch (notifError) {
        console.error('Failed to send violation notification:', notifError);
      }
      
      return incidentId;
    }));

    return successResponse(res, { ids: results }, 'Pelanggaran berhasil dicatat untuk semua siswa', 201);
  } catch (error) {
    return next(error);
  }
}

async function getHistory(req, res, next) {
  try {
    const result = await pelanggaranModel.getStudentHistory(req.user.sekolah_id, req.params.studentId);
    return successResponse(res, result);
  } catch (error) {
    return next(error);
  }
}

async function getLeaderboard(req, res, next) {
  try {
    const result = await pelanggaranModel.getTopViolationStudents(req.user.sekolah_id);
    return successResponse(res, result);
  } catch (error) {
    return next(error);
  }
}

async function updateMaster(req, res, next) {
  try {
    await pelanggaranModel.updateMasterPelanggaran(req.user.sekolah_id, req.params.id, req.body);
    return successResponse(res, null, 'Tipe pelanggaran berhasil diperbarui');
  } catch (error) {
    return next(error);
  }
}

async function removeMaster(req, res, next) {
  try {
    await pelanggaranModel.deleteMasterPelanggaran(req.user.sekolah_id, req.params.id);
    return successResponse(res, null, 'Tipe pelanggaran berhasil dihapus');
  } catch (error) {
    return next(error);
  }
}

async function logReward(req, res, next) {
  try {
    const id = await pelanggaranModel.logRewardSiswa(req.user.sekolah_id, req.body);
    
    logActivity({
      user_id: req.user.id,
      action: 'LOG_REWARD_SISWA',
      entity_type: 'reward_siswa',
      entity_id: id,
      description: `Mencatat prestasi siswa untuk peserta didik ID: ${req.body.peserta_didik_id}`
    });

    return successResponse(res, { id }, 'Prestasi berhasil dicatat', 201);
  } catch (error) {
    return next(error);
  }
}

async function getRewardHistory(req, res, next) {
  try {
    const result = await pelanggaranModel.getStudentRewardHistory(req.user.sekolah_id, req.params.studentId);
    return successResponse(res, result);
  } catch (error) {
    return next(error);
  }
}

async function listRewards(req, res, next) {
  try {
    const result = await pelanggaranModel.listAllRewards(req.user.sekolah_id);
    return successResponse(res, result);
  } catch (error) {
    return next(error);
  }
}

async function removeReward(req, res, next) {
  try {
    await pelanggaranModel.deleteRewardSiswa(req.user.sekolah_id, req.params.id);
    return successResponse(res, null, 'Data prestasi berhasil dihapus');
  } catch (error) {
    return next(error);
  }
}

async function getBKSummary(req, res, next) {
  try {
    const result = await pelanggaranModel.getStudentBKSummary(req.user.sekolah_id, req.params.studentId);
    return successResponse(res, result);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listMaster,
  createMaster,
  updateMaster,
  removeMaster,
  logIncident,
  logReward,
  listRewards,
  removeReward,
  getHistory,
  getRewardHistory,
  getBKSummary,
  getLeaderboard,
};
