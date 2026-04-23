# Pembelajaran API Contract

Base path: `/api/v1/pembelajaran`

> 🔐 Memerlukan `Authorization: Bearer <access_token>`
> Role: admin

## POST /

Buat pembelajaran (asosiasi rombel + mata pelajaran + PTK).

**Request Body:**

| Field | Type | Required | Validasi |
|-------|------|----------|----------|
| `rombel_id` | string | ✅ | UUID v4 |
| `mata_pelajaran_id` | string | ✅ | UUID v4 |
| `ptk_id` | string | ✅ | UUID v4 |
| `jam_per_minggu` | number | ✅ | min 1 |

```json
{
  "rombel_id": "uuid-v4",
  "mata_pelajaran_id": "uuid-v4",
  "ptk_id": "uuid-v4",
  "jam_per_minggu": 4
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": "uuid-v4",
    "rombel_id": "uuid-v4",
    "mata_pelajaran_id": "uuid-v4",
    "ptk_id": "uuid-v4",
    "jam_per_minggu": 4
  }
}
```
