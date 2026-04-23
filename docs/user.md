# User Management API Contract

Base path: `/api/v1/user`

> 🔐 Memerlukan `Authorization: Bearer <access_token>`
> Role: admin

## POST /

Buat user baru.

**Request Body:**

| Field | Type | Required | Validasi |
|-------|------|----------|----------|
| `username` | string | ✅ | min 3 karakter (unik) |
| `password` | string | ✅ | min 6 karakter |
| `role` | string | ✅ | `admin`, `guru`, `siswa`, atau `orang_tua` |
| `sekolah_id` | string | ❌ | UUID v4 |
| `ref_id` | string | ❌ | UUID v4 |

```json
{
  "sekolah_id": "uuid-v4",
  "username": "guru01",
  "password": "password123",
  "role": "guru",
  "ref_id": "uuid-v4"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": "uuid-v4",
    "sekolah_id": "uuid-v4",
    "username": "guru01",
    "role": "guru",
    "ref_id": "uuid-v4"
  }
}
```

> ⚠️ Password tidak dikembalikan di response.

**Error (409):** `"Username sudah terdaftar"` — `DUPLICATE_DATA`
**Error (404):** `"Data sekolah tidak ditemukan"` — `NOT_FOUND`
