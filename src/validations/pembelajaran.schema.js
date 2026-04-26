const { z } = require('zod');

const createPembelajaranSchema = z.object({
  rombel_id: z.string().uuid('Rombel tidak valid'),
  mata_pelajaran_id: z.string().uuid('Mata pelajaran tidak valid'),
  ptk_id: z.string().uuid('PTK tidak valid'),
  jam_per_minggu: z.number().min(1, 'Jam per minggu minimal 1'),
});

const updatePembelajaranSchema = createPembelajaranSchema.partial();

const saveKomponenSchema = z.object({
  semester_id: z.string().uuid('Semester tidak valid'),
  komponen: z.array(z.object({
    jenis: z.string().min(1),
    nama: z.string().min(1),
    bobot: z.coerce.number().min(0).max(100),
  })).min(1, 'Minimal satu komponen wajib diisi'),
});

module.exports = {
  createPembelajaranSchema,
  updatePembelajaranSchema,
  saveKomponenSchema,
};
