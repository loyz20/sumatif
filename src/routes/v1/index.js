const express = require('express');
const { testConnection } = require('../../config/db');
const { successResponse } = require('../../utils/response');
const ErrorCode = require('../../constants/errorCodes');
const authRoutes = require('./auth.routes');
const sekolahRoutes = require('./sekolah.routes');
const ptkRoutes = require('./ptk.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/sekolah', sekolahRoutes);
router.use('/ptk', ptkRoutes);

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
