const express = require('express');
const { controller: mataPelajaranController } = require('../../modules/mataPelajaran');
const { validateRequest } = require('../../middlewares/validation.middleware');
const { authorize } = require('../../middlewares/authorize.middleware');
const { createMataPelajaranSchema, listMataPelajaranQuerySchema } = require('../../validations/mataPelajaran.schema');

const router = express.Router();

router.get('/', authorize('admin', 'guru'), validateRequest(listMataPelajaranQuerySchema, 'query'), mataPelajaranController.list);
router.post('/', authorize('admin'), validateRequest(createMataPelajaranSchema), mataPelajaranController.create);

module.exports = router;