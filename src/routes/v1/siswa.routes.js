const express = require('express');
const { controller: siswaController } = require('../../modules/siswa');
const { validateRequest } = require('../../middlewares/validation.middleware');
const { authorize } = require('../../middlewares/authorize.middleware');
const { idParamsSchema } = require('../../validations/base.schema');
const { createSiswaSchema, updateSiswaSchema, listSiswaQuerySchema, importSiswaSchema } = require('../../validations/siswa.schema');

const router = express.Router();

router.get('/stats', authorize('admin', 'guru', 'guru_bk'), siswaController.stats);
router.get('/', authorize('admin', 'guru', 'guru_bk'), validateRequest(listSiswaQuerySchema, 'query'), siswaController.list);
router.post('/import', authorize('admin', 'guru', 'guru_bk'), validateRequest(importSiswaSchema), siswaController.importData);
router.post('/', authorize('admin', 'guru', 'guru_bk'), validateRequest(createSiswaSchema), siswaController.create);
router.get('/:id', authorize('admin', 'guru', 'guru_bk'), validateRequest(idParamsSchema, 'params'), siswaController.detail);
router.put('/:id', authorize('admin', 'guru', 'guru_bk'), validateRequest(idParamsSchema, 'params'), validateRequest(updateSiswaSchema), siswaController.update);
router.delete('/:id', authorize('admin'), validateRequest(idParamsSchema, 'params'), siswaController.remove);

module.exports = router;