const { pool } = require('./src/config/db');

async function checkCollation() {
  try {
    const [reward] = await pool.query("SHOW FULL COLUMNS FROM reward_siswa");
    console.log("--- reward_siswa ---");
    reward.forEach(c => console.log(`${c.Field}: ${c.Collation}`));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkCollation();
