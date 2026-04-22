const { z } = require('zod');

const absensiSchema = z.object({
  peserta_didik_id: z.string().uuid('Peserta didik tidak valid'),
  latitude: z.number(),
  longitude: z.number(),
});

module.exports = {
  absensiSchema,
};
