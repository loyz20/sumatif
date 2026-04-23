# Tracking API Contract

Base path: `/api/v1/tracking`

> 🔐 Memerlukan `Authorization: Bearer <access_token>`
> Role: admin, guru, siswa

## POST /

Catat lokasi tracking peserta didik.

**Request Body:**

| Field | Type | Required | Validasi |
|-------|------|----------|----------|
| `peserta_didik_id` | string | ✅ | UUID v4 |
| `latitude` | number | ✅ | angka desimal |
| `longitude` | number | ✅ | angka desimal |
| `timestamp` | string | ✅ | ISO 8601 datetime |

```json
{
  "peserta_didik_id": "uuid-v4",
  "latitude": -6.914744,
  "longitude": 107.609810,
  "timestamp": "2026-04-23T07:30:00Z"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": "uuid-v4",
    "peserta_didik_id": "uuid-v4",
    "latitude": -6.914744,
    "longitude": 107.60981,
    "tracked_at": "2026-04-23T07:30:00Z"
  }
}
```
