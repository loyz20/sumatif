const { z } = require('zod');

const createSiswaSchema = z.object({
  nama: z.string().min(1, 'Nama wajib diisi'),
  nis: z.string().min(1, 'NIS wajib diisi'),
  nisn: z.string().nullish().or(z.literal('')),
  nik: z.string().regex(/^(\d{16})?$/, 'NIK harus 16 digit').nullish().or(z.literal('')),
  jenis_kelamin: z.enum(['L', 'P']).nullish().or(z.literal('')),
  tanggal_lahir: z.string().regex(/^(\d{4}-\d{2}-\d{2})?$/, 'Tanggal lahir tidak valid').nullish().or(z.literal('')),
  sekolah_id: z.string().uuid('Sekolah tidak valid'),
  nama_ayah: z.string().optional(),
  nama_ibu: z.string().optional(),
  rombel_id: z.string().uuid('Rombel tidak valid').nullish().or(z.literal('')),
});

const updateSiswaSchema = createSiswaSchema.partial();

const listSiswaQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  sort: z.string().optional(),
  sekolah_id: z.string().uuid('Sekolah tidak valid').optional(),
});

module.exports = {
  createSiswaSchema,
  updateSiswaSchema,
  listSiswaQuerySchema,
};
