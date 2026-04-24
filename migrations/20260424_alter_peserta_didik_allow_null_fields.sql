-- Alter peserta_didik table to make optional fields nullable
ALTER TABLE peserta_didik 
MODIFY nisn VARCHAR(10) NULL,
MODIFY nik VARCHAR(16) NULL,
MODIFY jenis_kelamin ENUM('L', 'P') NULL,
MODIFY tanggal_lahir DATE NULL;
