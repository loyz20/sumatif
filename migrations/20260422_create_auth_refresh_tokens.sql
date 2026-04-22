-- Migration: create_auth_refresh_tokens
-- Up
CREATE TABLE IF NOT EXISTS auth_refresh_tokens (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  token TEXT NOT NULL,
  expires_at DATETIME NOT NULL,
  revoked_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_auth_refresh_tokens_user_id (user_id),
  KEY idx_auth_refresh_tokens_token (token(255)),
  CONSTRAINT fk_auth_refresh_tokens_user
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Down
DROP TABLE IF EXISTS auth_refresh_tokens;
