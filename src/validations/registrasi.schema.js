const { z } = require('zod');

const createRegistrasiSchema = z.object({
  peserta_didik_id: z.string().uuid('Peserta didik tidak valid'),
  sekolah_id: z.string().uuid('Sekolah tidak valid'),
  tanggal_masuk: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Tanggal masuk tidak valid'),
  status: z.string().min(1, 'Status wajib diisi'),
});

module.exports = {
  createRegistrasiSchema,
};