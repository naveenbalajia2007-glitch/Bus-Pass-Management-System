const mysql = require('mysql2/promise');
require('dotenv').config({ path: './backend/.env' });

async function checkData() {
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

    const [routes] = await connection.query('SELECT COUNT(*) as count FROM routes WHERE is_active = 1');
    console.log(`Routes (active): ${routes[0].count}`);

    const [buses] = await connection.query('SELECT COUNT(*) as count FROM buses WHERE is_active = 1');
    console.log(`Buses (active): ${buses[0].count}`);

    const [routesSample] = await connection.query('SELECT * FROM routes LIMIT 1');
    console.log('Route Sample:', routesSample[0]);

    const [busesSample] = await connection.query('SELECT * FROM buses LIMIT 1');
    console.log('Bus Sample:', busesSample[0]);

  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    if (connection) await connection.end();
  }
}

checkData();
