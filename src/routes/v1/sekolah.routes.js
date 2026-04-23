const express = require('express');
const { controller: sekolahController } = require('../../modules/sekolah');
const { validateRequest } = require('../../middlewares/validation.middleware');
const { authorize } = require('../../middlewares/authorize.middleware');
const { idParamsSchema, paginationSchema } = require('../../validations/base.schema');
const { createSekolahSchema, updateSekolahSchema } = require('../../validations/sekolah.schema');

const router = express.Router();

router.get('/', authorize('superadmin'), validateRequest(paginationSchema, 'query'), sekolahController.list);
router.post('/', authorize('superadmin'), validateRequest(createSekolahSchema), sekolahController.create);
router.get('/:id', authorize('superadmin', 'admin', 'guru'), validateRequest(idParamsSchema, 'params'), sekolahController.detail);
router.put('/:id', authorize('superadmin'), validateRequest(idParamsSchema, 'params'), validateRequest(updateSekolahSchema), sekolahController.update);
router.delete('/:id', authorize('superadmin'), validateRequest(idParamsSchema, 'params'), sekolahController.remove);

module.exports = router;
