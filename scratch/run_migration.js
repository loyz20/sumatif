const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function runMigration() {
  const fileName = process.argv[2];
  if (!fileName) {
    console.error('Usage: node run_migration.js <filename>');
    process.exit(1);
  }

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true
  });

  console.log('Connected to database.');

  const sqlPath = path.isAbsolute(fileName) ? fileName : path.join(__dirname, '../migrations', fileName);
  const sql = fs.readFileSync(sqlPath, 'utf8');

  try {
    await connection.query(sql);
    console.log(`Migration ${fileName} completed successfully.`);
  } catch (err) {
    console.error('Migration failed:', err.message);
  } finally {
    await connection.end();
  }
}

runMigration();
