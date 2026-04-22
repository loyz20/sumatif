-- Migration: create_sekolah
-- Up
CREATE TABLE IF NOT EXISTS sekolah (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  nama VARCHAR(255) NOT NULL,
  npsn VARCHAR(20) NOT NULL,
  status VARCHAR(50) NOT NULL,
  alamat TEXT NOT NULL,
  provinsi VARCHAR(100) NOT NULL,
  kabupaten VARCHAR(100) NOT NULL,
  kecamatan VARCHAR(100) NOT NULL,
  desa VARCHAR(100) NOT NULL,
  kode_pos VARCHAR(10) NOT NULL,
  lintang DECIMAL(10, 7) NOT NULL,
  bujur DECIMAL(10, 7) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_sekolah_npsn (npsn)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Down
DROP TABLE IF EXISTS sekolah;
