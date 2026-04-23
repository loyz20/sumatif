# Sekolah API Contract

Base path: `/api/v1/sekolah`

> 🔐 Semua endpoint memerlukan `Authorization: Bearer <access_token>`

## Hak Akses

| Method         | Role yang diizinkan |
|----------------|---------------------|
| GET /, GET /:id | admin, guru        |
| POST /          | admin              |
| PUT /:id        | admin              |
| DELETE /:id     | admin              |

---

## GET /

List sekolah dengan pagination, search, dan sorting.

**Query Params:**

| Param    | Type   | Default          | Keterangan                           |
|----------|--------|------------------|--------------------------------------|
| `page`   | string | `1`              | Halaman                              |
| `limit`  | string | `10`             | Maks 100                             |
| `search` | string | —                | Cari di: nama, npsn, status, provinsi, kabupaten, kecamatan, desa |
| `sort`   | string | `created_at:desc`| Format: `field:asc` atau `field:desc`. Field: created_at, nama, npsn, status, provinsi, kabupaten, kecamatan, desa |

**Response (200):**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "items": [
      {
        "id": "uuid-v4",
        "nama": "SD Negeri 1",
        "npsn": "12345678",
        "status": "Negeri",
        "alamat": "Jalan Contoh 1",
        "provinsi": "Jawa Barat",
        "kabupaten": "Bandung",
        "kecamatan": "Contoh",
        "desa": "Desa A",
        "kode_pos": "40123",
        "lintang": -6.914744,
        "bujur": 107.60981,
        "created_at": "2026-04-22T..."
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "total_pages": 10
    }
  }
}
```

---

## POST /

Buat sekolah baru.

**Request Body:**

| Field       | Type   | Required | Validasi               |
|-------------|--------|----------|------------------------|
| `nama`      | string | ✅       | min 1 karakter         |
| `npsn`      | string | ✅       | min 1 karakter (unik)  |
| `status`    | string | ✅       | min 1 karakter         |
| `alamat`    | string | ✅       | min 1 karakter         |
| `provinsi`  | string | ✅       | min 1 karakter         |
| `kabupaten` | string | ✅       | min 1 karakter         |
| `kecamatan` | string | ✅       | min 1 karakter         |
| `desa`      | string | ✅       | min 1 karakter         |
| `kode_pos`  | string | ✅       | min 1 karakter         |
| `lintang`   | number | ✅       | angka desimal          |
| `bujur`     | number | ✅       | angka desimal          |

```json
{
  "nama": "SD Negeri 1",
  "npsn": "12345678",
  "status": "Negeri",
  "alamat": "Jalan Contoh 1",
  "provinsi": "Jawa Barat",
  "kabupaten": "Bandung",
  "kecamatan": "Contoh",
  "desa": "Desa A",
  "kode_pos": "40123",
  "lintang": -6.914744,
  "bujur": 107.609810
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": "uuid-v4",
    "nama": "SD Negeri 1",
    "npsn": "12345678",
    "status": "Negeri",
    "alamat": "Jalan Contoh 1",
    "provinsi": "Jawa Barat",
    "kabupaten": "Bandung",
    "kecamatan": "Contoh",
    "desa": "Desa A",
    "kode_pos": "40123",
    "lintang": -6.914744,
    "bujur": 107.60981,
    "created_at": "2026-04-22T..."
  }
}
```

**Error (409):**

```json
{
  "success": false,
  "message": "NPSN sudah terdaftar",
  "code": "DUPLICATE_DATA"
}
```

---

## GET /:id

Detail sekolah berdasarkan UUID.

**Params:** `id` — UUID v4

**Response (200):** Sama seperti item di list response.

**Error (404):**

```json
{
  "success": false,
  "message": "Data sekolah tidak ditemukan",
  "code": "NOT_FOUND"
}
```

---

## PUT /:id

Update sekolah. Semua field bersifat **partial** (opsional).

**Params:** `id` — UUID v4

**Request Body:** Sama seperti POST, semua field opsional.

**Response (200):** Data sekolah yang sudah diupdate.

---

## DELETE /:id

Hapus sekolah.

**Params:** `id` — UUID v4

**Response (204):** No content
