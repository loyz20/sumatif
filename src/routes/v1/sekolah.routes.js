const express = require('express');
const { controller: sekolahController } = require('../../modules/sekolah');
const { validateRequest } = require('../../middlewares/validation.middleware');
const { authorize } = require('../../middlewares/authorize.middleware');
const { uploadLogo } = require('../../middlewares/upload.middleware');
const { idParamsSchema, paginationSchema } = require('../../validations/base.schema');
const { createSekolahSchema, updateSekolahSchema } = require('../../validations/sekolah.schema');

const router = express.Router();

router.get('/stats', authorize('superadmin'), sekolahController.stats);
router.get('/', authorize('superadmin'), validateRequest(paginationSchema, 'query'), sekolahController.list);
router.post('/', authorize('superadmin'), validateRequest(createSekolahSchema), sekolahController.create);
router.get('/:id', authorize('superadmin', 'admin', 'guru', 'guru_bk'), validateRequest(idParamsSchema, 'params'), sekolahController.detail);
router.put('/:id', authorize('superadmin', 'admin'), validateRequest(idParamsSchema, 'params'), validateRequest(updateSekolahSchema), sekolahController.update);
router.post('/:id/logo', authorize('superadmin', 'admin'), validateRequest(idParamsSchema, 'params'), uploadLogo.single('logo'), sekolahController.uploadLogo);
router.delete('/:id', authorize('superadmin'), validateRequest(idParamsSchema, 'params'), sekolahController.remove);

module.exports = router;
