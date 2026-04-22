const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

const direction = (process.argv[2] || 'up').toLowerCase();
const migrationsDir = path.resolve(__dirname, '..', 'migrations');
const migrationOrder = [
  '20260422_create_sekolah.sql',
  '20260422_create_tahun_ajaran_semester.sql',
  '20260422_create_ptk.sql',
  '20260422_create_peserta_didik_registrasi.sql',
  '20260422_create_rombel_anggota_rombel.sql',
  '20260422_create_mata_pelajaran_pembelajaran.sql',
  '20260422_create_users.sql',
  '20260422_alter_users_allow_null_sekolah_id.sql',
  '20260422_seed_system_admin.sql',
  '20260422_update_system_admin_username_password.sql',
  '20260422_create_auth_refresh_tokens.sql',
  '20260422_fix_existing_system_admin_credentials.sql',
  '20260422_alter_ptk_add_unique_indexes.sql',
];

function getConnectionConfig() {
  return {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sumatif',
    multipleStatements: true,
  };
}

function splitMigrationSections(sql) {
  const upMarker = /^\s*--\s*Up\s*$/im;
  const downMarker = /^\s*--\s*Down\s*$/im;
  const upMatch = sql.match(upMarker);
  const downMatch = sql.match(downMarker);

  if (!upMatch || !downMatch) {
    return {
      up: sql.trim(),
      down: '',
    };
  }

  return {
    up: sql.slice(upMatch.index + upMatch[0].length, downMatch.index).trim(),
    down: sql.slice(downMatch.index + downMatch[0].length).trim(),
  };
}

async function ensureMigrationsTable(connection) {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      migration_name VARCHAR(255) NOT NULL PRIMARY KEY,
      applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

async function getAppliedMigrations(connection) {
  const [rows] = await connection.query(
    'SELECT migration_name FROM schema_migrations ORDER BY migration_name ASC'
  );
  return new Set(rows.map((row) => row.migration_name));
}

function getMigrationFiles() {
  const files = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith('.sql'));

  const orderMap = new Map(migrationOrder.map((fileName, index) => [fileName, index]));

  return files.sort((left, right) => {
    const leftOrder = orderMap.has(left) ? orderMap.get(left) : Number.MAX_SAFE_INTEGER;
    const rightOrder = orderMap.has(right) ? orderMap.get(right) : Number.MAX_SAFE_INTEGER;

    if (leftOrder !== rightOrder) {
      return leftOrder - rightOrder;
    }

    return left.localeCompare(right);
  });
}

async function runUp() {
  const connection = await mysql.createConnection(getConnectionConfig());
  try {
    await ensureMigrationsTable(connection);
    const appliedMigrations = await getAppliedMigrations(connection);
    const migrationFiles = getMigrationFiles();

    for (const fileName of migrationFiles) {
      if (appliedMigrations.has(fileName)) {
        continue;
      }

      const filePath = path.join(migrationsDir, fileName);
      const sql = fs.readFileSync(filePath, 'utf8');
      const { up } = splitMigrationSections(sql);

      if (!up) {
        console.log(`Skipping ${fileName}: no -- Up section found.`);
        continue;
      }

      await connection.query('START TRANSACTION');
      try {
        await connection.query(up);
        await connection.query(
          'INSERT INTO schema_migrations (migration_name) VALUES (?)',
          [fileName]
        );
        await connection.query('COMMIT');
        console.log(`Applied ${fileName}`);
      } catch (error) {
        await connection.query('ROLLBACK');
        throw error;
      }
    }
  } finally {
    await connection.end();
  }
}

async function runDown() {
  const connection = await mysql.createConnection(getConnectionConfig());
  try {
    await ensureMigrationsTable(connection);
    const [rows] = await connection.query(
      'SELECT migration_name FROM schema_migrations ORDER BY applied_at DESC, migration_name DESC LIMIT 1'
    );

    if (!rows.length) {
      console.log('No applied migrations found.');
      return;
    }

    const fileName = rows[0].migration_name;
    const filePath = path.join(migrationsDir, fileName);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Migration file not found: ${fileName}`);
    }

    const sql = fs.readFileSync(filePath, 'utf8');
    const { down } = splitMigrationSections(sql);

    if (!down) {
      throw new Error(`Migration ${fileName} does not define a -- Down section.`);
    }

    await connection.query('START TRANSACTION');
    try {
      await connection.query(down);
      await connection.query('DELETE FROM schema_migrations WHERE migration_name = ?', [fileName]);
      await connection.query('COMMIT');
      console.log(`Reverted ${fileName}`);
    } catch (error) {
      await connection.query('ROLLBACK');
      throw error;
    }
  } finally {
    await connection.end();
  }
}

async function main() {
  try {
    if (direction === 'down') {
      await runDown();
      return;
    }

    await runUp();
  } catch (error) {
    console.error('Migration failed:');
    console.error(error.message);
    process.exitCode = 1;
  }
}

main();
