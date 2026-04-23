# Semester API Contract

Base path: `/api/v1/semester`

> 🔐 Memerlukan `Authorization: Bearer <access_token>`
> Role: admin, guru

## GET /

List semester dengan filter tahun ajaran.

**Query Params:**

| Param | Type | Keterangan |
|-------|------|------------|
| `tahun_ajaran_id` | string (uuid) | Filter by tahun ajaran |
| `page` | string | Halaman |
| `limit` | string | Maks 100 |
| `search` | string | Cari di: nama semester, tahun |
| `sort` | string | Sorting |

**Response (200):**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "items": [
      {
        "id": "uuid-v4",
        "tahun_ajaran_id": "uuid-v4",
        "nama": "Ganjil",
        "aktif": true,
        "tahun": "2025/2026"
      }
    ],
    "pagination": { "page": 1, "limit": 10, "total": 2, "total_pages": 1 }
  }
}
```
