const { idSchema, paginationSchema } = require('./base.schema');
const { createSekolahSchema, updateSekolahSchema } = require('./sekolah.schema');
const { createSiswaSchema, updateSiswaSchema, listSiswaQuerySchema } = require('./siswa.schema');
const {
  createPtkSchema,
  updatePtkSchema,
  listPtkQuerySchema,
  createPtkRiwayatPendidikanSchema,
} = require('./ptk.schema');
const {
  createRombelSchema,
  updateRombelSchema,
  listRombelQuerySchema,
  addAnggotaRombelSchema,
} = require('./rombel.schema');
const { createPembelajaranSchema, updatePembelajaranSchema } = require('./pembelajaran.schema');
const { absensiSchema, rekapAbsensiQuerySchema } = require('./absensi.schema');
const { createRegistrasiSchema } = require('./registrasi.schema');
const { createMataPelajaranSchema, listMataPelajaranQuerySchema } = require('./mataPelajaran.schema');
const { createTahunAjaranSchema, listTahunAjaranQuerySchema } = require('./tahunAjaran.schema');
const { listSemesterQuerySchema } = require('./semester.schema');
const { trackingSchema } = require('./tracking.schema');
const { createUserSchema } = require('./user.schema');
const { loginSchema } = require('./auth.schema');

module.exports = {
  idSchema,
  paginationSchema,
  createSekolahSchema,
  updateSekolahSchema,
  createSiswaSchema,
  updateSiswaSchema,
  listSiswaQuerySchema,
  createPtkSchema,
  updatePtkSchema,
  listPtkQuerySchema,
  createPtkRiwayatPendidikanSchema,
  createRombelSchema,
  updateRombelSchema,
  listRombelQuerySchema,
  addAnggotaRombelSchema,
  createPembelajaranSchema,
  updatePembelajaranSchema,
  absensiSchema,
  rekapAbsensiQuerySchema,
  createRegistrasiSchema,
  createMataPelajaranSchema,
  listMataPelajaranQuerySchema,
  createTahunAjaranSchema,
  listTahunAjaranQuerySchema,
  listSemesterQuerySchema,
  trackingSchema,
  createUserSchema,
  loginSchema,
};
