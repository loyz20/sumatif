const dashboardService = require('./service');
const { successResponse } = require('../../utils/response');

const getSummary = async (req, res, next) => {
  try {
    // req.user diset oleh middleware autentikasi
    const summary = await dashboardService.getDashboardSummary(req.user);
    return successResponse(res, summary);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSummary
};
