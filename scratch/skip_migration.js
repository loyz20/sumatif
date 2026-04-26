const mysql = require('mysql2/promise');
require('dotenv').config();

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sumatif',
  });

  try {
    const fileName = '20260424_fix_master_nilai_columns.sql';
    await connection.query(
      'INSERT IGNORE INTO schema_migrations (migration_name) VALUES (?)',
      [fileName]
    );
    console.log(`Marked ${fileName} as applied.`);
  } catch (error) {
    console.error(error);
  } finally {
    await connection.end();
  }
}

main();
