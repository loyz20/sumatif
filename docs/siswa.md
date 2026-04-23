# Siswa API Contract

Base path: `/api/v1/siswa`

> 🔐 Semua endpoint memerlukan `Authorization: Bearer <access_token>`

## Hak Akses

| Method         | Role yang diizinkan |
|----------------|---------------------|
| GET /, GET /:id | admin, guru        |
| POST /, PUT /:id| admin, guru        |
| DELETE /:id     | admin              |

---

## GET /

List siswa dengan pagination, search, sorting, dan filter sekolah.

**Query Params:**

| Param       | Type   | Default    | Keterangan                          |
|-------------|--------|------------|-------------------------------------|
| `page`      | string | `1`        | Halaman                             |
| `limit`     | string | `10`       | Maks 100                            |
| `search`    | string | —          | Cari di: nama, nisn, nik            |
| `sort`      | string | `nama:asc` | Field: nama, nisn, nik, tanggal_lahir |
| `sekolah_id`| string | —          | Filter by sekolah UUID              |

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
        "nama": "Andi Wijaya",
        "nisn": "0012345678",
        "nik": "3201123456789012",
        "jenis_kelamin": "L",
        "tanggal_lahir": "2010-08-15",
        "nama_ayah": "Budi",
        "nama_ibu": "Siti"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "total_pages": 5
    }
  }
}
```

---

## POST /

Buat siswa baru.

**Request Body:**

| Field           | Type   | Required | Validasi                |
|-----------------|--------|----------|-------------------------|
| `nama`          | string | ✅       | min 1 karakter          |
| `nisn`          | string | ✅       | min 5 karakter (unik)   |
| `nik`           | string | ✅       | tepat 16 digit (unik)   |
| `jenis_kelamin` | string | ✅       | `L` atau `P`            |
| `tanggal_lahir` | string | ✅       | format `YYYY-MM-DD`     |
| `sekolah_id`    | string | ✅       | UUID v4                 |
| `nama_ayah`     | string | ❌       | opsional                |
| `nama_ibu`      | string | ❌       | opsional                |

```json
{
  "nama": "Andi Wijaya",
  "nisn": "0012345678",
  "nik": "3201123456789012",
  "jenis_kelamin": "L",
  "tanggal_lahir": "2010-08-15",
  "sekolah_id": "uuid-v4",
  "nama_ayah": "Budi",
  "nama_ibu": "Siti"
}
```

**Response (201):** Data siswa yang dibuat.

**Error (409):** `"Data siswa duplikat"` — `DUPLICATE_DATA`

---

## GET /:id

Detail siswa berdasarkan UUID.

**Response (200):** Sama seperti item di list response.

**Error (404):** `"Data siswa tidak ditemukan"` — `NOT_FOUND`

---

## PUT /:id

Update siswa. Semua field bersifat **partial** (opsional).

**Response (200):** Data siswa yang sudah diupdate.

---

## DELETE /:id

Hapus siswa.

**Response (204):** No content
