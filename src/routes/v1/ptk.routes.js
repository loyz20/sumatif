const express = require('express');
const { controller: ptkController } = require('../../modules/ptk');
const { controller: ptkRiwayatController } = require('../../modules/ptkRiwayat');
const { validateRequest } = require('../../middlewares/validation.middleware');
const { authorize } = require('../../middlewares/authorize.middleware');
const { idParamsSchema } = require('../../validations/base.schema');
const {
	createPtkSchema,
	updatePtkSchema,
	listPtkQuerySchema,
	createPtkRiwayatPendidikanSchema,
} = require('../../validations/ptk.schema');

const router = express.Router();

router.get('/', authorize('admin', 'guru'), validateRequest(listPtkQuerySchema, 'query'), ptkController.list);
router.post('/', authorize('admin'), validateRequest(createPtkSchema), ptkController.create);
router.get('/:id', authorize('admin', 'guru'), validateRequest(idParamsSchema, 'params'), ptkController.detail);
router.put('/:id', authorize('admin'), validateRequest(idParamsSchema, 'params'), validateRequest(updatePtkSchema), ptkController.update);
router.delete('/:id', authorize('admin'), validateRequest(idParamsSchema, 'params'), ptkController.remove);
router.get('/:id/riwayat-pendidikan', authorize('admin', 'guru'), validateRequest(idParamsSchema, 'params'), ptkRiwayatController.listPendidikan);
router.post(
	'/:id/riwayat-pendidikan',
	authorize('admin'),
	validateRequest(idParamsSchema, 'params'),
	validateRequest(createPtkRiwayatPendidikanSchema),
	ptkRiwayatController.createPendidikan
);
router.get('/:id/riwayat-kepangkatan', authorize('admin', 'guru'), validateRequest(idParamsSchema, 'params'), ptkRiwayatController.listKepangkatan);

module.exports = router;
