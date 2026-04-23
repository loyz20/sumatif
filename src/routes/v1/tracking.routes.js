const express = require('express');
const { controller: trackingController } = require('../../modules/tracking');
const { validateRequest } = require('../../middlewares/validation.middleware');
const { authorize } = require('../../middlewares/authorize.middleware');
const { trackingSchema } = require('../../validations/tracking.schema');

const router = express.Router();

router.post('/', authorize('admin', 'guru', 'siswa'), validateRequest(trackingSchema), trackingController.create);

module.exports = router;