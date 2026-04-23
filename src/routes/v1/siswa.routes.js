const express = require('express');
const { controller: siswaController } = require('../../modules/siswa');
const { validateRequest } = require('../../middlewares/validation.middleware');
const { idParamsSchema } = require('../../validations/base.schema');
const { createSiswaSchema, updateSiswaSchema, listSiswaQuerySchema } = require('../../validations/siswa.schema');

const router = express.Router();

router.get('/', validateRequest(listSiswaQuerySchema, 'query'), siswaController.list);
router.post('/', validateRequest(createSiswaSchema), siswaController.create);
router.get('/:id', validateRequest(idParamsSchema, 'params'), siswaController.detail);
router.put('/:id', validateRequest(idParamsSchema, 'params'), validateRequest(updateSiswaSchema), siswaController.update);
router.delete('/:id', validateRequest(idParamsSchema, 'params'), siswaController.remove);

module.exports = router;