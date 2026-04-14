const bcrypt = require('bcryptjs');
const db = require('./config/db');

async function fixPasswords() {
  console.log('--- Modernizing Passwords ---');
  try {
    const [users] = await db.query('SELECT id, email, password FROM users');
    
    for (const user of users) {
      // Check if password is already hashed (Bcrypt hashes start with $2a$ or $2b$)
      if (!user.password.startsWith('$2')) {
        console.log(`Hashing plain-text password for: ${user.email}`);
        const hashed = await bcrypt.hash(user.password, 10);
        await db.query('UPDATE users SET password = ? WHERE id = ?', [hashed, user.id]);
      }
    }

    // Specific Reset for the user's account for immediate verification
    const testEmail = 'nithyapandiyan50@gmail.com';
    const testPass  = 'Student@123';
    console.log(`\n--- Resetting Testing Account ---`);
    console.log(`Setting ${testEmail} password to: ${testPass}`);
    const testHash = await bcrypt.hash(testPass, 10);
    await db.query('UPDATE users SET password = ? WHERE email = ?', [testHash, testEmail]);

    console.log('\n✅ All passwords modernized and test account reset.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error fixing passwords:', err);
    process.exit(1);
  }
}

fixPasswords();
