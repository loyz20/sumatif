-- Migration: update_siswa_fields
-- Add tempat_lahir and drop nik from peserta_didik

ALTER TABLE peserta_didik ADD COLUMN tempat_lahir VARCHAR(255) AFTER nama;
ALTER TABLE peserta_didik DROP COLUMN nik;
