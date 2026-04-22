-- Migration: create_tahun_ajaran_and_semester
-- Up
CREATE TABLE IF NOT EXISTS tahun_ajaran (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  sekolah_id VARCHAR(36) NOT NULL,
  tahun VARCHAR(9) NOT NULL,
  aktif BOOLEAN NOT NULL DEFAULT FALSE,
  UNIQUE KEY uk_tahun_ajaran_sekolah_tahun (sekolah_id, tahun),
  KEY idx_tahun_ajaran_sekolah_id (sekolah_id),
  CONSTRAINT fk_tahun_ajaran_sekolah
    FOREIGN KEY (sekolah_id) REFERENCES sekolah (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS semester (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  tahun_ajaran_id VARCHAR(36) NOT NULL,
  nama VARCHAR(20) NOT NULL,
  aktif BOOLEAN NOT NULL DEFAULT FALSE,
  UNIQUE KEY uk_semester_tahun_ajaran_nama (tahun_ajaran_id, nama),
  KEY idx_semester_tahun_ajaran_id (tahun_ajaran_id),
  CONSTRAINT fk_semester_tahun_ajaran
    FOREIGN KEY (tahun_ajaran_id) REFERENCES tahun_ajaran (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Down
DROP TABLE IF EXISTS semester;
DROP TABLE IF EXISTS tahun_ajaran;
