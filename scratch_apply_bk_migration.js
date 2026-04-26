const { pool } = require('./src/config/db');
const fs = require('fs');
const path = require('path');

async function applyMigration() {
  const migrationPath = path.join(__dirname, 'migrations', '20260426_refactor_bk_concept.sql');
  const sql = fs.readFileSync(migrationPath, 'utf8');

  // Split by semicolon but ignore inside quotes
  const statements = sql.split(/;\s*$/m);

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    for (let statement of statements) {
      if (statement.trim()) {
        await connection.query(statement);
      }
    }
    
    // Data migration if bimbingan_konseling exists
    const [tables] = await connection.query("SHOW TABLES LIKE 'bimbingan_konseling'");
    if (tables.length > 0) {
      console.log('Migrating data from bimbingan_konseling to konseling...');
      await connection.query(`
        INSERT IGNORE INTO konseling (id, sekolah_id, peserta_didik_id, guru_bk_id, tanggal, masalah, tindakan, catatan, is_private, created_at, updated_at)
        SELECT id, sekolah_id, peserta_didik_id, guru_id, tanggal, permasalahan, solusi, tindak_lanjut, is_confidential, created_at, updated_at
        FROM bimbingan_konseling
      `);
      console.log('Data migrated.');
    }

    await connection.commit();
    console.log('Migration applied successfully.');
  } catch (error) {
    await connection.rollback();
    console.error('Error applying migration:', error);
  } finally {
    connection.release();
    process.exit();
  }
}

applyMigration();
