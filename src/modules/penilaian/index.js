const express = require('express');
const controller = require('./controller');
const { authenticate } = require('../../middlewares/auth.middleware');
const { tenantMiddleware } = require('../../middlewares/tenant.middleware');

const router = express.Router();

router.use(authenticate);
router.use(tenantMiddleware);

// Kategori (Master Bobot)
router.get('/kategori', controller.getKategori);
router.post('/kategori', controller.saveKategori);
router.put('/kategori/:id', controller.saveKategori);
router.delete('/kategori/:id', controller.removeKategori);

// Penilaian (Header)
router.get('/', controller.getPenilaianList);
router.post('/', controller.createPenilaian);
router.delete('/:id', controller.deletePenilaian);

// Nilai (Detail)
router.get('/:id/nilai', controller.getGrades);
router.post('/:id/nilai', controller.saveGrades);

// Rekap (Calculated Result)
router.get('/rekap', controller.getRekap);

module.exports = router;
