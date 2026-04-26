const express = require('express');
const BimbinganKonselingController = require('../../modules/bimbinganKonseling/controller');
const { authenticate, authorize } = require('../../middlewares/auth.middleware');
const { tenantMiddleware } = require('../../middlewares/tenant.middleware');

const router = express.Router();

router.use(authenticate);
router.use(tenantMiddleware);
router.use(authorize('admin', 'guru', 'guru_bk'));

router.get('/', BimbinganKonselingController.list);
router.get('/:id', BimbinganKonselingController.getById);
router.post('/', BimbinganKonselingController.create);
router.patch('/:id', BimbinganKonselingController.update);
router.delete('/:id', BimbinganKonselingController.delete);

module.exports = router;
