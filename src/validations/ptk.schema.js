const { z } = require('zod');

const createPtkSchema = z.object({
  nama: z.string().min(1, 'Nama wajib diisi'),
  nip: z.string().min(1, 'NIP wajib diisi'),
  nuptk: z.string().nullish().or(z.literal('')),
  jenis_kelamin: z.enum(['L', 'P']).nullish().or(z.literal('')),
  tanggal_lahir: z.string().regex(/^(\d{4}-\d{2}-\d{2})?$/, 'Tanggal lahir tidak valid').nullish().or(z.literal('')),
  pendidikan_terakhir: z.string().nullish().or(z.literal('')),
  sekolah_id: z.string().uuid('Sekolah tidak valid').optional(),
});

const updatePtkSchema = createPtkSchema.partial();

const listPtkQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  sort: z.string().optional(),
  sortField: z.string().optional(),
  sortDirection: z.enum(['ASC', 'DESC']).optional(),
  sekolah_id: z.string().uuid('Sekolah tidak valid').optional(),
  jenis_kelamin: z.enum(['L', 'P']).optional().or(z.literal('')),
  pendidikan_terakhir: z.string().optional().or(z.literal('')),
});

const createPtkRiwayatPendidikanSchema = z.object({
  jenjang: z.string().min(1, 'Jenjang wajib diisi'),
  nama_instansi: z.string().min(1, 'Nama instansi wajib diisi'),
  tahun_lulus: z.number().int().min(1900).max(3000),
});

const createPtkRiwayatKerjaSchema = z.object({
  instansi: z.string().min(1, 'Instansi wajib diisi'),
  jabatan: z.string().min(1, 'Jabatan wajib diisi'),
  tahun_mulai: z.number().int().min(1900),
  tahun_selesai: z.number().int().optional(),
});

const importPtkSchema = z.object({
  items: z.array(createPtkSchema),
});

module.exports = {
  createPtkSchema,
  updatePtkSchema,
  listPtkQuerySchema,
  createPtkRiwayatPendidikanSchema,
  createPtkRiwayatKerjaSchema,
  importPtkSchema,
};
