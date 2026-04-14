const db = require('./config/db');
async function check() {
  try {
    const [users] = await db.query('SELECT * FROM users');
    console.log("Users in DB:\n", JSON.stringify(users, null, 2));
    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}
check();
