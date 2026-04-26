# Mata Pelajaran API Contract

Base path: `/api/v1/mata-pelajaran`

> 🔐 Memerlukan `Authorization: Bearer <access_token>`

## Hak Akses

| Method | Role |
|--------|------|
| GET /  | admin, guru |
| POST / | admin |
| POST /import | admin |

## GET /

List mata pelajaran. Query: `page`, `limit`, `search` (nama, kode), `sort`.

**Response (200):**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "items": [
      { "id": "uuid-v4", "nama": "Matematika", "kode": "MTK101" }
    ],
    "pagination": { "page": 1, "limit": 10, "total": 5, "total_pages": 1 }
  }
}
```

## POST /

Buat mata pelajaran. Body: `nama` (string, required), `kode` (string, required).

```json
{ "nama": "Matematika", "kode": "MTK101" }
```

**Response (201):**
```json
{
  "success": true,
  "message": "Success",
  "data": { "id": "uuid-v4", "nama": "Matematika", "kode": "MTK101" }
}
```

---

## POST /import

Impor banyak mata pelajaran sekaligus.

**Request Body:**
```json
{
  "items": [
    { "nama": "Fisika", "kode": "FIS-01" },
    { "nama": "Kimia", "kode": "KIM-01" }
  ]
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Import completed",
  "data": {
    "successCount": 2,
    "failedCount": 0,
    "errors": []
  }
}
```
