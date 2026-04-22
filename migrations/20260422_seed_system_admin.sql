-- Migration: seed_system_admin
-- Up
INSERT INTO users (id, sekolah_id, username, password, role, ref_id)
SELECT UUID(), NULL, 'administrator', 'scrypt$administrator-salt$d561b10284fe16a1f77d814757e905747bfb47199a4fbdac3e7cff8ef4a153707ea2bf7f81d5c3cf307492edc1ac07d84637499188c9d81f87e4e44ae0f3bcd3', 'admin', NULL
WHERE NOT EXISTS (
  SELECT 1
  FROM users
  WHERE username = 'administrator'
);

-- Down
DELETE FROM users
WHERE username = 'administrator';
