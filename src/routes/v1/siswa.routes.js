const express = require('express');
const { controller: siswaController } = require('../../modules/siswa');
const { validateRequest } = require('../../middlewares/validation.middleware');
const { authorize } = require('../../middlewares/authorize.middleware');
const { idParamsSchema } = require('../../validations/base.schema');
const { createSiswaSchema, updateSiswaSchema, listSiswaQuerySchema } = require('../../validations/siswa.schema');

const router = express.Router();

router.get('/', authorize('admin', 'guru'), validateRequest(listSiswaQuerySchema, 'query'), siswaController.list);
router.post('/', authorize('admin', 'guru'), validateRequest(createSiswaSchema), siswaController.create);
router.get('/:id', authorize('admin', 'guru'), validateRequest(idParamsSchema, 'params'), siswaController.detail);
router.put('/:id', authorize('admin', 'guru'), validateRequest(idParamsSchema, 'params'), validateRequest(updateSiswaSchema), siswaController.update);
router.delete('/:id', authorize('admin'), validateRequest(idParamsSchema, 'params'), siswaController.remove);

module.exports = router;