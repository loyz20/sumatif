const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function debugQuery() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  const sekolahId = 'some-id';
  try {
    const [rows] = await connection.query(
      `SELECT id, sekolah_id, jenis, nama, default_bobot, created_at
       FROM master_komponen_nilai
       WHERE sekolah_id = ?
       ORDER BY jenis ASC, created_at ASC`,
      [sekolahId]
    );
    console.log('Success!', rows.length);
  } catch (err) {
    console.error('Error Code:', err.code);
    console.error('Error Message:', err.message);
  } finally {
    await connection.end();
  }
}

debugQuery();
