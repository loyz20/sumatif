# PTK API Contract

Base path: `/api/v1/ptk`

> 🔐 Semua endpoint memerlukan `Authorization: Bearer <access_token>`

## Hak Akses

| Method                          | Role yang diizinkan |
|---------------------------------|---------------------|
| GET /, GET /:id, GET /:id/riwayat-* | admin, guru    |
| POST /, PUT /:id, DELETE /:id   | admin              |
| POST /:id/riwayat-pendidikan    | admin              |

---

## GET /

List PTK dengan pagination, search, sorting, dan filter sekolah.

**Query Params:**

| Param       | Type   | Default    | Keterangan                                    |
|-------------|--------|------------|-----------------------------------------------|
| `page`      | string | `1`        | Halaman                                       |
| `limit`     | string | `10`       | Maks 100                                      |
| `search`    | string | —          | Cari di: nama, nik, nip, nuptk, jenis_kelamin, pendidikan_terakhir |
| `sort`      | string | `nama:asc` | Field: nama, nik, nip, nuptk, jenis_kelamin, tanggal_lahir, pendidikan_terakhir, created_at |
| `sekolah_id`| string | —          | Filter by sekolah UUID                        |

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
        "nama": "Budi Santoso",
        "nik": "3201123456789012",
        "nip": "1987654321",
        "nuptk": "123456",
        "jenis_kelamin": "L",
        "tanggal_lahir": "1980-05-12",
        "pendidikan_terakhir": "S1 Pendidikan"
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

Buat PTK baru.

**Request Body:**

| Field                  | Type   | Required | Validasi                          |
|------------------------|--------|----------|-----------------------------------|
| `nama`                 | string | ✅       | min 1 karakter                    |
| `nik`                  | string | ✅       | tepat 16 digit                    |
| `nip`                  | string | ✅       | min 1 karakter (unik)             |
| `nuptk`                | string | ✅       | min 1 karakter (unik)             |
| `jenis_kelamin`        | string | ✅       | `L` atau `P`                      |
| `tanggal_lahir`        | string | ✅       | format `YYYY-MM-DD`               |
| `pendidikan_terakhir`  | string | ✅       | min 1 karakter                    |
| `sekolah_id`           | string | ✅       | UUID v4                           |

```json
{
  "nama": "Budi Santoso",
  "nik": "3201123456789012",
  "nip": "1987654321",
  "nuptk": "123456",
  "jenis_kelamin": "L",
  "tanggal_lahir": "1980-05-12",
  "pendidikan_terakhir": "S1 Pendidikan",
  "sekolah_id": "uuid-v4"
}
```

**Response (201):** Data PTK yang dibuat.

**Error (409):** `"Data PTK duplikat"` — `DUPLICATE_DATA`

---

## GET /:id

Detail PTK berdasarkan UUID.

**Response (200):** Sama seperti item di list response.

**Error (404):** `"Data PTK tidak ditemukan"` — `NOT_FOUND`

---

## PUT /:id

Update PTK. Semua field bersifat **partial** (opsional).

**Request Body:** Sama seperti POST, semua field opsional.

**Response (200):** Data PTK yang sudah diupdate.

---

## DELETE /:id

Hapus PTK.

**Response (204):** No content

---

## GET /:id/riwayat-pendidikan

List riwayat pendidikan PTK.

**Response (200):**

```json
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "id": "uuid-v4",
      "ptk_id": "uuid-v4",
      "jenjang": "S1",
      "nama_instansi": "Universitas Pendidikan",
      "tahun_lulus": 2005
    }
  ]
}
```

---

## POST /:id/riwayat-pendidikan

Tambah riwayat pendidikan PTK.

**Request Body:**

| Field           | Type   | Required | Validasi                    |
|-----------------|--------|----------|-----------------------------|
| `jenjang`       | string | ✅       | min 1 karakter              |
| `nama_instansi` | string | ✅       | min 1 karakter              |
| `tahun_lulus`   | number | ✅       | integer, 1900–3000          |

**Response (201):** Data riwayat pendidikan yang dibuat.

---

## GET /:id/riwayat-kepangkatan

List riwayat kepangkatan PTK.

**Response (200):**

```json
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "id": "uuid-v4",
      "ptk_id": "uuid-v4",
      "pangkat": "Penata",
      "golongan": "III/c",
      "tmt": "2020-01-01"
    }
  ]
}
```
