const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { authenticate } = require('../../middlewares/auth.middleware');
const { authorize } = require('../../middlewares/authorize.middleware');
const { tenantMiddleware } = require('../../middlewares/tenant.middleware');

router.use(authenticate);
router.use(tenantMiddleware);

router.get('/', controller.getPengumuman);
router.post('/', authorize('admin'), controller.savePengumuman);
router.delete('/:id', authorize('admin'), controller.removePengumuman);

module.exports = router;
