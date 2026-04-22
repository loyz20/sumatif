const { z } = require('zod');

const createRombelSchema = z.object({
  nama: z.string().min(1, 'Nama wajib diisi'),
  tingkat: z.number().min(1).max(12),
  sekolah_id: z.string().uuid('Sekolah tidak valid'),
  tahun_ajaran_id: z.string().uuid('Tahun ajaran tidak valid'),
  wali_kelas_ptk_id: z.string().uuid('Wali kelas tidak valid'),
});

const updateRombelSchema = createRombelSchema.partial();

module.exports = {
  createRombelSchema,
  updateRombelSchema,
};
