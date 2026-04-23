const { z } = require('zod');

const createPtkSchema = z.object({
  nama: z.string().min(1, 'Nama wajib diisi'),
  nik: z.string().length(16, 'NIK harus 16 digit'),
  nip: z.string().min(1, 'NIP wajib diisi'),
  nuptk: z.string().min(1, 'NUPTK wajib diisi'),
  jenis_kelamin: z.enum(['L', 'P']),
  tanggal_lahir: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Tanggal lahir tidak valid'),
  pendidikan_terakhir: z.string().min(1, 'Pendidikan terakhir wajib diisi'),
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

const createPtkRiwayatPendidikanSchema = z.object({
  jenjang: z.string().min(1, 'Jenjang wajib diisi'),
  nama_instansi: z.string().min(1, 'Nama instansi wajib diisi'),
  tahun_lulus: z.number().int().min(1900).max(3000),
});

module.exports = {
  createPtkSchema,
  updatePtkSchema,
  listPtkQuerySchema,
  createPtkRiwayatPendidikanSchema,
};
