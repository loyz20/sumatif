const { successResponse } = require('../../utils/response');
const semesterService = require('./service');

async function list(req, res, next) {
  try {
    const result = await semesterService.list(req.query);
    return successResponse(res, result);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  list,
};
