const express = require('express');
const { controller: sumatifController } = require('../../modules/nilaiSumatif');
const { validateRequest } = require('../../middlewares/validation.middleware');
const { authorize } = require('../../middlewares/authorize.middleware');
const { createNilaiSumatifSchema } = require('../../validations/sumatif.schema');

const router = express.Router();

router.get('/report', authorize('admin', 'guru'), sumatifController.getReport);
router.post('/', authorize('admin', 'guru'), validateRequest(createNilaiSumatifSchema), sumatifController.create);
router.get('/:id', authorize('admin', 'guru'), sumatifController.getDetail);

module.exports = router;
