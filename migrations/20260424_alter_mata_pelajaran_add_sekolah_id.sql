-- Migration: add_sekolah_id_to_mata_pelajaran
-- Up
ALTER TABLE mata_pelajaran ADD COLUMN sekolah_id VARCHAR(36) AFTER id;
ALTER TABLE mata_pelajaran ADD CONSTRAINT fk_mata_pelajaran_sekolah FOREIGN KEY (sekolah_id) REFERENCES sekolah (id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE mata_pelajaran DROP INDEX uk_mata_pelajaran_kode;
ALTER TABLE mata_pelajaran ADD UNIQUE KEY uk_mata_pelajaran_sekolah_kode (sekolah_id, kode);
ALTER TABLE mata_pelajaran ADD INDEX idx_mata_pelajaran_sekolah_id (sekolah_id);

-- Down
ALTER TABLE mata_pelajaran DROP FOREIGN KEY fk_mata_pelajaran_sekolah;
ALTER TABLE mata_pelajaran DROP COLUMN sekolah_id;
ALTER TABLE mata_pelajaran ADD UNIQUE KEY uk_mata_pelajaran_kode (kode);
