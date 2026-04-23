const express = require('express');
const { controller: tahunAjaranController } = require('../../modules/tahunAjaran');
const { validateRequest } = require('../../middlewares/validation.middleware');
const { authorize } = require('../../middlewares/authorize.middleware');
const { createTahunAjaranSchema, listTahunAjaranQuerySchema } = require('../../validations/tahunAjaran.schema');

const router = express.Router();

router.get('/', authorize('admin', 'guru'), validateRequest(listTahunAjaranQuerySchema, 'query'), tahunAjaranController.list);
router.post('/', authorize('admin'), validateRequest(createTahunAjaranSchema), tahunAjaranController.create);

module.exports = router;