const { z } = require('zod');

const createUserSchema = z.object({
  sekolah_id: z.string().uuid('Sekolah tidak valid').nullable().optional(),
  username: z.string().min(3, 'Username minimal 3 karakter'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  role: z.enum(['superadmin', 'admin', 'guru', 'guru_bk', 'siswa', 'orang_tua']),
  ref_id: z.string().uuid('Ref ID tidak valid').nullable().optional(),
});

const updateUserSchema = z.object({
  sekolah_id: z.string().uuid('Sekolah tidak valid').nullable().optional(),
  username: z.string().min(3, 'Username minimal 3 karakter').optional(),
  password: z.string().min(6, 'Password minimal 6 karakter').optional(),
  role: z.enum(['superadmin', 'admin', 'guru', 'guru_bk', 'siswa', 'orang_tua']).optional(),
  ref_id: z.string().uuid('Ref ID tidak valid').nullable().optional(),
});

module.exports = {
  createUserSchema,
  updateUserSchema,
};