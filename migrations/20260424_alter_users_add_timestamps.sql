-- Migration: alter_users_add_timestamps_and_nullable_sekolah
-- Up
ALTER TABLE users ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE users ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Drop foreign key constraint first to modify the column
ALTER TABLE users DROP FOREIGN KEY fk_users_sekolah;
ALTER TABLE users MODIFY COLUMN sekolah_id VARCHAR(36) NULL;
ALTER TABLE users ADD CONSTRAINT fk_users_sekolah 
  FOREIGN KEY (sekolah_id) REFERENCES sekolah (id) 
  ON UPDATE CASCADE ON DELETE CASCADE;

-- Down
ALTER TABLE users DROP FOREIGN KEY fk_users_sekolah;
ALTER TABLE users MODIFY COLUMN sekolah_id VARCHAR(36) NOT NULL;
ALTER TABLE users ADD CONSTRAINT fk_users_sekolah 
  FOREIGN KEY (sekolah_id) REFERENCES sekolah (id) 
  ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE users DROP COLUMN created_at;
ALTER TABLE users DROP COLUMN updated_at;
