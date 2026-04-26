const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { authenticate } = require('../../middlewares/auth.middleware');
const { authorize } = require('../../middlewares/authorize.middleware');
const { tenantMiddleware } = require('../../middlewares/tenant.middleware');

router.use(authenticate);
router.use(tenantMiddleware);

router.get('/', controller.getJurnal);
router.get('/rekap', authorize('admin', 'guru'), controller.getRekap);
router.get('/siswa/:rombel_id', authorize('admin', 'guru'), controller.getSiswaRombel);
router.get('/:id', controller.getJurnalDetail);
router.post('/', authorize('admin', 'guru'), controller.saveJurnal);
router.delete('/:id', authorize('admin', 'guru'), controller.removeJurnal);

module.exports = router;
