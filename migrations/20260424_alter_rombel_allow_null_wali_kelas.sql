-- Alter rombel table to allow wali_kelas_ptk_id to be NULL
ALTER TABLE rombel 
MODIFY wali_kelas_ptk_id VARCHAR(36) NULL;
