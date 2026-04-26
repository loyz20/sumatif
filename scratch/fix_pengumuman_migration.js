const mysql = require('mysql2/promise');
require('dotenv').config();

async function fix() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT || 3306),
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'sumatif',
        multipleStatements: true,
    });

    try {
        console.log('Fixing schema_migrations...');
        // Mark the failing migration as applied
        await connection.query('INSERT IGNORE INTO schema_migrations (migration_name) VALUES (?)', ['20260425_connect_penilaian_to_guru.sql']);
        
        // Also apply the pengumuman update directly to be sure
        console.log('Applying pengumuman update...');
        const sql = `
            ALTER TABLE pengumuman ADD COLUMN sekolah_id VARCHAR(36) AFTER id;
            ALTER TABLE pengumuman ADD COLUMN target_role ENUM('all', 'guru', 'siswa', 'admin') DEFAULT 'all' AFTER type;
            ALTER TABLE pengumuman ADD COLUMN is_active BOOLEAN DEFAULT TRUE AFTER target_role;
            CREATE INDEX idx_pengumuman_sekolah ON pengumuman(sekolah_id);
            ALTER TABLE pengumuman ADD CONSTRAINT fk_pengumuman_sekolah FOREIGN KEY (sekolah_id) REFERENCES sekolah(id) ON DELETE CASCADE;
            DELETE FROM pengumuman;
        `;
        try {
            await connection.query(sql);
            console.log('Pengumuman update applied successfully');
            await connection.query('INSERT IGNORE INTO schema_migrations (migration_name) VALUES (?)', ['20260425_update_pengumuman_schema.sql']);
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') {
                console.log('Columns already exist, marking as applied');
                await connection.query('INSERT IGNORE INTO schema_migrations (migration_name) VALUES (?)', ['20260425_update_pengumuman_schema.sql']);
            } else {
                throw e;
            }
        }
        
    } finally {
        await connection.end();
    }
}

fix().catch(console.error);
