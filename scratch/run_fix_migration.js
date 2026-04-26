const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function runMigration() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true
  });

  console.log('Connected to database.');

  const sqlPath = path.join(__dirname, '../migrations/20260424_fix_master_nilai_columns.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  try {
    await connection.query(sql);
    console.log('Migration completed successfully.');
  } catch (err) {
    console.error('Migration failed:', err.message);
  } finally {
    await connection.end();
  }
}

runMigration();
