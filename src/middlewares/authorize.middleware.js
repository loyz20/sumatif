const { errorResponse } = require('../utils/response');
const ErrorCode = require('../constants/errorCodes');

/**
 * Middleware that checks if the authenticated user has one of the allowed roles.
 * Must be used AFTER the authenticate middleware (requires req.user).
 *
 * @param  {...string} allowedRoles - Roles permitted to access the route
 * @returns {Function} Express middleware
 *
 * Usage:
 *   router.post('/', authenticate, authorize('admin'), controller.create);
 *   router.get('/', authenticate, authorize('admin', 'guru'), controller.list);
 */
function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Token tidak ditemukan', null, 401, ErrorCode.UNAUTHORIZED);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return errorResponse(
        res,
        'Anda tidak memiliki akses untuk melakukan aksi ini',
        null,
        403,
        ErrorCode.FORBIDDEN
      );
    }

    return next();
  };
}

module.exports = {
  authorize,
};
