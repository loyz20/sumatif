const express = require('express');
const { controller: userManagementController } = require('../../modules/userManagement');
const { validateRequest } = require('../../middlewares/validation.middleware');
const { authorize } = require('../../middlewares/authorize.middleware');
const { createUserSchema, updateUserSchema } = require('../../validations/user.schema');

const router = express.Router();

router.get('/', authorize('superadmin', 'admin'), userManagementController.list);
router.get('/stats', authorize('superadmin', 'admin'), userManagementController.stats);
router.get('/:id', authorize('superadmin', 'admin'), userManagementController.detail);
router.post('/', authorize('superadmin', 'admin'), validateRequest(createUserSchema), userManagementController.create);
router.put('/:id', authorize('superadmin', 'admin'), validateRequest(updateUserSchema), userManagementController.update);
router.delete('/:id', authorize('superadmin', 'admin'), userManagementController.remove);

module.exports = router;