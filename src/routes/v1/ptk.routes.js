const express = require('express');
const { controller: ptkController } = require('../../modules/ptk');
const { controller: ptkRiwayatController } = require('../../modules/ptkRiwayat');
const { validateRequest } = require('../../middlewares/validation.middleware');
const { idParamsSchema } = require('../../validations/base.schema');
const {
	createPtkSchema,
	updatePtkSchema,
	listPtkQuerySchema,
	createPtkRiwayatPendidikanSchema,
} = require('../../validations/ptk.schema');

const router = express.Router();

router.get('/', validateRequest(listPtkQuerySchema, 'query'), ptkController.list);
router.post('/', validateRequest(createPtkSchema), ptkController.create);
router.get('/:id', validateRequest(idParamsSchema, 'params'), ptkController.detail);
router.put('/:id', validateRequest(idParamsSchema, 'params'), validateRequest(updatePtkSchema), ptkController.update);
router.delete('/:id', validateRequest(idParamsSchema, 'params'), ptkController.remove);
router.get('/:id/riwayat-pendidikan', validateRequest(idParamsSchema, 'params'), ptkRiwayatController.listPendidikan);
router.post(
	'/:id/riwayat-pendidikan',
	validateRequest(idParamsSchema, 'params'),
	validateRequest(createPtkRiwayatPendidikanSchema),
	ptkRiwayatController.createPendidikan
);
router.get('/:id/riwayat-kepangkatan', validateRequest(idParamsSchema, 'params'), ptkRiwayatController.listKepangkatan);

module.exports = router;
