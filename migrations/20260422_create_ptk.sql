-- Migration: create_ptk
-- Up
CREATE TABLE IF NOT EXISTS ptk (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  sekolah_id VARCHAR(36) NOT NULL,
  nama VARCHAR(255) NOT NULL,
  nik VARCHAR(50) NOT NULL,
  nip VARCHAR(50) NOT NULL,
  nuptk VARCHAR(50) NOT NULL,
  jenis_kelamin VARCHAR(20) NOT NULL,
  tanggal_lahir DATE NOT NULL,
  pendidikan_terakhir VARCHAR(100) NOT NULL,
  KEY idx_ptk_sekolah_id (sekolah_id),
  CONSTRAINT fk_ptk_sekolah
    FOREIGN KEY (sekolah_id) REFERENCES sekolah (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Down
DROP TABLE IF EXISTS ptk;
