const { z } = require('zod');

const idSchema = z.string().uuid('ID tidak valid');
const idParamsSchema = z.object({
  id: idSchema,
});

const paginationSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  sort: z.string().optional(),
});

module.exports = {
  idSchema,
  idParamsSchema,
  paginationSchema,
};
