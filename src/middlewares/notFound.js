const { errorResponse } = require('../utils/response');
const ErrorCode = require('../constants/errorCodes');

function notFound(req, res) {
  return errorResponse(res, 'Data tidak ditemukan', null, 404, ErrorCode.NOT_FOUND);
}

module.exports = notFound;
