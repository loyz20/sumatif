-- Migration: create_absensi_tracking_ptk_riwayat
-- Up
CREATE TABLE IF NOT EXISTS ptk_riwayat_pendidikan (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  ptk_id VARCHAR(36) NOT NULL,
  jenjang VARCHAR(100) NOT NULL,
  nama_instansi VARCHAR(255) NOT NULL,
  tahun_lulus INT NOT NULL,
  KEY idx_ptk_riwayat_pendidikan_ptk_id (ptk_id),
  CONSTRAINT fk_ptk_riwayat_pendidikan_ptk
    FOREIGN KEY (ptk_id) REFERENCES ptk (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS ptk_riwayat_kepangkatan (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  ptk_id VARCHAR(36) NOT NULL,
  pangkat VARCHAR(100) NOT NULL,
  golongan VARCHAR(20) NOT NULL,
  tmt DATE NOT NULL,
  KEY idx_ptk_riwayat_kepangkatan_ptk_id (ptk_id),
  CONSTRAINT fk_ptk_riwayat_kepangkatan_ptk
    FOREIGN KEY (ptk_id) REFERENCES ptk (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS absensi (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  peserta_didik_id VARCHAR(36) NOT NULL,
  tanggal DATE NOT NULL,
  jam_masuk DATETIME NULL,
  jam_keluar DATETIME NULL,
  latitude_masuk DECIMAL(10, 7) NULL,
  longitude_masuk DECIMAL(10, 7) NULL,
  latitude_keluar DECIMAL(10, 7) NULL,
  longitude_keluar DECIMAL(10, 7) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_absensi_peserta_didik_tanggal (peserta_didik_id, tanggal),
  KEY idx_absensi_tanggal (tanggal),
  CONSTRAINT fk_absensi_peserta_didik
    FOREIGN KEY (peserta_didik_id) REFERENCES peserta_didik (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tracking_lokasi (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  peserta_didik_id VARCHAR(36) NOT NULL,
  latitude DECIMAL(10, 7) NOT NULL,
  longitude DECIMAL(10, 7) NOT NULL,
  tracked_at DATETIME NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_tracking_lokasi_peserta_didik_id (peserta_didik_id),
  KEY idx_tracking_lokasi_tracked_at (tracked_at),
  CONSTRAINT fk_tracking_lokasi_peserta_didik
    FOREIGN KEY (peserta_didik_id) REFERENCES peserta_didik (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Down
DROP TABLE IF EXISTS tracking_lokasi;
DROP TABLE IF EXISTS absensi;
DROP TABLE IF EXISTS ptk_riwayat_kepangkatan;
DROP TABLE IF EXISTS ptk_riwayat_pendidikan;