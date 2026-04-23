# Absensi API Contract

Base path: `/api/v1/absensi`

> 🔐 Semua endpoint memerlukan `Authorization: Bearer <access_token>`

## Hak Akses

| Method | Role |
|--------|------|
| POST /masuk, POST /keluar | admin, guru, siswa |
| GET / (rekap) | admin, guru |

---

## POST /masuk

Catat absensi masuk. Jika sudah ada record hari ini, update jam masuk.

**Request Body:**

| Field | Type | Required | Validasi |
|-------|------|----------|----------|
| `peserta_didik_id` | string | ✅ | UUID v4 |
| `latitude` | number | ✅ | angka desimal |
| `longitude` | number | ✅ | angka desimal |

```json
{
  "peserta_didik_id": "uuid-v4",
  "latitude": -6.914744,
  "longitude": 107.609810
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": "uuid-v4",
    "peserta_didik_id": "uuid-v4",
    "tanggal": "2026-04-23",
    "jam_masuk": "2026-04-23T07:30:00.000Z",
    "jam_keluar": null,
    "latitude_masuk": -6.914744,
    "longitude_masuk": 107.60981,
    "latitude_keluar": null,
    "longitude_keluar": null
  }
}
```

---

## POST /keluar

Catat absensi keluar. Harus sudah ada record masuk hari ini.

**Request Body:** Sama seperti POST /masuk.

**Response (200):** Data absensi yang sudah diupdate dengan `jam_keluar`.

**Error (404):** `"Data absensi masuk hari ini belum tersedia"` — `NOT_FOUND`

---

## GET /

Rekap absensi dengan filter dan pagination.

**Query Params:**

| Param | Type | Keterangan |
|-------|------|------------|
| `peserta_didik_id` | string (uuid) | Filter by siswa |
| `bulan` | string | Format `01`–`12` |
| `tahun` | string | Format `2026` |
| `page` | string | Halaman |
| `limit` | string | Maks 100 |

**Response (200):**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "items": [
      {
        "id": "uuid-v4",
        "peserta_didik_id": "uuid-v4",
        "tanggal": "2026-04-23",
        "jam_masuk": "2026-04-23T07:30:00.000Z",
        "jam_keluar": "2026-04-23T14:00:00.000Z",
        "latitude_masuk": -6.914744,
        "longitude_masuk": 107.60981,
        "latitude_keluar": -6.914744,
        "longitude_keluar": 107.60981,
        "peserta_didik_nama": "Andi Wijaya"
      }
    ],
    "pagination": { "page": 1, "limit": 10, "total": 20, "total_pages": 2 }
  }
}
```
