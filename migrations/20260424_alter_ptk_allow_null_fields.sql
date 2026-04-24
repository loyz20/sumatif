-- Alter ptk table to make optional fields nullable
ALTER TABLE ptk 
MODIFY nik VARCHAR(16) NULL,
MODIFY nuptk VARCHAR(16) NULL,
MODIFY jenis_kelamin ENUM('L', 'P') NULL,
MODIFY tanggal_lahir DATE NULL,
MODIFY pendidikan_terakhir VARCHAR(50) NULL;
