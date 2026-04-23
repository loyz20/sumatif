const { z } = require('zod');

const createMataPelajaranSchema = z.object({
  nama: z.string().min(1, 'Nama wajib diisi'),
  kode: z.string().min(1, 'Kode wajib diisi'),
});

const listMataPelajaranQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  sort: z.string().optional(),
});

module.exports = {
  createMataPelajaranSchema,
  listMataPelajaranQuerySchema,
};