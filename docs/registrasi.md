# Registrasi API Contract

Base path: `/api/v1/registrasi`

> 🔐 Memerlukan `Authorization: Bearer <access_token>`
> Role: admin

## POST /

Buat registrasi peserta didik baru.

**Request Body:**

| Field | Type | Required | Validasi |
|-------|------|----------|----------|
| `peserta_didik_id` | string | ✅ | UUID v4 |
| `sekolah_id` | string | ✅ | UUID v4 |
| `tanggal_masuk` | string | ✅ | format `YYYY-MM-DD` |
| `status` | string | ✅ | min 1 karakter |

```json
{
  "peserta_didik_id": "uuid-v4",
  "sekolah_id": "uuid-v4",
  "tanggal_masuk": "2026-07-01",
  "status": "aktif"
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
    "sekolah_id": "uuid-v4",
    "tanggal_masuk": "2026-07-01",
    "status": "aktif"
  }
}
```
