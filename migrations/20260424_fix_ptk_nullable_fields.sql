-- Migration: fix_ptk_nullable_fields
-- Up
ALTER TABLE ptk MODIFY nuptk VARCHAR(50) NULL;
ALTER TABLE ptk MODIFY jenis_kelamin VARCHAR(20) NULL;
ALTER TABLE ptk MODIFY tanggal_lahir DATE NULL;
ALTER TABLE ptk MODIFY pendidikan_terakhir VARCHAR(100) NULL;

-- Down
-- (Optional: restore to NOT NULL if needed, but usually we want them nullable now)
ALTER TABLE ptk MODIFY nuptk VARCHAR(50) NOT NULL;
ALTER TABLE ptk MODIFY jenis_kelamin VARCHAR(20) NOT NULL;
ALTER TABLE ptk MODIFY tanggal_lahir DATE NOT NULL;
ALTER TABLE ptk MODIFY pendidikan_terakhir VARCHAR(100) NOT NULL;
