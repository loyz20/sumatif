# Tahun Ajaran API Contract

Base path: `/api/v1/tahun-ajaran`

> 🔐 Memerlukan `Authorization: Bearer <access_token>`

## Hak Akses

| Method | Role |
|--------|------|
| GET /  | admin, guru |
| POST / | admin |

## GET /

List tahun ajaran. Query: `page`, `limit`, `search` (tahun, nama sekolah), `sort`, `sekolah_id` (uuid, opsional).

**Response (200):**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "items": [
      {
        "id": "uuid-v4",
        "sekolah_id": "uuid-v4",
        "tahun": "2025/2026",
        "aktif": true,
        "sekolah_nama": "SD Negeri 1"
      }
    ],
    "pagination": { "page": 1, "limit": 10, "total": 3, "total_pages": 1 }
  }
}
```

## POST /

Buat tahun ajaran.

**Request Body:**

| Field | Type | Required | Validasi |
|-------|------|----------|----------|
| `sekolah_id` | string | ✅ | UUID v4 |
| `tahun` | string | ✅ | format `YYYY/YYYY` |
| `aktif` | boolean | ❌ | default false |

```json
{ "sekolah_id": "uuid-v4", "tahun": "2025/2026", "aktif": true }
```

**Response (201):**

```json
{
  "success": true,
  "message": "Success",
  "data": { "id": "uuid-v4", "sekolah_id": "uuid-v4", "tahun": "2025/2026", "aktif": true }
}
```
