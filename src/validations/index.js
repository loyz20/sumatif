const { idSchema, paginationSchema } = require('./base.schema');
const { createSekolahSchema, updateSekolahSchema } = require('./sekolah.schema');
const { createSiswaSchema, updateSiswaSchema } = require('./siswa.schema');
const { createPtkSchema, updatePtkSchema, listPtkQuerySchema } = require('./ptk.schema');
const { createRombelSchema, updateRombelSchema } = require('./rombel.schema');
const { createPembelajaranSchema, updatePembelajaranSchema } = require('./pembelajaran.schema');
const { absensiSchema } = require('./absensi.schema');
const { loginSchema } = require('./auth.schema');

module.exports = {
  idSchema,
  paginationSchema,
  createSekolahSchema,
  updateSekolahSchema,
  createSiswaSchema,
  updateSiswaSchema,
  createPtkSchema,
  updatePtkSchema,
  listPtkQuerySchema,
  createRombelSchema,
  updateRombelSchema,
  createPembelajaranSchema,
  updatePembelajaranSchema,
  absensiSchema,
  loginSchema,
};
