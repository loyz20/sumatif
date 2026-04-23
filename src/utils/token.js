const crypto = require('crypto');
const jwt = require('jsonwebtoken');

function getJwtConfig() {
  const accessSecret = process.env.JWT_ACCESS_SECRET;
  const refreshSecret = process.env.JWT_REFRESH_SECRET;

  if (!accessSecret || !refreshSecret) {
    throw new Error('JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be set in environment variables');
  }

  return {
    accessSecret,
    refreshSecret,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  };
}

function signAccessToken(user) {
  const { accessSecret, accessExpiresIn } = getJwtConfig();

  return jwt.sign(
    {
      jti: crypto.randomUUID(),
      sub: user.id,
      role: user.role,
      sekolah_id: user.sekolah_id,
    },
    accessSecret,
    { expiresIn: accessExpiresIn }
  );
}

function signRefreshToken(user) {
  const { refreshSecret, refreshExpiresIn } = getJwtConfig();

  return jwt.sign(
    {
      jti: crypto.randomUUID(),
      sub: user.id,
      role: user.role,
    },
    refreshSecret,
    { expiresIn: refreshExpiresIn }
  );
}

function verifyAccessToken(token) {
  const { accessSecret } = getJwtConfig();
  return jwt.verify(token, accessSecret);
}

function verifyRefreshToken(token) {
  const { refreshSecret } = getJwtConfig();
  return jwt.verify(token, refreshSecret);
}

function decodeToken(token) {
  return jwt.decode(token);
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  decodeToken,
};
