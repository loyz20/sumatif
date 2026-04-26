-- Migration: alter_auth_refresh_tokens_add_session_info
-- Up
ALTER TABLE auth_refresh_tokens 
ADD COLUMN ip_address VARCHAR(45) NULL AFTER token,
ADD COLUMN user_agent TEXT NULL AFTER ip_address;

-- Down
ALTER TABLE auth_refresh_tokens 
DROP COLUMN ip_address,
DROP COLUMN user_agent;
