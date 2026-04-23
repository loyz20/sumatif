const express = require('express');
const { controller: authController } = require('../../modules/auth');
const { validateRequest } = require('../../middlewares/validation.middleware');
const { loginSchema, refreshTokenSchema, logoutSchema } = require('../../validations/auth.schema');

const router = express.Router();

router.post('/login', validateRequest(loginSchema), authController.login);
router.post('/refresh', validateRequest(refreshTokenSchema), authController.refresh);
router.post('/logout', validateRequest(logoutSchema), authController.logout);

module.exports = router;
