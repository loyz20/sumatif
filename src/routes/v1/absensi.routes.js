const express = require('express');
const { controller: absensiController } = require('../../modules/absensi');
const { validateRequest } = require('../../middlewares/validation.middleware');
const { absensiSchema, rekapAbsensiQuerySchema } = require('../../validations/absensi.schema');

const router = express.Router();

router.post('/masuk', validateRequest(absensiSchema), absensiController.masuk);
router.post('/keluar', validateRequest(absensiSchema), absensiController.keluar);
router.get('/', validateRequest(rekapAbsensiQuerySchema, 'query'), absensiController.rekap);

module.exports = router;