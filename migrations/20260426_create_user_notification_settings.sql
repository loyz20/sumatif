-- Create table for user notification settings
CREATE TABLE IF NOT EXISTS user_notification_settings (
  user_id VARCHAR(36) NOT NULL PRIMARY KEY,
  push_notification TINYINT(1) DEFAULT 1,
  email_summary TINYINT(1) DEFAULT 0,
  important_announcement TINYINT(1) DEFAULT 1,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_user_notif_settings_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
