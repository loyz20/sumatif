-- Migration: alter_users_add_superadmin_role
-- Up
ALTER TABLE users MODIFY COLUMN role ENUM('superadmin', 'admin', 'guru', 'siswa', 'orang_tua') NOT NULL;

UPDATE users SET role = 'superadmin' WHERE role = 'admin' AND sekolah_id IS NULL;

-- Down
UPDATE users SET role = 'admin' WHERE role = 'superadmin';
ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'guru', 'siswa', 'orang_tua') NOT NULL;
