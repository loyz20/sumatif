const express = require('express');
const { controller: mataPelajaranController } = require('../../modules/mataPelajaran');
const { validateRequest } = require('../../middlewares/validation.middleware');
const { authorize } = require('../../middlewares/authorize.middleware');
const { createMataPelajaranSchema, listMataPelajaranQuerySchema } = require('../../validations/mataPelajaran.schema');

const router = express.Router();

router.get('/', authorize('admin', 'guru'), validateRequest(listMataPelajaranQuerySchema, 'query'), mataPelajaranController.list);
router.post('/', authorize('admin'), validateRequest(createMataPelajaranSchema), mataPelajaranController.create);
router.put('/:id', authorize('admin'), validateRequest(createMataPelajaranSchema), mataPelajaranController.update);
router.delete('/:id', authorize('admin'), mataPelajaranController.remove);

module.exports = router;