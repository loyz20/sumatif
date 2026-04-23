const { successResponse } = require('../../utils/response');
const trackingService = require('./service');

async function create(req, res, next) {
  try {
    const result = await trackingService.create(req.body);
    return successResponse(res, result, 'Success', 201);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  create,
};
