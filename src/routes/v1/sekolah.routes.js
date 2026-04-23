const express = require('express');
const { controller: sekolahController } = require('../../modules/sekolah');
const { validateRequest } = require('../../middlewares/validation.middleware');
const { idParamsSchema, paginationSchema } = require('../../validations/base.schema');
const { createSekolahSchema, updateSekolahSchema } = require('../../validations/sekolah.schema');

const router = express.Router();

router.get('/', validateRequest(paginationSchema, 'query'), sekolahController.list);
router.post('/', validateRequest(createSekolahSchema), sekolahController.create);
router.get('/:id', validateRequest(idParamsSchema, 'params'), sekolahController.detail);
router.put('/:id', validateRequest(idParamsSchema, 'params'), validateRequest(updateSekolahSchema), sekolahController.update);
router.delete('/:id', validateRequest(idParamsSchema, 'params'), sekolahController.remove);

module.exports = router;
