const { z } = require('zod');

const createTahunAjaranSchema = z.object({
  sekolah_id: z.string().uuid('Sekolah tidak valid'),
  tahun: z.string().regex(/^\d{4}\/\d{4}$/, 'Tahun ajaran tidak valid'),
  aktif: z.boolean().optional(),
});

const listTahunAjaranQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  sort: z.string().optional(),
  sekolah_id: z.string().uuid('Sekolah tidak valid').optional(),
});

module.exports = {
  createTahunAjaranSchema,
  listTahunAjaranQuerySchema,
};