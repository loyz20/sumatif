-- Migration: create_presensi_pembelajaran
-- Up
CREATE TABLE IF NOT EXISTS presensi_pembelajaran (
    id VARCHAR(36) PRIMARY KEY,
    sekolah_id VARCHAR(36) NOT NULL,
    pembelajaran_id VARCHAR(36) NOT NULL,
    peserta_didik_id VARCHAR(36) NOT NULL,
    semester_id VARCHAR(36) NOT NULL,
    tanggal DATE NOT NULL,
    status ENUM('Hadir', 'Izin', 'Sakit', 'Alpa') NOT NULL DEFAULT 'Hadir',
    catatan TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    
    FOREIGN KEY (sekolah_id) REFERENCES sekolah(id),
    FOREIGN KEY (pembelajaran_id) REFERENCES pembelajaran(id),
    FOREIGN KEY (peserta_didik_id) REFERENCES peserta_didik(id),
    FOREIGN KEY (semester_id) REFERENCES semester(id),
    
    INDEX idx_presensi_lookup (pembelajaran_id, tanggal, peserta_didik_id),
    INDEX idx_presensi_sekolah (sekolah_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Down
DROP TABLE IF EXISTS presensi_pembelajaran;
