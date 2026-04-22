-- Migration: alter_ptk_add_unique_indexes
-- Up
ALTER TABLE ptk
  ADD UNIQUE KEY uk_ptk_nik (nik),
  ADD UNIQUE KEY uk_ptk_nip (nip),
  ADD UNIQUE KEY uk_ptk_nuptk (nuptk);

-- Down
ALTER TABLE ptk
  DROP INDEX uk_ptk_nik,
  DROP INDEX uk_ptk_nip,
  DROP INDEX uk_ptk_nuptk;
