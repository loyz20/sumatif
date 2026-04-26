CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('info', 'success', 'warning', 'error') DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    metadata JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notifications_users
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert some dummy notifications for testing
INSERT INTO notifications (id, user_id, title, message, type, is_read, created_at) 
SELECT 
    UUID(), 
    id, 
    'Selamat Datang!', 
    'Selamat datang di sistem Sekolahku v2. Silakan lengkapi profil Anda.', 
    'success', 
    FALSE,
    NOW()
FROM users 
LIMIT 5;
