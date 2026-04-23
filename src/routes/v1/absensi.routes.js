const express = require('express');
const { controller: absensiController } = require('../../modules/absensi');
const { validateRequest } = require('../../middlewares/validation.middleware');
const { authorize } = require('../../middlewares/authorize.middleware');
const { absensiSchema, rekapAbsensiQuerySchema } = require('../../validations/absensi.schema');

const router = express.Router();

router.post('/masuk', authorize('admin', 'guru', 'siswa'), validateRequest(absensiSchema), absensiController.masuk);
router.post('/keluar', authorize('admin', 'guru', 'siswa'), validateRequest(absensiSchema), absensiController.keluar);
router.get('/', authorize('admin', 'guru'), validateRequest(rekapAbsensiQuerySchema, 'query'), absensiController.rekap);

module.exports = router;