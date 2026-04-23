const { z } = require('zod');

const listSemesterQuerySchema = z.object({
  tahun_ajaran_id: z.string().uuid('Tahun ajaran tidak valid').optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  sort: z.string().optional(),
});

module.exports = {
  listSemesterQuerySchema,
};