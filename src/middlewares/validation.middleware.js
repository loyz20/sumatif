const { errorResponse } = require('../utils/response');
const ErrorCode = require('../constants/errorCodes');
const { validate } = require('../utils/validate');

function validateRequest(schema, source = 'body') {
  return (req, res, next) => {
    const result = validate(schema, req[source]);

    if (!result.success) {
      return errorResponse(res, 'Validasi gagal', result.errors, 400, ErrorCode.VALIDATION_ERROR);
    }

    req[source] = result.data;
    return next();
  };
}

module.exports = {
  validateRequest,
};
