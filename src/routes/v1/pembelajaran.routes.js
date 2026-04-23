const express = require('express');
const { controller: pembelajaranController } = require('../../modules/pembelajaran');
const { validateRequest } = require('../../middlewares/validation.middleware');
const { authorize } = require('../../middlewares/authorize.middleware');
const { createPembelajaranSchema } = require('../../validations/pembelajaran.schema');

const router = express.Router();

router.get('/rombel/:rombelId', authorize('admin', 'guru'), pembelajaranController.listByRombel);
router.post('/', authorize('admin'), validateRequest(createPembelajaranSchema), pembelajaranController.create);
router.put('/:id', authorize('admin'), validateRequest(createPembelajaranSchema), pembelajaranController.update);
router.delete('/:id', authorize('admin'), pembelajaranController.remove);

module.exports = router;