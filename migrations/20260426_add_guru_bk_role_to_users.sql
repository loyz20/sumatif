-- Add guru_bk to users.role enum
ALTER TABLE users MODIFY COLUMN role ENUM('superadmin', 'admin', 'guru', 'guru_bk', 'siswa', 'orang_tua') NOT NULL;
