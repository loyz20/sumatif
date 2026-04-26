const express = require('express');
const { controller: rombelController } = require('../../modules/rombel');
const { validateRequest } = require('../../middlewares/validation.middleware');
const { authorize } = require('../../middlewares/authorize.middleware');
const { idParamsSchema } = require('../../validations/base.schema');
const {
  createRombelSchema,
  listRombelQuerySchema,
  addAnggotaRombelSchema,
  updateRombelSchema,
  importRombelSchema,
} = require('../../validations/rombel.schema');

const router = express.Router();

router.get('/stats', authorize('admin', 'guru', 'guru_bk'), rombelController.stats);
router.get('/', authorize('admin', 'guru', 'guru_bk'), validateRequest(listRombelQuerySchema, 'query'), rombelController.list);
router.post('/import', authorize('admin'), validateRequest(importRombelSchema), rombelController.importData);
router.post('/', authorize('admin'), validateRequest(createRombelSchema), rombelController.create);
router.get('/:id', authorize('admin', 'guru', 'guru_bk'), validateRequest(idParamsSchema, 'params'), rombelController.detail);
router.put('/:id', authorize('admin'), validateRequest(idParamsSchema, 'params'), validateRequest(updateRombelSchema), rombelController.update);
router.delete('/:id', authorize('admin'), validateRequest(idParamsSchema, 'params'), rombelController.remove);
router.post('/:id/anggota', authorize('admin'), validateRequest(idParamsSchema, 'params'), validateRequest(addAnggotaRombelSchema), rombelController.addAnggota);
router.get('/:id/anggota', authorize('admin', 'guru', 'guru_bk'), validateRequest(idParamsSchema, 'params'), rombelController.listAnggota);
router.get('/:id/pembelajaran', authorize('admin', 'guru', 'guru_bk'), validateRequest(idParamsSchema, 'params'), rombelController.listPembelajaran);

module.exports = router;