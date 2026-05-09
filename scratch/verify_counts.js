const db = require('../backend/config/db');

async function check() {
  try {
    const [rows] = await db.query('SELECT type, COUNT(*) as count FROM institutions WHERE district = "Chennai" GROUP BY type');
    console.log('--- Chennai Institution Counts ---');
    console.table(rows);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
