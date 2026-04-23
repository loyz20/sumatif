const express = require('express');
const { controller: userManagementController } = require('../../modules/userManagement');
const { validateRequest } = require('../../middlewares/validation.middleware');
const { createUserSchema } = require('../../validations/user.schema');

const router = express.Router();

router.post('/', validateRequest(createUserSchema), userManagementController.create);

module.exports = router;