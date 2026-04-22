-- Migration: create_rombel_and_anggota_rombel
-- Up
CREATE TABLE IF NOT EXISTS rombel (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  sekolah_id VARCHAR(36) NOT NULL,
  tahun_ajaran_id VARCHAR(36) NOT NULL,
  nama VARCHAR(255) NOT NULL,
  tingkat INT NOT NULL,
  wali_kelas_ptk_id VARCHAR(36) NOT NULL,
  KEY idx_rombel_sekolah_id (sekolah_id),
  KEY idx_rombel_tahun_ajaran_id (tahun_ajaran_id),
  KEY idx_rombel_wali_kelas_ptk_id (wali_kelas_ptk_id),
  CONSTRAINT fk_rombel_sekolah
    FOREIGN KEY (sekolah_id) REFERENCES sekolah (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_rombel_tahun_ajaran
    FOREIGN KEY (tahun_ajaran_id) REFERENCES tahun_ajaran (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_rombel_wali_kelas_ptk
    FOREIGN KEY (wali_kelas_ptk_id) REFERENCES ptk (id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS anggota_rombel (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  rombel_id VARCHAR(36) NOT NULL,
  peserta_didik_id VARCHAR(36) NOT NULL,
  KEY idx_anggota_rombel_rombel_id (rombel_id),
  KEY idx_anggota_rombel_peserta_didik_id (peserta_didik_id),
  CONSTRAINT fk_anggota_rombel_rombel
    FOREIGN KEY (rombel_id) REFERENCES rombel (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_anggota_rombel_peserta_didik
    FOREIGN KEY (peserta_didik_id) REFERENCES peserta_didik (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Down
DROP TABLE IF EXISTS anggota_rombel;
DROP TABLE IF EXISTS rombel;
