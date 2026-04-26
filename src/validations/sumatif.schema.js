const { z } = require('zod');

const komponenNilaiSchema = z.object({
  jenis: z.string().min(1, 'Jenis komponen wajib diisi'),
  nama: z.string().min(1, 'Nama komponen wajib diisi'),
  bobot: z.coerce.number().min(0).max(100),
  nilai: z.coerce.number().min(0).max(100),
});

const createNilaiSumatifSchema = z.object({
  peserta_didik_id: z.string().uuid('Siswa tidak valid'),
  rombel_id: z.string().uuid('Rombel tidak valid'),
  pembelajaran_id: z.string().uuid('Mata pelajaran tidak valid'),
  semester_id: z.string().uuid('Semester tidak valid'),
  
  predikat: z.string().optional(),
  deskripsi: z.string().optional(),
  status: z.enum(['draft', 'final']).default('draft'),
  
  komponen: z.array(komponenNilaiSchema).min(1, 'Minimal satu komponen nilai wajib diisi'),
});

const updateNilaiSumatifSchema = z.object({
  predikat: z.string().optional(),
  deskripsi: z.string().optional(),
  status: z.enum(['draft', 'final']).optional(),
  komponen: z.array(komponenNilaiSchema).optional(),
});

const masterKomponenSchema = z.object({
  jenis: z.string().min(1, 'Jenis wajib diisi'),
  nama: z.string().min(1, 'Nama wajib diisi'),
  default_bobot: z.coerce.number().min(0).max(100),
});

module.exports = {
  createNilaiSumatifSchema,
  updateNilaiSumatifSchema,
  masterKomponenSchema,
};
