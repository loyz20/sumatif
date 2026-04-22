const express = require('express');
const ptkController = require('../../controllers/ptk.controller');
const { validateRequest } = require('../../middlewares/validation.middleware');
const { idParamsSchema } = require('../../validations/base.schema');
const { createPtkSchema, updatePtkSchema, listPtkQuerySchema } = require('../../validations/ptk.schema');

const router = express.Router();

router.get('/', validateRequest(listPtkQuerySchema, 'query'), ptkController.list);
router.post('/', validateRequest(createPtkSchema), ptkController.create);
router.get('/:id', validateRequest(idParamsSchema, 'params'), ptkController.detail);
router.put('/:id', validateRequest(idParamsSchema, 'params'), validateRequest(updatePtkSchema), ptkController.update);
router.delete('/:id', validateRequest(idParamsSchema, 'params'), ptkController.remove);

module.exports = router;
