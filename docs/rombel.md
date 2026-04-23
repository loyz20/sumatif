# Rombel API Contract

Base path: `/api/v1/rombel`

> 🔐 Semua endpoint memerlukan `Authorization: Bearer <access_token>`

## Hak Akses

| Method | Role |
|--------|------|
| GET | admin, guru |
| POST /, POST /:id/anggota | admin |

---

## GET /

List rombel. Query: `page`, `limit`, `search`, `sort` (nama, tingkat), `tahun_ajaran_id`.

**Response (200):**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "items": [
      {
        "id": "uuid", "sekolah_id": "uuid", "tahun_ajaran_id": "uuid",
        "nama": "1A", "tingkat": 1, "wali_kelas_ptk_id": "uuid",
        "sekolah_nama": "SD Negeri 1", "wali_kelas_nama": "Budi"
      }
    ],
    "pagination": { "page": 1, "limit": 10, "total": 5, "total_pages": 1 }
  }
}
```

## POST /

Buat rombel. Body: `nama` (string), `tingkat` (number 1-12), `sekolah_id` (uuid), `tahun_ajaran_id` (uuid), `wali_kelas_ptk_id` (uuid). Semua required.

**Response (201):** Data rombel.

## GET /:id

Detail rombel. **404** jika tidak ditemukan.

## POST /:id/anggota

Tambah anggota. Body: `peserta_didik_id` (uuid, required).

**Response (201):** `{ id, rombel_id, peserta_didik_id, peserta_didik_nama }`

## GET /:id/anggota

List anggota rombel. Response: array `{ id, rombel_id, peserta_didik_id, peserta_didik_nama, nisn }`.

## GET /:id/pembelajaran

List pembelajaran rombel. Response: array `{ id, rombel_id, mata_pelajaran_id, ptk_id, jam_per_minggu, mata_pelajaran_nama, mata_pelajaran_kode, ptk_nama }`.
