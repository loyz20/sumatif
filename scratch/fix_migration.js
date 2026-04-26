const { pool } = require('../src/config/db');

async function fix() {
    try {
        console.log('Checking columns...');
        const [cols] = await pool.query('SHOW COLUMNS FROM kategori_penilaian');
        const hasPtkId = cols.some(c => c.Field === 'ptk_id');

        if (!hasPtkId) {
            console.log('Adding ptk_id...');
            await pool.query('ALTER TABLE kategori_penilaian ADD COLUMN ptk_id VARCHAR(36) AFTER sekolah_id');
        } else {
            console.log('ptk_id already exists.');
        }

        console.log('Creating index idx_kategori_sekolah...');
        try {
            await pool.query('CREATE INDEX idx_kategori_sekolah ON kategori_penilaian(sekolah_id)');
        } catch (e) {
            console.log('Index idx_kategori_sekolah might already exist or failed:', e.message);
        }

        console.log('Dropping index uk_sekolah_kategori...');
        try {
            await pool.query('ALTER TABLE kategori_penilaian DROP INDEX uk_sekolah_kategori');
        } catch (e) {
            console.log('Index uk_sekolah_kategori might already be gone:', e.message);
        }

        console.log('Adding unique index uk_ptk_kategori...');
        try {
            await pool.query('ALTER TABLE kategori_penilaian ADD UNIQUE KEY uk_ptk_kategori (ptk_id, nama)');
        } catch (e) {
            console.log('Index uk_ptk_kategori might already exist:', e.message);
        }

        console.log('Adding foreign key fk_kategori_ptk...');
        try {
            await pool.query('ALTER TABLE kategori_penilaian ADD CONSTRAINT fk_kategori_ptk FOREIGN KEY (ptk_id) REFERENCES ptk(id) ON DELETE CASCADE');
        } catch (e) {
            console.log('FK fk_kategori_ptk might already exist:', e.message);
        }

        console.log('Migration fix completed.');
        process.exit(0);
    } catch (error) {
        console.error('Error fixing migration:', error);
        process.exit(1);
    }
}

fix();
