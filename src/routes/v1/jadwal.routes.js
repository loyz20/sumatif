const express = require('express');
const { controller: jadwalController } = require('../../modules/jadwal');
const { authenticate } = require('../../middlewares/auth.middleware');
const { authorize } = require('../../middlewares/authorize.middleware');

const router = express.Router();

// Publicly readable for authenticated users (Siswa/Guru/Admin can all see schedule)
router.get('/', authenticate, jadwalController.list);

// CUD only for Admin and Guru
router.post('/', authenticate, authorize('admin', 'guru'), jadwalController.create);
router.put('/:id', authenticate, authorize('admin', 'guru'), jadwalController.update);
router.delete('/:id', authenticate, authorize('admin', 'guru'), jadwalController.remove);

module.exports = router;
