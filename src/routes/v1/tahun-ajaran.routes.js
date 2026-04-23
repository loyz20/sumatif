const express = require('express');
const { controller: tahunAjaranController } = require('../../modules/tahunAjaran');
const { validateRequest } = require('../../middlewares/validation.middleware');
const { createTahunAjaranSchema, listTahunAjaranQuerySchema } = require('../../validations/tahunAjaran.schema');

const router = express.Router();

router.get('/', validateRequest(listTahunAjaranQuerySchema, 'query'), tahunAjaranController.list);
router.post('/', validateRequest(createTahunAjaranSchema), tahunAjaranController.create);

module.exports = router;