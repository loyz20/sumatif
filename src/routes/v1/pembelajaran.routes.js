const express = require('express');
const { controller: pembelajaranController } = require('../../modules/pembelajaran');
const { validateRequest } = require('../../middlewares/validation.middleware');
const { authorize } = require('../../middlewares/authorize.middleware');
const { createPembelajaranSchema, saveKomponenSchema } = require('../../validations/pembelajaran.schema');

const router = express.Router();

router.get('/', authorize('admin', 'guru', 'guru_bk'), pembelajaranController.list);
router.get('/rombel/:rombelId', authorize('admin', 'guru', 'guru_bk'), pembelajaranController.listByRombel);
router.post('/', authorize('admin'), validateRequest(createPembelajaranSchema), pembelajaranController.create);
router.put('/:id', authorize('admin'), validateRequest(createPembelajaranSchema), pembelajaranController.update);
router.delete('/:id', authorize('admin'), pembelajaranController.remove);

// Components Management
router.get('/:id/komponen', authorize('admin', 'guru', 'guru_bk'), pembelajaranController.listKomponen);
router.post('/:id/komponen', authorize('admin', 'guru'), validateRequest(saveKomponenSchema), pembelajaranController.saveKomponen);

module.exports = router;