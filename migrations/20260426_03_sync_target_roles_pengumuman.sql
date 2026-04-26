-- Migration: Sync Target Roles for New User Roles
-- Up
ALTER TABLE pengumuman MODIFY COLUMN target_role ENUM('all', 'guru', 'guru_bk', 'siswa', 'orang_tua', 'admin') DEFAULT 'all';

-- Ensure all current pengumuman are accessible
UPDATE pengumuman SET target_role = 'all' WHERE target_role IS NULL;

-- Down
ALTER TABLE pengumuman MODIFY COLUMN target_role ENUM('all', 'guru', 'siswa', 'admin') DEFAULT 'all';
