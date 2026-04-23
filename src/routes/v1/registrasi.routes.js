const express = require('express');
const { controller: registrasiController } = require('../../modules/registrasi');
const { validateRequest } = require('../../middlewares/validation.middleware');
const { createRegistrasiSchema } = require('../../validations/registrasi.schema');

const router = express.Router();

router.post('/', validateRequest(createRegistrasiSchema), registrasiController.create);

module.exports = router;