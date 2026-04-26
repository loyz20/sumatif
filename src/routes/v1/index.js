const express = require('express');
const { testConnection } = require('../../config/db');
const { successResponse } = require('../../utils/response');
const ErrorCode = require('../../constants/errorCodes');
const { authenticate, authorize } = require('../../middlewares/auth.middleware');
const { tenantMiddleware } = require('../../middlewares/tenant.middleware');
const authRoutes = require('./auth.routes');
const sekolahRoutes = require('./sekolah.routes');
const ptkRoutes = require('./ptk.routes');
const siswaRoutes = require('./siswa.routes');
const registrasiRoutes = require('./registrasi.routes');
const rombelRoutes = require('./rombel.routes');
const mataPelajaranRoutes = require('./mata-pelajaran.routes');
const pembelajaranRoutes = require('./pembelajaran.routes');
const tahunAjaranRoutes = require('./tahun-ajaran.routes');
const semesterRoutes = require('./semester.routes');
const absensiRoutes = require('./absensi.routes');
const trackingRoutes = require('./tracking.routes');
const userRoutes = require('./user.routes');
const dashboardRoutes = require('./dashboard.routes');
const penilaianRoutes = require('../../modules/penilaian');
const jadwalRoutes = require('./jadwal.routes');
const notificationRoutes = require('./notification.routes');
const bimbinganKonselingRoutes = require('./bimbingan-konseling.routes');
const jurnalRoutes = require('../../modules/jurnal/routes');
const waliKelasRoutes = require('../../modules/waliKelas/routes');

const router = express.Router();

// Public routes (no authentication required)
router.use('/auth', authRoutes);

router.get('/', (req, res) => {
  return successResponse(res, { service: 'Express API is running' });
});

router.get('/health', (req, res) => {
  return successResponse(res, { status: 'ok' });
});

router.get('/db-health', async (req, res, next) => {
  try {
    await testConnection();
    return successResponse(res, { status: 'ok', database: 'connected' });
  } catch (error) {
    error.statusCode = 500;
    error.code = ErrorCode.INTERNAL_ERROR;
    return next(error);
  }
});

// Protected routes (authentication required)
router.use('/sekolah', authenticate, tenantMiddleware, sekolahRoutes);
router.use('/ptk', authenticate, tenantMiddleware, ptkRoutes);
router.use('/siswa', authenticate, tenantMiddleware, siswaRoutes);
router.use('/registrasi', authenticate, tenantMiddleware, registrasiRoutes);
router.use('/rombel', authenticate, tenantMiddleware, rombelRoutes);
router.use('/mata-pelajaran', authenticate, tenantMiddleware, mataPelajaranRoutes);
router.use('/pembelajaran', authenticate, tenantMiddleware, pembelajaranRoutes);
router.use('/tahun-ajaran', authenticate, tenantMiddleware, tahunAjaranRoutes);
router.use('/semester', authenticate, tenantMiddleware, semesterRoutes);
router.use('/absensi', authenticate, tenantMiddleware, absensiRoutes);
router.use('/tracking', authenticate, tenantMiddleware, trackingRoutes);
router.use('/user', authenticate, tenantMiddleware, userRoutes);
router.use('/dashboard', authenticate, tenantMiddleware, dashboardRoutes);
router.use('/penilaian', authenticate, tenantMiddleware, penilaianRoutes);
router.use('/jadwal', authenticate, tenantMiddleware, jadwalRoutes);
router.use('/notifications', authenticate, notificationRoutes);
router.use('/bimbingan-konseling', bimbinganKonselingRoutes);
router.use('/jurnal', jurnalRoutes);
router.use('/pengumuman', require('../../modules/pengumuman/routes'));
router.use('/wali-kelas', authenticate, tenantMiddleware, waliKelasRoutes);

router.get('/activity-log/stats', authenticate, tenantMiddleware, require('../../modules/activityLog/controller').stats);
router.get('/activity-log', authenticate, tenantMiddleware, require('../../modules/activityLog/controller').list);

const presensiController = require('../../modules/presensi/controller');
router.post('/presensi', authenticate, tenantMiddleware, presensiController.save);
router.get('/presensi', authenticate, tenantMiddleware, presensiController.list);
router.get('/presensi/rekap', authenticate, tenantMiddleware, presensiController.rekap);

const pelanggaranController = require('../../modules/pelanggaran/controller');
router.get('/pelanggaran/master', authenticate, tenantMiddleware, authorize('admin', 'guru', 'guru_bk'), pelanggaranController.listMaster);
router.post('/pelanggaran/master', authenticate, tenantMiddleware, authorize('admin'), pelanggaranController.createMaster);
router.put('/pelanggaran/master/:id', authenticate, tenantMiddleware, authorize('admin'), pelanggaranController.updateMaster);
router.delete('/pelanggaran/master/:id', authenticate, tenantMiddleware, authorize('admin'), pelanggaranController.removeMaster);
router.post('/pelanggaran/incident', authenticate, tenantMiddleware, authorize('admin', 'guru', 'guru_bk'), pelanggaranController.logIncident);
router.get('/pelanggaran/reward', authenticate, tenantMiddleware, authorize('admin', 'guru', 'guru_bk'), pelanggaranController.listRewards);
router.post('/pelanggaran/reward', authenticate, tenantMiddleware, authorize('admin', 'guru', 'guru_bk'), pelanggaranController.logReward);
router.delete('/pelanggaran/reward/:id', authenticate, tenantMiddleware, authorize('admin', 'guru_bk'), pelanggaranController.removeReward);
router.get('/pelanggaran/history/:studentId', authenticate, tenantMiddleware, authorize('admin', 'guru', 'guru_bk'), pelanggaranController.getHistory);
router.get('/pelanggaran/rewards/:studentId', authenticate, tenantMiddleware, authorize('admin', 'guru', 'guru_bk'), pelanggaranController.getRewardHistory);
router.get('/pelanggaran/summary/:studentId', authenticate, tenantMiddleware, authorize('admin', 'guru', 'guru_bk'), pelanggaranController.getBKSummary);
router.get('/pelanggaran/leaderboard', authenticate, tenantMiddleware, authorize('admin', 'guru', 'guru_bk'), pelanggaranController.getLeaderboard);

module.exports = router;

