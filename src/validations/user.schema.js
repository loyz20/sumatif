const { z } = require('zod');

const createUserSchema = z.object({
  sekolah_id: z.string().uuid('Sekolah tidak valid').optional(),
  username: z.string().min(3, 'Username minimal 3 karakter'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  role: z.enum(['admin', 'guru', 'siswa', 'orang_tua']),
  ref_id: z.string().uuid('Ref ID tidak valid').optional(),
});

module.exports = {
  createUserSchema,
};