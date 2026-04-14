const db = require('./config/db');

async function checkSchema() {
  try {
    console.log('--- Checking users table schema ---');
    const [columns] = await db.query('SHOW COLUMNS FROM users');
    console.table(columns);
    
    console.log('\n--- Checking institutions table count ---');
    const [count] = await db.query('SELECT COUNT(*) as count FROM institutions');
    console.log('Total institutions:', count[0].count);
    
    const [sample] = await db.query('SELECT * FROM institutions LIMIT 5');
    console.log('\n--- Sample institutions ---');
    console.table(sample);
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

checkSchema();
