const express = require('express');
const { controller: authController } = require('../../modules/auth');
const { validateRequest } = require('../../middlewares/validation.middleware');
const { validateCsrf } = require('../../middlewares/csrf.middleware');
const { loginSchema, refreshTokenSchema, logoutSchema } = require('../../validations/auth.schema');

const { authenticate } = require('../../middlewares/auth.middleware');

const router = express.Router();

// CSRF token endpoint - no auth required
router.get('/csrf-token', authController.getCsrfToken);

// Login - no CSRF required (public endpoint, no existing token yet)
router.post('/login', validateRequest(loginSchema), authController.login);

// Refresh - with CSRF validation
router.post('/refresh', validateCsrf, validateRequest(refreshTokenSchema), authController.refresh);

// Logout - with CSRF validation
router.post('/logout', validateCsrf, validateRequest(logoutSchema), authController.logout);

// Session management
router.get('/sessions', authenticate, authController.getSessions);
router.delete('/sessions/:id', authenticate, authController.revokeSession);

// Profile management
router.get('/me', authenticate, authController.getProfile);
router.put('/me', authenticate, authController.updateProfile);
router.post('/change-password', authenticate, authController.changePassword);

module.exports = router;
