const express = require('express');
const controller = require('../../modules/perencanaan/controller');
const { authenticate, authorize } = require('../../middlewares/auth.middleware');

const router = express.Router();

// All perencanaan routes require authentication
router.use(authenticate);

// CP - Guru can read, Admin can manage
router.get('/cp', controller.getCP);
router.post('/cp', authorize('admin'), controller.createCP);
router.put('/cp/:id', authorize('admin'), controller.updateCP);
router.delete('/cp/:id', authorize('admin'), controller.deleteCP);

// TP - Guru & Admin
router.get('/tp', controller.getTP);
router.post('/tp', authorize('guru', 'admin'), controller.createTP);
router.put('/tp/:id', authorize('guru', 'admin'), controller.updateTP);
router.delete('/tp/:id', authorize('guru', 'admin'), controller.deleteTP);
router.post('/tp/generate', authorize('guru'), controller.generateTP);

// ATP - Guru & Admin
router.get('/atp', controller.getATP);
router.post('/atp/:pembelajaran_id', authorize('guru', 'admin'), controller.saveATP);

// Modul Ajar - Guru & Admin
router.get('/modul-ajar', controller.getModulAjarList);
router.get('/modul-ajar/:id', controller.getModulAjarDetail);
router.post('/modul-ajar', authorize('guru', 'admin'), controller.saveModulAjar);

module.exports = router;
