const express = require('express');
const { controller: rombelController } = require('../../modules/rombel');
const { validateRequest } = require('../../middlewares/validation.middleware');
const { idParamsSchema } = require('../../validations/base.schema');
const {
  createRombelSchema,
  listRombelQuerySchema,
  addAnggotaRombelSchema,
} = require('../../validations/rombel.schema');

const router = express.Router();

router.get('/', validateRequest(listRombelQuerySchema, 'query'), rombelController.list);
router.post('/', validateRequest(createRombelSchema), rombelController.create);
router.get('/:id', validateRequest(idParamsSchema, 'params'), rombelController.detail);
router.post('/:id/anggota', validateRequest(idParamsSchema, 'params'), validateRequest(addAnggotaRombelSchema), rombelController.addAnggota);
router.get('/:id/anggota', validateRequest(idParamsSchema, 'params'), rombelController.listAnggota);
router.get('/:id/pembelajaran', validateRequest(idParamsSchema, 'params'), rombelController.listPembelajaran);

module.exports = router;