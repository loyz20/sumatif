-- Migration: create_users
-- Up
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  sekolah_id VARCHAR(36) NOT NULL,
  username VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'guru', 'siswa', 'orang_tua') NOT NULL,
  ref_id VARCHAR(36) NULL,
  UNIQUE KEY uk_users_username (username),
  KEY idx_users_sekolah_id (sekolah_id),
  KEY idx_users_role (role),
  KEY idx_users_ref_id (ref_id),
  CONSTRAINT fk_users_sekolah
    FOREIGN KEY (sekolah_id) REFERENCES sekolah (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Down
DROP TABLE IF EXISTS users;
