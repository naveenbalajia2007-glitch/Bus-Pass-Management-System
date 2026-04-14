const db = require('./config/db');
async function checkSchema() {
  try {
    const [columns] = await db.query('SHOW COLUMNS FROM users');
    console.log("Users table schema:\n", JSON.stringify(columns, null, 2));
    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}
checkSchema();
