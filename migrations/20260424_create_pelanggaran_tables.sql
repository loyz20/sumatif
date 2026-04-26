-- Master types of violations
CREATE TABLE IF NOT EXISTS master_pelanggaran (
    id VARCHAR(36) PRIMARY KEY,
    sekolah_id VARCHAR(36) NOT NULL,
    kategori ENUM('Kedisiplinan', 'Kerapihan', 'Etika', 'Berat') NOT NULL,
    nama VARCHAR(255) NOT NULL,
    poin INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (sekolah_id) REFERENCES sekolah(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Records of student violations
CREATE TABLE IF NOT EXISTS pelanggaran_siswa (
    id VARCHAR(36) PRIMARY KEY,
    sekolah_id VARCHAR(36) NOT NULL,
    peserta_didik_id VARCHAR(36) NOT NULL,
    master_pelanggaran_id VARCHAR(36) NOT NULL,
    tanggal DATE NOT NULL,
    catatan TEXT,
    poin_snapshot INT NOT NULL, -- Keep points at time of violation
    created_by VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (sekolah_id) REFERENCES sekolah(id),
    FOREIGN KEY (peserta_didik_id) REFERENCES peserta_didik(id),
    FOREIGN KEY (master_pelanggaran_id) REFERENCES master_pelanggaran(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
