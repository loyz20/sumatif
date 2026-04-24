const { z } = require('zod');

const schema = z.object({
  nik: z.string().regex(/^(\d{16})?$/, 'NIK harus 16 digit').nullish().or(z.literal('')),
  tanggal_lahir: z.string().regex(/^(\d{4}-\d{2}-\d{2})?$/, 'Tanggal lahir tidak valid').nullish().or(z.literal('')),
});

const result = schema.safeParse({ nik: '', tanggal_lahir: '' });
console.log(JSON.stringify(result, null, 2));
