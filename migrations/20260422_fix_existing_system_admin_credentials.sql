-- Migration: fix_existing_system_admin_credentials
-- Up
UPDATE users
SET username = 'administrator',
    password = 'scrypt$administrator-salt$d561b10284fe16a1f77d814757e905747bfb47199a4fbdac3e7cff8ef4a153707ea2bf7f81d5c3cf307492edc1ac07d84637499188c9d81f87e4e44ae0f3bcd3',
    role = 'admin',
    ref_id = NULL
WHERE username IN ('system-admin', 'admin', 'administrator');

-- Down
UPDATE users
SET username = 'system-admin'
WHERE username = 'administrator';
