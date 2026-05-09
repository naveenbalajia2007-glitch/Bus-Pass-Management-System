const mysql = require('mysql2/promise');
require('dotenv').config({ path: './backend/.env' });

async function countPasses() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });

    const [rows] = await connection.query('SELECT COUNT(*) as count FROM bus_passes');
    console.log(`Total bus passes: ${rows[0].count}`);

  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    if (connection) await connection.end();
  }
}

countPasses();
