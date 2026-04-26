-- Add email and phone to users table
-- Up
ALTER TABLE users ADD COLUMN email VARCHAR(255) AFTER role;
ALTER TABLE users ADD COLUMN phone VARCHAR(20) AFTER email;

-- Down
ALTER TABLE users DROP COLUMN email;
ALTER TABLE users DROP COLUMN phone;
