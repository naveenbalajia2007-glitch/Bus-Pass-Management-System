const db = require('./config/db');
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    const hash = await bcrypt.hash('Student@123', 10);
    await db.query(`
      INSERT IGNORE INTO users (full_name, email, phone, password, role, is_active, student_type, institution_id, roll_number, year_of_study)
      VALUES ('Arun Kumar', 'arun@student.edu', '9876543210', ?, 'student', 1, 'college', 37, '123456789', '1st Year')
    `, [hash]);
    console.log("Seeded arun@student.edu");
    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}
seed();
