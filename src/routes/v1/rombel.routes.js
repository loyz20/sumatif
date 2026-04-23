const express = require('express');
const { controller: rombelController } = require('../../modules/rombel');
const { validateRequest } = require('../../middlewares/validation.middleware');
const { authorize } = require('../../middlewares/authorize.middleware');
const { idParamsSchema } = require('../../validations/base.schema');
const {
  createRombelSchema,
  listRombelQuerySchema,
  addAnggotaRombelSchema,
} = require('../../validations/rombel.schema');

const router = express.Router();

router.get('/', authorize('admin', 'guru'), validateRequest(listRombelQuerySchema, 'query'), rombelController.list);
router.post('/', authorize('admin'), validateRequest(createRombelSchema), rombelController.create);
router.get('/:id', authorize('admin', 'guru'), validateRequest(idParamsSchema, 'params'), rombelController.detail);
router.post('/:id/anggota', authorize('admin'), validateRequest(idParamsSchema, 'params'), validateRequest(addAnggotaRombelSchema), rombelController.addAnggota);
router.get('/:id/anggota', authorize('admin', 'guru'), validateRequest(idParamsSchema, 'params'), rombelController.listAnggota);
router.get('/:id/pembelajaran', authorize('admin', 'guru'), validateRequest(idParamsSchema, 'params'), rombelController.listPembelajaran);

module.exports = router;