const express = require('express');
const { controller: tahunAjaranController } = require('../../modules/tahunAjaran');
const { validateRequest } = require('../../middlewares/validation.middleware');
const { authorize } = require('../../middlewares/authorize.middleware');
const { createTahunAjaranSchema, listTahunAjaranQuerySchema } = require('../../validations/tahunAjaran.schema');

const router = express.Router();

router.get('/', authorize('admin', 'guru'), validateRequest(listTahunAjaranQuerySchema, 'query'), tahunAjaranController.list);
router.post('/', authorize('admin'), validateRequest(createTahunAjaranSchema), tahunAjaranController.create);
router.put('/:id', authorize('admin'), validateRequest(createTahunAjaranSchema), tahunAjaranController.update);
router.delete('/:id', authorize('admin'), tahunAjaranController.remove);

module.exports = router;