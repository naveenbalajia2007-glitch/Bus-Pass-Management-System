const db = require('./backend/config/db');
async function checkUsers() {
  try {
    const [rows] = await db.query('SELECT id, full_name, email, role FROM users LIMIT 10');
    console.log(JSON.stringify(rows, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
checkUsers();
