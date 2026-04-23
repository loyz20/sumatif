const { successResponse } = require('../../utils/response');
const registrasiService = require('./service');

async function create(req, res, next) {
  try {
    const result = await registrasiService.create(req.body);
    return successResponse(res, result, 'Success', 201);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  create,
};
