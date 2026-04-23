const express = require('express');
const { testConnection } = require('../../config/db');
const { successResponse } = require('../../utils/response');
const ErrorCode = require('../../constants/errorCodes');
const { authenticate } = require('../../middlewares/auth.middleware');
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

module.exports = router;

