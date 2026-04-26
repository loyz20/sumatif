-- Migration: create_jadwal_pembelajaran
-- Implementation of instructional schedule module

CREATE TABLE IF NOT EXISTS jadwal_pembelajaran (
    id VARCHAR(36) PRIMARY KEY,
    sekolah_id VARCHAR(36) NOT NULL,
    pembelajaran_id VARCHAR(36) NOT NULL,
    hari ENUM('Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu') NOT NULL,
    jam_mulai TIME NOT NULL,
    jam_selesai TIME NOT NULL,
    ruangan VARCHAR(100),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (sekolah_id) REFERENCES sekolah(id) ON DELETE CASCADE,
    FOREIGN KEY (pembelajaran_id) REFERENCES pembelajaran(id) ON DELETE CASCADE,
    
    -- Index for faster lookup
    INDEX idx_sekolah_pem (sekolah_id, pembelajaran_id),
    INDEX idx_hari (hari)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
