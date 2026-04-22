const { z } = require('zod');

const createPtkSchema = z.object({
  nama: z.string().min(1, 'Nama wajib diisi'),
  nik: z.string().length(16, 'NIK harus 16 digit'),
  nip: z.string().optional(),
  nuptk: z.string().optional(),
  jenis_kelamin: z.enum(['L', 'P']),
  tanggal_lahir: z.string(),
  sekolah_id: z.string().uuid('Sekolah tidak valid'),
});

const updatePtkSchema = createPtkSchema.partial();

const listPtkQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  sort: z.string().optional(),
  sekolah_id: z.string().uuid('Sekolah tidak valid').optional(),
});

module.exports = {
  createPtkSchema,
  updatePtkSchema,
  listPtkQuerySchema,
};
