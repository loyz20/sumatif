-- Migration: alter_sekolah_add_profile_fields
-- Up
ALTER TABLE sekolah 
ADD COLUMN kepala_sekolah VARCHAR(255) NULL AFTER bujur,
ADD COLUMN akreditasi VARCHAR(10) NULL AFTER kepala_sekolah,
ADD COLUMN email VARCHAR(255) NULL AFTER akreditasi,
ADD COLUMN no_telepon VARCHAR(20) NULL AFTER email,
ADD COLUMN website VARCHAR(255) NULL AFTER no_telepon;

-- Down
ALTER TABLE sekolah 
DROP COLUMN kepala_sekolah,
DROP COLUMN akreditasi,
DROP COLUMN email,
DROP COLUMN no_telepon,
DROP COLUMN website;
