const { errorResponse } = require('../utils/response');
const ErrorCode = require('../constants/errorCodes');

/**
 * Middleware to enforce multi-tenancy by injecting sekolah_id from authenticated user
 * into req.query and req.body. This ensures that downstream services/models
 * will filter data based on the user's school affiliation.
 */
function tenantMiddleware(req, res, next) {
  if (!req.user) {
    return errorResponse(res, 'Authentication required', null, 401, ErrorCode.UNAUTHORIZED);
  }

  // Superadmin bypasses automatic filtering (they can see all or specify a school)
  if (req.user.role === 'superadmin') {
    return next();
  }

  // Enforce sekolah_id for all other roles
  if (!req.user.sekolah_id) {
    return errorResponse(res, 'Akses ditolak: Afiliasi sekolah tidak ditemukan', null, 403, ErrorCode.FORBIDDEN);
  }

  // Inject sekolah_id into query and body
  // This overrides any sekolah_id sent by the client to prevent cross-tenant access
  req.query.sekolah_id = req.user.sekolah_id;

  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    // If body exists, inject sekolah_id
    if (req.body) {
      req.body.sekolah_id = req.user.sekolah_id;
    }
  }

  next();
}

module.exports = {
  tenantMiddleware,
};
