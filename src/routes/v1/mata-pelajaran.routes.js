const express = require('express');
const { controller: mataPelajaranController } = require('../../modules/mataPelajaran');
const { validateRequest } = require('../../middlewares/validation.middleware');
const { createMataPelajaranSchema, listMataPelajaranQuerySchema } = require('../../validations/mataPelajaran.schema');

const router = express.Router();

router.get('/', validateRequest(listMataPelajaranQuerySchema, 'query'), mataPelajaranController.list);
router.post('/', validateRequest(createMataPelajaranSchema), mataPelajaranController.create);

module.exports = router;