const db = require('./config/db');
const bcrypt = require('bcryptjs');

async function seedAdmin() {
  try {
    const email = 'admin@buspass.edu';
    const password = 'Admin@123';
    const hash = await bcrypt.hash(password, 10);
    
    console.log(`Checking if admin exists: ${email}`);
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    
    if (existing.length > 0) {
      console.log('Admin already exists. Updating password and role...');
      await db.query('UPDATE users SET password = ?, role = "admin", is_active = 1 WHERE email = ?', [hash, email]);
    } else {
      console.log('Creating new Admin user...');
      await db.query(
        'INSERT INTO users (full_name, email, phone, password, role, is_active) VALUES (?, ?, ?, ?, ?, ?)',
        ['System Admin', email, '0000000000', hash, 'admin', 1]
      );
    }
    
    console.log('✅ Admin seeding successful!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seedAdmin();
