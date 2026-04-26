CREATE TABLE IF NOT EXISTS bimbingan_konseling (
    id VARCHAR(36) PRIMARY KEY,
    sekolah_id VARCHAR(36) NOT NULL,
    peserta_didik_id VARCHAR(36) NOT NULL,
    guru_id VARCHAR(36) NOT NULL,
    
    tanggal DATE NOT NULL,
    permasalahan TEXT NOT NULL,
    solusi TEXT,
    tindak_lanjut TEXT,
    status ENUM('open', 'on-progress', 'closed') DEFAULT 'open',
    is_confidential BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (sekolah_id) REFERENCES sekolah(id) ON DELETE CASCADE,
    FOREIGN KEY (peserta_didik_id) REFERENCES peserta_didik(id) ON DELETE CASCADE,
    FOREIGN KEY (guru_id) REFERENCES ptk(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add index for performance
CREATE INDEX idx_bk_siswa ON bimbingan_konseling(sekolah_id, peserta_didik_id);
CREATE INDEX idx_bk_guru ON bimbingan_konseling(sekolah_id, guru_id);
