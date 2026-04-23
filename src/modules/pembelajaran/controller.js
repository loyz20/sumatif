const { successResponse } = require('../../utils/response');
const pembelajaranService = require('./service');

async function create(req, res, next) {
  try {
    const result = await pembelajaranService.create(req.body);
    return successResponse(res, result, 'Success', 201);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  create,
};
