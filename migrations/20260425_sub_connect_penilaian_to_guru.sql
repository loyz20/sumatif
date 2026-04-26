-- Add ptk_id to kategori_penilaian
ALTER TABLE kategori_penilaian 
ADD COLUMN ptk_id VARCHAR(36) AFTER sekolah_id;

-- Add foreign key constraint for PTK
ALTER TABLE kategori_penilaian
ADD CONSTRAINT fk_kategori_ptk FOREIGN KEY (ptk_id) REFERENCES ptk(id) ON DELETE CASCADE;

-- Create an index for sekolah_id first so we can drop the unique index
CREATE INDEX idx_kategori_sekolah ON kategori_penilaian(sekolah_id);

-- Now safe to drop and recreate unique constraint
ALTER TABLE kategori_penilaian
DROP INDEX uk_sekolah_kategori,
ADD UNIQUE KEY uk_ptk_kategori (ptk_id, nama);
