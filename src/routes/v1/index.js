const express = require('express');
const { testConnection } = require('../../config/db');
const { successResponse } = require('../../utils/response');
const ErrorCode = require('../../constants/errorCodes');
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

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/sekolah', sekolahRoutes);
router.use('/ptk', ptkRoutes);
router.use('/siswa', siswaRoutes);
router.use('/registrasi', registrasiRoutes);
router.use('/rombel', rombelRoutes);
router.use('/mata-pelajaran', mataPelajaranRoutes);
router.use('/pembelajaran', pembelajaranRoutes);
router.use('/tahun-ajaran', tahunAjaranRoutes);
router.use('/semester', semesterRoutes);
router.use('/absensi', absensiRoutes);
router.use('/tracking', trackingRoutes);
router.use('/user', userRoutes);

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

module.exports = router;
