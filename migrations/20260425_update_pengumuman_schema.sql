ALTER TABLE pengumuman ADD COLUMN sekolah_id VARCHAR(36) AFTER id;
ALTER TABLE pengumuman ADD COLUMN target_role ENUM('all', 'guru', 'siswa', 'admin') DEFAULT 'all' AFTER type;
ALTER TABLE pengumuman ADD COLUMN is_active BOOLEAN DEFAULT TRUE AFTER target_role;

-- Add index and foreign key
CREATE INDEX idx_pengumuman_sekolah ON pengumuman(sekolah_id);
ALTER TABLE pengumuman ADD CONSTRAINT fk_pengumuman_sekolah FOREIGN KEY (sekolah_id) REFERENCES sekolah(id) ON DELETE CASCADE;

-- Clear dummy data if it doesn't have sekolah_id
DELETE FROM pengumuman;
