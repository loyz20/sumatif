const { z } = require('zod');

const loginSchema = z.object({
  username: z.string().min(3, 'Username minimal 3 karakter'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

const refreshTokenSchema = z.object({
  refresh_token: z.string().min(1, 'Refresh token wajib diisi'),
});

const logoutSchema = refreshTokenSchema;

module.exports = {
  loginSchema,
  refreshTokenSchema,
  logoutSchema,
};
