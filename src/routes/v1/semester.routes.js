const express = require('express');
const { controller: semesterController } = require('../../modules/semester');
const { validateRequest } = require('../../middlewares/validation.middleware');
const { authorize } = require('../../middlewares/authorize.middleware');
const { listSemesterQuerySchema, createSemesterSchema } = require('../../validations/semester.schema');

const router = express.Router();

router.get('/', authorize('admin', 'guru'), validateRequest(listSemesterQuerySchema, 'query'), semesterController.list);
router.post('/', authorize('admin'), validateRequest(createSemesterSchema), semesterController.create);
router.put('/:id', authorize('admin'), validateRequest(createSemesterSchema), semesterController.update);
router.delete('/:id', authorize('admin'), semesterController.remove);

module.exports = router;