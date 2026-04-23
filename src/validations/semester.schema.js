const { z } = require('zod');

const listSemesterQuerySchema = z.object({
  tahun_ajaran_id: z.string().uuid('Tahun ajaran tidak valid').optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  sort: z.string().optional(),
});

const createSemesterSchema = z.object({
  tahun_ajaran_id: z.string().uuid('Tahun ajaran tidak valid'),
  nama: z.string().min(1, 'Nama semester wajib diisi'),
  aktif: z.boolean().optional(),
});

module.exports = {
  listSemesterQuerySchema,
  createSemesterSchema,
};