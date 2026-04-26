-- Migration: add_guru_bk_role
-- Up
ALTER TABLE users MODIFY COLUMN role ENUM('superadmin', 'admin', 'guru', 'guru_bk', 'siswa', 'orang_tua') NOT NULL;

-- Down
-- Note: This might fail if there are active guru_bk users
-- UPDATE users SET role = 'guru' WHERE role = 'guru_bk';
ALTER TABLE users MODIFY COLUMN role ENUM('superadmin', 'admin', 'guru', 'siswa', 'orang_tua') NOT NULL;
