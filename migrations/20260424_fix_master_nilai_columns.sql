-- Migration: add_nama_to_master_nilai
-- Add missing 'nama' column and fix unique key

ALTER TABLE master_komponen_nilai ADD COLUMN nama VARCHAR(100) NOT NULL AFTER jenis;

-- Add new unique key (sekolah_id, nama)
ALTER TABLE master_komponen_nilai ADD UNIQUE KEY uk_sekolah_nama (sekolah_id, nama);
