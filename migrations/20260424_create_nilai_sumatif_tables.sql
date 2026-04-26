-- Migration: create_nilai_sumatif_tables
-- Implementation of SaaS-ready assessment module

SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS master_komponen_nilai (
    id VARCHAR(36) PRIMARY KEY,
    sekolah_id VARCHAR(36) NOT NULL,
    jenis VARCHAR(50) NOT NULL,
    default_bobot DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sekolah_id) REFERENCES sekolah(id) ON DELETE CASCADE,
    UNIQUE KEY (sekolah_id, jenis)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS nilai_sumatif (
    id VARCHAR(36) PRIMARY KEY,
    sekolah_id VARCHAR(36) NOT NULL,
    peserta_didik_id VARCHAR(36) NOT NULL,
    rombel_id VARCHAR(36) NOT NULL,
    pembelajaran_id VARCHAR(36) NOT NULL,
    semester_id VARCHAR(36) NOT NULL,
    
    nilai_akhir DECIMAL(5,2) DEFAULT 0,
    predikat VARCHAR(5) DEFAULT '',
    deskripsi TEXT,
    
    -- Snapshots for report integrity
    nama_mapel_snapshot VARCHAR(255),
    nama_guru_snapshot VARCHAR(255),
    
    status ENUM('draft', 'final') DEFAULT 'draft',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36),
    
    FOREIGN KEY (sekolah_id) REFERENCES sekolah(id) ON DELETE CASCADE,
    FOREIGN KEY (peserta_didik_id) REFERENCES peserta_didik(id) ON DELETE CASCADE,
    FOREIGN KEY (rombel_id) REFERENCES rombel(id) ON DELETE CASCADE,
    FOREIGN KEY (pembelajaran_id) REFERENCES pembelajaran(id) ON DELETE CASCADE,
    FOREIGN KEY (semester_id) REFERENCES semester(id) ON DELETE CASCADE,
    
    -- Anti-duplicate constraint per student/subject/semester
    UNIQUE KEY uk_siswa_mapel_smt (sekolah_id, peserta_didik_id, pembelajaran_id, semester_id),
    
    -- Optimasi query rapor
    INDEX idx_school_rombel (sekolah_id, rombel_id),
    INDEX idx_school_siswa (sekolah_id, peserta_didik_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS komponen_nilai (
    id VARCHAR(36) PRIMARY KEY,
    sekolah_id VARCHAR(36) NOT NULL,
    nilai_sumatif_id VARCHAR(36) NOT NULL,
    
    jenis VARCHAR(50) NOT NULL,
    nama VARCHAR(100) NOT NULL,
    bobot DECIMAL(5,2) NOT NULL,
    nilai DECIMAL(5,2) NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (sekolah_id) REFERENCES sekolah(id) ON DELETE CASCADE,
    FOREIGN KEY (nilai_sumatif_id) REFERENCES nilai_sumatif(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
