const { z } = require('zod');

const loginSchema = z.object({
  username: z.string().min(3, 'Username minimal 3 karakter'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  csrf_token: z.string().optional(), // Optional, can come from header
});

// Refresh and logout don't need csrf_token in body - it comes from X-CSRF-Token header
const refreshTokenSchema = z.object({
  refresh_token: z.string().optional(), // Token comes from cookies
});

const logoutSchema = z.object({
  // Empty or minimal - token comes from cookies and CSRF from header
});

module.exports = {
  loginSchema,
  refreshTokenSchema,
  logoutSchema,
};
