const express = require('express');
const { controller: pembelajaranController } = require('../../modules/pembelajaran');
const { validateRequest } = require('../../middlewares/validation.middleware');
const { createPembelajaranSchema } = require('../../validations/pembelajaran.schema');

const router = express.Router();

router.post('/', validateRequest(createPembelajaranSchema), pembelajaranController.create);

module.exports = router;