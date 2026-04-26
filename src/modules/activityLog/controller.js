const { successResponse } = require('../../utils/response');
const activityLogModel = require('./model');

async function list(req, res, next) {
  try {
    const { limit = 100, page = 1, search = '' } = req.query;
    const offset = (page - 1) * limit;
    const result = await activityLogModel.listLogs(req.user.sekolah_id, limit, offset, search);
    return successResponse(res, result);
  } catch (error) {
    return next(error);
  }
}

async function stats(req, res, next) {
  try {
    const result = await activityLogModel.getLogStats(req.user.sekolah_id);
    return successResponse(res, result);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  list,
  stats,
};
