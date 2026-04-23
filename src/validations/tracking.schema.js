const { z } = require('zod');

const trackingSchema = z.object({
  peserta_didik_id: z.string().uuid('Peserta didik tidak valid'),
  latitude: z.number(),
  longitude: z.number(),
  timestamp: z.string().datetime('Timestamp tidak valid'),
});

module.exports = {
  trackingSchema,
};