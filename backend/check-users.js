const db = require('./config/db');
db.query('SELECT id, full_name, email, role, is_active, password FROM users LIMIT 10')
  .then(([rows]) => {
    console.table(rows);
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
