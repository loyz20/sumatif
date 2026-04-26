-- Migration: redesign_penilaian_flexible
-- Up
SET FOREIGN_KEY_CHECKS = 0;

-- 1. Drop existing tables to be replaced
DROP TABLE IF EXISTS komponen_nilai;
DROP TABLE IF EXISTS nilai_sumatif;
DROP TABLE IF EXISTS master_komponen_nilai;

-- 2. Create kategori_penilaian (Master Bobot per Sekolah)
CREATE TABLE kategori_penilaian (
    id VARCHAR(36) PRIMARY KEY,
    sekolah_id VARCHAR(36) NOT NULL,
    nama VARCHAR(50) NOT NULL, -- Tugas, UH, UTS, UAS, Projek, dsb
    bobot DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sekolah_id) REFERENCES sekolah(id) ON DELETE CASCADE,
    UNIQUE KEY uk_sekolah_kategori (sekolah_id, nama)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Create penilaian (Header Kegiatan Penilaian)
CREATE TABLE penilaian (
    id VARCHAR(36) PRIMARY KEY,
    sekolah_id VARCHAR(36) NOT NULL,
    rombel_id VARCHAR(36) NOT NULL,
    pembelajaran_id VARCHAR(36) NOT NULL,
    semester_id VARCHAR(36) NOT NULL,
    kategori_id VARCHAR(36) NOT NULL,
    nama VARCHAR(255) NOT NULL, -- Contoh: Tugas 1, UH Bab Eksponen
    tanggal DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    
    FOREIGN KEY (sekolah_id) REFERENCES sekolah(id) ON DELETE CASCADE,
    FOREIGN KEY (rombel_id) REFERENCES rombel(id) ON DELETE CASCADE,
    FOREIGN KEY (pembelajaran_id) REFERENCES pembelajaran(id) ON DELETE CASCADE,
    FOREIGN KEY (semester_id) REFERENCES semester(id) ON DELETE CASCADE,
    FOREIGN KEY (kategori_id) REFERENCES kategori_penilaian(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Create nilai_siswa (Detail Nilai per Siswa)
CREATE TABLE nilai_siswa (
    id VARCHAR(36) PRIMARY KEY,
    penilaian_id VARCHAR(36) NOT NULL,
    peserta_didik_id VARCHAR(36) NOT NULL,
    nilai DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (penilaian_id) REFERENCES penilaian(id) ON DELETE CASCADE,
    FOREIGN KEY (peserta_didik_id) REFERENCES peserta_didik(id) ON DELETE CASCADE,
    UNIQUE KEY uk_penilaian_siswa (penilaian_id, peserta_didik_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- Down
-- (Restoration logic would be complex, but for now we just drop new ones)
DROP TABLE IF EXISTS nilai_siswa;
DROP TABLE IF EXISTS penilaian;
DROP TABLE IF EXISTS kategori_penilaian;
