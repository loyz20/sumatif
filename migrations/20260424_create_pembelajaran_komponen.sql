-- Migration: create_pembelajaran_komponen
-- Store component structure per subject-class (pembelajaran)

-- Up
CREATE TABLE IF NOT EXISTS pembelajaran_komponen (
    id VARCHAR(36) PRIMARY KEY,
    sekolah_id VARCHAR(36) NOT NULL,
    pembelajaran_id VARCHAR(36) NOT NULL,
    semester_id VARCHAR(36) NOT NULL,
    
    jenis VARCHAR(50) NOT NULL,
    nama VARCHAR(100) NOT NULL,
    bobot DECIMAL(5,2) NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (sekolah_id) REFERENCES sekolah(id) ON DELETE CASCADE,
    FOREIGN KEY (pembelajaran_id) REFERENCES pembelajaran(id) ON DELETE CASCADE,
    FOREIGN KEY (semester_id) REFERENCES semester(id) ON DELETE CASCADE,
    
    -- Ensure structure is unique per name in that subject-class
    UNIQUE KEY uk_pem_smt_nama (pembelajaran_id, semester_id, nama)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Down
DROP TABLE IF EXISTS pembelajaran_komponen;
