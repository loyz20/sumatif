-- Migration: alter_users_allow_null_sekolah_id
-- Up
ALTER TABLE users
  MODIFY sekolah_id VARCHAR(36) NULL;

-- Down
ALTER TABLE users
  MODIFY sekolah_id VARCHAR(36) NOT NULL;
