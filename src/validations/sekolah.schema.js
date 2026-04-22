const { z } = require('zod');

const createSekolahSchema = z.object({
  nama: z.string().min(1, 'Nama wajib diisi'),
  npsn: z.string().min(1, 'NPSN wajib diisi'),
  status: z.string().min(1, 'Status wajib diisi'),
  alamat: z.string().min(1, 'Alamat wajib diisi'),
  provinsi: z.string().min(1, 'Provinsi wajib diisi'),
  kabupaten: z.string().min(1, 'Kabupaten wajib diisi'),
  kecamatan: z.string().min(1, 'Kecamatan wajib diisi'),
  desa: z.string().min(1, 'Desa wajib diisi'),
  kode_pos: z.string().min(1, 'Kode pos wajib diisi'),
  lintang: z.coerce.number({ invalid_type_error: 'Lintang tidak valid' }),
  bujur: z.coerce.number({ invalid_type_error: 'Bujur tidak valid' }),
});

const updateSekolahSchema = createSekolahSchema.partial();

module.exports = {
  createSekolahSchema,
  updateSekolahSchema,
};
