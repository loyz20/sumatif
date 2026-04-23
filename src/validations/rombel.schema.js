const { z } = require('zod');

const createRombelSchema = z.object({
  nama: z.string().min(1, 'Nama wajib diisi'),
  tingkat: z.number().min(1).max(12),
  sekolah_id: z.string().uuid('Sekolah tidak valid'),
  tahun_ajaran_id: z.string().uuid('Tahun ajaran tidak valid'),
  wali_kelas_ptk_id: z.string().uuid('Wali kelas tidak valid'),
});

const updateRombelSchema = createRombelSchema.partial();

const listRombelQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  sort: z.string().optional(),
  tahun_ajaran_id: z.string().uuid('Tahun ajaran tidak valid').optional(),
});

const addAnggotaRombelSchema = z.object({
  peserta_didik_id: z.string().uuid('Peserta didik tidak valid'),
});

module.exports = {
  createRombelSchema,
  updateRombelSchema,
  listRombelQuerySchema,
  addAnggotaRombelSchema,
};
