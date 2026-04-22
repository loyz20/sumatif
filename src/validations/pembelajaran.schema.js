const { z } = require('zod');

const createPembelajaranSchema = z.object({
  rombel_id: z.string().uuid('Rombel tidak valid'),
  mata_pelajaran_id: z.string().uuid('Mata pelajaran tidak valid'),
  ptk_id: z.string().uuid('PTK tidak valid'),
  jam_per_minggu: z.number().min(1, 'Jam per minggu minimal 1'),
});

const updatePembelajaranSchema = createPembelajaranSchema.partial();

module.exports = {
  createPembelajaranSchema,
  updatePembelajaranSchema,
};
