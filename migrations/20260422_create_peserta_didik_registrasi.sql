-- Migration: create_peserta_didik_and_registrasi
-- Up
CREATE TABLE IF NOT EXISTS peserta_didik (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  sekolah_id VARCHAR(36) NOT NULL,
  nama VARCHAR(255) NOT NULL,
  nis VARCHAR(20) NOT NULL,
  nisn VARCHAR(50) NULL,
  nik VARCHAR(50) NULL,
  jenis_kelamin VARCHAR(20) NULL,
  tanggal_lahir DATE NULL,
  nama_ayah VARCHAR(255) NULL,
  nama_ibu VARCHAR(255) NULL,
  KEY idx_peserta_didik_sekolah_id (sekolah_id),
  CONSTRAINT fk_peserta_didik_sekolah
    FOREIGN KEY (sekolah_id) REFERENCES sekolah (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS registrasi (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  peserta_didik_id VARCHAR(36) NOT NULL,
  sekolah_id VARCHAR(36) NOT NULL,
  tanggal_masuk DATE NOT NULL,
  status VARCHAR(50) NOT NULL,
  KEY idx_registrasi_peserta_didik_id (peserta_didik_id),
  KEY idx_registrasi_sekolah_id (sekolah_id),
  CONSTRAINT fk_registrasi_peserta_didik
    FOREIGN KEY (peserta_didik_id) REFERENCES peserta_didik (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_registrasi_sekolah
    FOREIGN KEY (sekolah_id) REFERENCES sekolah (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Down
DROP TABLE IF EXISTS registrasi;
DROP TABLE IF EXISTS peserta_didik;
