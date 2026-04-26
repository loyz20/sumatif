const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function run() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        multipleStatements: true
    });

    try {
        const sql = fs.readFileSync(path.join(__dirname, '../migrations/20260425_redesign_absensi_to_jurnal.sql'), 'utf8');
        console.log('Applying 20260425_redesign_absensi_to_jurnal.sql...');
        await connection.query(sql);
        console.log('Migration successful!');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await connection.end();
    }
}

run();
