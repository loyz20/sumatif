-- Migration: create_mata_pelajaran_and_pembelajaran
-- Up
CREATE TABLE IF NOT EXISTS mata_pelajaran (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  nama VARCHAR(255) NOT NULL,
  kode VARCHAR(50) NOT NULL,
  UNIQUE KEY uk_mata_pelajaran_kode (kode)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS pembelajaran (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  rombel_id VARCHAR(36) NOT NULL,
  mata_pelajaran_id VARCHAR(36) NOT NULL,
  ptk_id VARCHAR(36) NOT NULL,
  jam_per_minggu INT NOT NULL,
  KEY idx_pembelajaran_rombel_id (rombel_id),
  KEY idx_pembelajaran_mata_pelajaran_id (mata_pelajaran_id),
  KEY idx_pembelajaran_ptk_id (ptk_id),
  CONSTRAINT fk_pembelajaran_rombel
    FOREIGN KEY (rombel_id) REFERENCES rombel (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_pembelajaran_mata_pelajaran
    FOREIGN KEY (mata_pelajaran_id) REFERENCES mata_pelajaran (id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT fk_pembelajaran_ptk
    FOREIGN KEY (ptk_id) REFERENCES ptk (id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Down
DROP TABLE IF EXISTS pembelajaran;
DROP TABLE IF EXISTS mata_pelajaran;
