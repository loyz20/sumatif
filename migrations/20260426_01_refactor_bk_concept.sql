-- Migration: Refactor BK Concept
-- Create reward_siswa table
CREATE TABLE IF NOT EXISTS reward_siswa (
    id VARCHAR(36) PRIMARY KEY,
    sekolah_id VARCHAR(36) NOT NULL,
    peserta_didik_id VARCHAR(36) NOT NULL,
    nama VARCHAR(255) NOT NULL,
    poin INT DEFAULT 0,
    tanggal DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX (sekolah_id),
    INDEX (peserta_didik_id)
);

-- Rename bimbingan_konseling to konseling (optional, but let's just keep it or alias it in code)
-- For now, let's just ensure bimbingan_konseling has the right columns or create the new one if preferred.
-- The user asked for 'konseling', let's create it and migrate data if any.

CREATE TABLE IF NOT EXISTS konseling (
    id VARCHAR(36) PRIMARY KEY,
    sekolah_id VARCHAR(36) NOT NULL,
    peserta_didik_id VARCHAR(36) NOT NULL,
    guru_bk_id VARCHAR(36) NOT NULL,
    tanggal DATE NOT NULL,
    masalah TEXT NOT NULL,
    tindakan TEXT,
    catatan TEXT,
    is_private TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX (sekolah_id),
    INDEX (peserta_didik_id),
    INDEX (guru_bk_id)
);

-- If bimbingan_konseling exists, migrate data
-- INSERT INTO konseling (id, sekolah_id, peserta_didik_id, guru_bk_id, tanggal, masalah, tindakan, catatan, is_private, created_at, updated_at)
-- SELECT id, sekolah_id, peserta_didik_id, guru_id, tanggal, permasalahan, solusi, tindak_lanjut, is_confidential, created_at, updated_at
-- FROM bimbingan_konseling;

-- DROP TABLE IF EXISTS bimbingan_konseling;

-- Ensure master_pelanggaran has the right structure
-- It already has: id, sekolah_id, kategori, nama, poin, created_at, updated_at.
-- This matches the requirement.
