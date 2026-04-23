const express = require('express');
const { controller: semesterController } = require('../../modules/semester');
const { validateRequest } = require('../../middlewares/validation.middleware');
const { listSemesterQuerySchema } = require('../../validations/semester.schema');

const router = express.Router();

router.get('/', validateRequest(listSemesterQuerySchema, 'query'), semesterController.list);

module.exports = router;