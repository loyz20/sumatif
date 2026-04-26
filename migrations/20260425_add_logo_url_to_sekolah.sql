-- Add logo_url to sekolah table
-- Up
ALTER TABLE sekolah ADD COLUMN logo_url VARCHAR(255) AFTER npsn;

-- Down
ALTER TABLE sekolah DROP COLUMN logo_url;
