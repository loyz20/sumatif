-- Migration: Perencanaan Pembelajaran (CP, TP, ATP, Modul Ajar)
-- Up

-- 1. Tabel Capaian Pembelajaran (CP) - Global per Mapel
CREATE TABLE IF NOT EXISTS cp (
    id VARCHAR(36) PRIMARY KEY,
    mapel_id VARCHAR(36) NOT NULL,
    fase ENUM('A', 'B', 'C', 'D', 'E', 'F') NOT NULL,
    deskripsi TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (mapel_id) REFERENCES mata_pelajaran(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Tabel Tujuan Pembelajaran (TP) - Milik Guru per Pembelajaran
CREATE TABLE IF NOT EXISTS tp (
    id VARCHAR(36) PRIMARY KEY,
    pembelajaran_id VARCHAR(36) NOT NULL,
    cp_id VARCHAR(36) NOT NULL,
    kode VARCHAR(20) NOT NULL, -- Contoh: TP 1.1
    deskripsi TEXT NOT NULL,
    urutan INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (pembelajaran_id) REFERENCES pembelajaran(id) ON DELETE CASCADE,
    FOREIGN KEY (cp_id) REFERENCES cp(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Tabel Alur Tujuan Pembelajaran (ATP) - Header
CREATE TABLE IF NOT EXISTS atp (
    id VARCHAR(36) PRIMARY KEY,
    pembelajaran_id VARCHAR(36) NOT NULL,
    nama VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pembelajaran_id) REFERENCES pembelajaran(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Tabel ATP Detail - Mapping TP ke Timeline
CREATE TABLE IF NOT EXISTS atp_detail (
    id VARCHAR(36) PRIMARY KEY,
    atp_id VARCHAR(36) NOT NULL,
    tp_id VARCHAR(36) NOT NULL,
    minggu_ke INT NOT NULL,
    urutan INT DEFAULT 0,
    FOREIGN KEY (atp_id) REFERENCES atp(id) ON DELETE CASCADE,
    FOREIGN KEY (tp_id) REFERENCES tp(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Tabel Modul Ajar
CREATE TABLE IF NOT EXISTS modul_ajar (
    id VARCHAR(36) PRIMARY KEY,
    tp_id VARCHAR(36) NOT NULL,
    judul VARCHAR(255) NOT NULL,
    konten_json JSON NOT NULL,
    is_generated_ai BOOLEAN DEFAULT FALSE,
    created_by VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tp_id) REFERENCES tp(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Down
DROP TABLE IF EXISTS modul_ajar;
DROP TABLE IF EXISTS atp_detail;
DROP TABLE IF EXISTS atp;
DROP TABLE IF EXISTS tp;
DROP TABLE IF EXISTS cp;
