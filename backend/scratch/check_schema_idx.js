const mysql = require('mysql2/promise');
require('dotenv').config({ path: './backend/.env' });

async function checkSchema() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });

    console.log('✅ Connected to database');

    const [busPassesCols] = await connection.query('SHOW COLUMNS FROM bus_passes');
    console.log('bus_passes columns:', busPassesCols.map(c => c.Field));

    const [busPassesIndexes] = await connection.query('SHOW INDEX FROM bus_passes');
    console.log('bus_passes indexes:', busPassesIndexes.map(i => i.Column_name));

    const [busesIndexes] = await connection.query('SHOW INDEX FROM buses');
    console.log('buses indexes:', busesIndexes.map(i => i.Column_name));

    const [routesIndexes] = await connection.query('SHOW INDEX FROM routes');
    console.log('routes indexes:', routesIndexes.map(i => i.Column_name));

  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    if (connection) await connection.end();
  }
}

checkSchema();
