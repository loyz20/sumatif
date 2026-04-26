const { pool } = require('./src/config/db');

async function checkSchema() {
  try {
    const [tables] = await pool.query('SHOW TABLES');
    console.log('Tables in database:', tables.map(t => Object.values(t)[0]));

    const relevantTables = ['pelanggaran', 'pelanggaran_siswa', 'pelanggaran_master', 'konseling', 'reward_siswa'];
    for (const table of relevantTables) {
      try {
        const [columns] = await pool.query(`DESCRIBE ${table}`);
        console.log(`\nColumns in ${table}:`);
        console.table(columns);
      } catch (e) {
        console.log(`\nTable ${table} does not exist.`);
      }
    }
  } catch (error) {
    console.error('Error checking schema:', error);
  } finally {
    process.exit();
  }
}

checkSchema();
