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
  kepala_sekolah: z.string().optional(),
  akreditasi: z.string().optional(),
  email: z.string().email('Format email tidak valid').optional().or(z.literal('')),
  no_telepon: z.string().optional(),
  website: z.string().url('Format URL website tidak valid').optional().or(z.literal('')),
});

const updateSekolahSchema = createSekolahSchema.partial();

module.exports = {
  createSekolahSchema,
  updateSekolahSchema,
};
