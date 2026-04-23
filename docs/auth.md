# Auth API Contract

Base path: `/api/v1/auth`

> Semua endpoint auth bersifat **public** (tidak memerlukan token).

## Response Envelope

Semua response mengikuti format:

```json
{
  "success": true,
  "message": "Success",
  "data": { ... }
}
```

Error response:

```json
{
  "success": false,
  "message": "Pesan error",
  "code": "ERROR_CODE",
  "errors": null
}
```

---

## POST /login

Autentikasi user dan dapatkan access token + refresh token.

**Request Body:**

| Field      | Type   | Required | Validasi              |
|------------|--------|----------|-----------------------|
| `username` | string | ✅       | min 3 karakter        |
| `password` | string | ✅       | min 6 karakter        |

```json
{
  "username": "administrator",
  "password": "password123"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "access_token": "<jwt>",
    "refresh_token": "<jwt>",
    "user": {
      "id": "uuid-v4",
      "role": "admin"
    }
  }
}
```

**Error (401):**

```json
{
  "success": false,
  "message": "Username atau password salah",
  "code": "INVALID_CREDENTIALS"
}
```

---

## POST /refresh

Tukar refresh token dengan access token + refresh token baru (rotasi).

**Request Body:**

| Field           | Type   | Required | Validasi       |
|-----------------|--------|----------|----------------|
| `refresh_token` | string | ✅       | tidak boleh kosong |

```json
{
  "refresh_token": "<refresh-token>"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "access_token": "<jwt-baru>",
    "refresh_token": "<refresh-token-baru>",
    "user": {
      "id": "uuid-v4",
      "role": "admin"
    }
  }
}
```

**Error (401):**

```json
{
  "success": false,
  "message": "Token tidak valid atau expired",
  "code": "TOKEN_INVALID"
}
```

---

## POST /logout

Revoke semua refresh token milik user.

**Request Body:**

| Field           | Type   | Required | Validasi       |
|-----------------|--------|----------|----------------|
| `refresh_token` | string | ✅       | tidak boleh kosong |

```json
{
  "refresh_token": "<refresh-token>"
}
```

**Response (204):** No content
