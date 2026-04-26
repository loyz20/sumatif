-- Migration: redesign_absensi_to_jurnal
-- Up
SET FOREIGN_KEY_CHECKS = 0;

-- 1. Create jurnal (Header)
CREATE TABLE IF NOT EXISTS jurnal (
    id VARCHAR(36) PRIMARY KEY,
    sekolah_id VARCHAR(36) NOT NULL,
    guru_id VARCHAR(36) NOT NULL, -- ref to ptk.id
    rombel_id VARCHAR(36) NOT NULL,
    pembelajaran_id VARCHAR(36) NOT NULL,
    semester_id VARCHAR(36) NOT NULL,
    tanggal DATE NOT NULL,
    jam_ke VARCHAR(20), -- contoh: "1-2"
    tp_id VARCHAR(36), -- Optional: Tujuan Pembelajaran
    materi TEXT NOT NULL,
    catatan TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(36),

    FOREIGN KEY (sekolah_id) REFERENCES sekolah(id) ON DELETE CASCADE,
    FOREIGN KEY (guru_id) REFERENCES ptk(id) ON DELETE CASCADE,
    FOREIGN KEY (rombel_id) REFERENCES rombel(id) ON DELETE CASCADE,
    FOREIGN KEY (pembelajaran_id) REFERENCES pembelajaran(id) ON DELETE CASCADE,
    FOREIGN KEY (semester_id) REFERENCES semester(id) ON DELETE CASCADE,
    
    UNIQUE KEY uk_jurnal_pembelajaran_hari (pembelajaran_id, tanggal)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Create jurnal_kehadiran (Detail)
CREATE TABLE IF NOT EXISTS jurnal_kehadiran (
    id VARCHAR(36) PRIMARY KEY,
    jurnal_id VARCHAR(36) NOT NULL,
    peserta_didik_id VARCHAR(36) NOT NULL,
    status ENUM('Hadir', 'Izin', 'Sakit', 'Alpa') NOT NULL DEFAULT 'Hadir',
    catatan TEXT,
    
    FOREIGN KEY (jurnal_id) REFERENCES jurnal(id) ON DELETE CASCADE,
    FOREIGN KEY (peserta_didik_id) REFERENCES peserta_didik(id) ON DELETE CASCADE,
    UNIQUE KEY uk_jurnal_siswa (jurnal_id, peserta_didik_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Cleanup old table (optional but good for this request)
-- DROP TABLE IF EXISTS presensi_pembelajaran;

SET FOREIGN_KEY_CHECKS = 1;

-- Down
-- DROP TABLE IF EXISTS jurnal_kehadiran;
-- DROP TABLE IF EXISTS jurnal;
