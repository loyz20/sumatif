const { pool } = require('../src/config/db');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function debugPool() {
  try {
    const [rows] = await pool.query(
      `SELECT id, sekolah_id, jenis, nama, default_bobot, created_at
       FROM master_komponen_nilai
       WHERE sekolah_id = ?
       ORDER BY jenis ASC, created_at ASC`,
      ['some-id']
    );
    console.log('Pool Success:', rows.length);
  } catch (err) {
    console.error('Pool Error Message:', err.message);
    console.error('Pool Error Code:', err.code);
  } finally {
    process.exit();
  }
}

debugPool();
