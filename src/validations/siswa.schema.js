const { z } = require('zod');

const createSiswaSchema = z.object({
  nama: z.string().min(1, 'Nama wajib diisi'),
  nisn: z.string().min(5, 'NISN tidak valid'),
  nik: z.string().length(16, 'NIK harus 16 digit'),
  jenis_kelamin: z.enum(['L', 'P']),
  tanggal_lahir: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Tanggal lahir tidak valid'),
  sekolah_id: z.string().uuid('Sekolah tidak valid'),
  nama_ayah: z.string().optional(),
  nama_ibu: z.string().optional(),
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
