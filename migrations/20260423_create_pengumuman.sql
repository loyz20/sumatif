CREATE TABLE IF NOT EXISTS pengumuman (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    type ENUM('info', 'warning', 'success', 'danger') DEFAULT 'info',
    created_by VARCHAR(36) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pengumuman_users
      FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert some dummy announcements
INSERT INTO pengumuman (id, title, content, type, created_at) VALUES
(UUID(), 'Jadwal Ujian Akhir Semester', 'Ujian akan dilaksanakan mulai tanggal 15 bulan depan. Harap persiapkan diri dengan baik.', 'success', DATE_SUB(NOW(), INTERVAL 2 HOUR)),
(UUID(), 'Rapat Orang Tua Murid', 'Mengundang seluruh orang tua/wali murid untuk hadir dalam rapat sosialisasi kurikulum baru.', 'info', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(UUID(), 'Pembaruan Sistem', 'Pemeliharaan server e-learning akan dilakukan pada akhir pekan ini selama 2 jam.', 'warning', DATE_SUB(NOW(), INTERVAL 3 DAY));
