const ErrorCode = require('../../constants/errorCodes');
const authModel = require('./model');
const { createError } = require('../shared/service');
const { verifyPassword } = require('../../utils/password');
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  decodeToken,
} = require('../../utils/token');

function getRefreshExpiresAt(refreshToken) {
  const decoded = decodeToken(refreshToken);
  if (!decoded || typeof decoded !== 'object' || !decoded.exp) {
    return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  }

  return new Date(decoded.exp * 1000);
}

async function login(username, password) {
  const user = await authModel.findUserByUsername(username);

  if (!user) {
    throw createError('Username atau password salah', 401, ErrorCode.INVALID_CREDENTIALS);
  }

  const isValidPassword = verifyPassword(password, user.password);
  if (!isValidPassword) {
    throw createError('Username atau password salah', 401, ErrorCode.INVALID_CREDENTIALS);
  }

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  const refreshExpiresAt = getRefreshExpiresAt(refreshToken);

  await authModel.createRefreshToken({
    userId: user.id,
    token: refreshToken,
    expiresAt: refreshExpiresAt,
  });

  return {
    access_token: accessToken,
    refresh_token: refreshToken,
    user: {
      id: user.id,
      role: user.role,
    },
  };
}

async function refresh(refreshToken) {
  let payload;

  try {
    payload = verifyRefreshToken(refreshToken);
  } catch (error) {
    throw createError('Token tidak valid atau expired', 401, ErrorCode.TOKEN_INVALID);
  }

  const storedToken = await authModel.findRefreshToken(refreshToken);
  if (!storedToken || storedToken.revoked_at) {
    throw createError('Token tidak valid atau expired', 401, ErrorCode.TOKEN_INVALID);
  }

  const user = await authModel.findUserById(payload.sub);
  if (!user) {
    throw createError('Token tidak valid atau expired', 401, ErrorCode.TOKEN_INVALID);
  }

  const newAccessToken = signAccessToken(user);
  const newRefreshToken = signRefreshToken(user);
  const refreshExpiresAt = getRefreshExpiresAt(newRefreshToken);

  await authModel.revokeRefreshToken(refreshToken);
  await authModel.createRefreshToken({
    userId: user.id,
    token: newRefreshToken,
    expiresAt: refreshExpiresAt,
  });

  return {
    access_token: newAccessToken,
    refresh_token: newRefreshToken,
    user: {
      id: user.id,
      role: user.role,
    },
  };
}

async function logout(refreshToken) {
  if (!refreshToken) {
    throw createError('Token tidak valid atau expired', 401, ErrorCode.TOKEN_INVALID);
  }

  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch (error) {
    throw createError('Token tidak valid atau expired', 401, ErrorCode.TOKEN_INVALID);
  }

  const storedToken = await authModel.findRefreshToken(refreshToken);
  if (!storedToken || storedToken.revoked_at) {
    throw createError('Token tidak valid atau expired', 401, ErrorCode.TOKEN_INVALID);
  }

  await authModel.revokeAllRefreshTokensByUserId(payload.sub);
  return true;
}

module.exports = {
  login,
  refresh,
  logout,
};
