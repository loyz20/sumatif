function successResponse(res, data = {}, message = 'Success', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

function errorResponse(res, message = 'Terjadi kesalahan', errors = null, statusCode = 400, code) {
  const payload = {
    success: false,
    message,
  };

  if (code) {
    payload.code = code;
  }

  if (errors !== undefined) {
    payload.errors = errors;
  }

  return res.status(statusCode).json(payload);
}

module.exports = {
  successResponse,
  errorResponse,
};
