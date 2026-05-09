const db = require('./config/db');
async function check() {
  const [rows] = await db.query('SELECT COUNT(*) as cnt FROM institutions');
  console.log('Total Institutions:', rows[0].cnt);
  const [examples] = await db.query('SELECT name, district FROM institutions WHERE district = "Chennai" LIMIT 20');
  console.log('Examples in Chennai:');
  console.table(examples);
  process.exit();
}
check();
