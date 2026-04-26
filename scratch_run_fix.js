const { pool } = require('./src/config/db');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  try {
    const sql = fs.readFileSync(path.join(__dirname, 'migrations', '20260426_fix_collation_bk.sql'), 'utf8');
    
    // Split by semicolon and run each query
    const queries = sql.split(';').filter(q => q.trim());
    
    for (let query of queries) {
      console.log(`Executing: ${query.substring(0, 50)}...`);
      await pool.query(query);
    }
    
    console.log("Migration successful!");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
}

runMigration();
