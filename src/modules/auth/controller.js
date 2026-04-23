const { successResponse } = require('../../utils/response');
const authService = require('./service');
const { logActivity } = require('../../shared/activityLog');

async function login(req, res, next) {
  try {
    const result = await authService.login(req.body.username, req.body.password);
    await logActivity({
      userId: result.user.id,
      action: 'LOGIN',
      entityType: 'user',
      entityId: result.user.id,
      description: `${result.user.username} berhasil login ke dalam sistem`
    });
    return successResponse(res, result, 'Success', 200);
  } catch (error) {
    return next(error);
  }
}

async function refresh(req, res, next) {
  try {
    const result = await authService.refresh(req.body.refresh_token);
    return successResponse(res, result, 'Success', 200);
  } catch (error) {
    return next(error);
  }
}

async function logout(req, res, next) {
  try {
    await authService.logout(req.body.refresh_token);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
  refresh,
  logout,
};
