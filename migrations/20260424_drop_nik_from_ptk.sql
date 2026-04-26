-- Migration: drop_nik_from_ptk
-- Up
ALTER TABLE ptk DROP INDEX uk_ptk_nik;
ALTER TABLE ptk DROP COLUMN nik;

-- Down
ALTER TABLE ptk ADD COLUMN nik VARCHAR(50) NOT NULL AFTER nama;
ALTER TABLE ptk ADD UNIQUE KEY uk_ptk_nik (nik);
