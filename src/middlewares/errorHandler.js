const { errorResponse } = require('../utils/response');
const ErrorCode = require('../constants/errorCodes');

function resolveErrorCode(statusCode, errorCode) {
  if (errorCode) {
    return errorCode;
  }

  switch (statusCode) {
    case 400:
      return ErrorCode.VALIDATION_ERROR;
    case 401:
      return ErrorCode.UNAUTHORIZED;
    case 403:
      return ErrorCode.FORBIDDEN;
    case 404:
      return ErrorCode.NOT_FOUND;
    case 409:
      return ErrorCode.DUPLICATE_DATA;
    case 422:
      return ErrorCode.BUSINESS_RULE;
    default:
      return ErrorCode.INTERNAL_ERROR;
  }
}

function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  const statusCode = error.statusCode || error.status || 500;
  const code = resolveErrorCode(statusCode, error.code);
  const message = statusCode === 500 ? 'Terjadi kesalahan pada server' : (error.message || 'Terjadi kesalahan');
  const errors = error.errors ?? null;

  // Log server errors for debugging visibility
  if (statusCode >= 500) {
    console.error(`[ERROR] ${req.method} ${req.originalUrl}`, error);
  }

  return errorResponse(res, message, errors, statusCode, code);
}

module.exports = errorHandler;
