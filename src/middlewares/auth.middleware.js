const { verifyAccessToken } = require('../utils/token');
const { errorResponse } = require('../utils/response');
const ErrorCode = require('../constants/errorCodes');

/**
 * Middleware that verifies JWT access token from the Authorization header.
 * On success, attaches decoded payload to req.user with:
 *   - id (from sub)
 *   - role
 *   - sekolah_id
 *   - jti
 */
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return errorResponse(res, 'Token tidak ditemukan', null, 401, ErrorCode.UNAUTHORIZED);
  }

  const token = authHeader.slice(7);

  try {
    const decoded = verifyAccessToken(token);

    req.user = {
      id: decoded.sub,
      role: decoded.role,
      sekolah_id: decoded.sekolah_id,
      jti: decoded.jti,
    };

    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 'Token sudah kadaluarsa', null, 401, ErrorCode.TOKEN_EXPIRED);
    }

    return errorResponse(res, 'Token tidak valid', null, 401, ErrorCode.TOKEN_INVALID);
  }
}

module.exports = {
  authenticate,
};
