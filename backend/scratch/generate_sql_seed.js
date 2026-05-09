const db = require('./config/db');
const fs = require('fs');
const path = require('path');

async function main() {
  try {
    const [rows] = await db.query('SELECT name, district, type FROM institutions');
    console.log(`Generating SQL for ${rows.length} records...`);
    
    let sql = 'INSERT INTO institutions (name, district, type) VALUES\n';
    sql += rows.map(r => `('${r.name.replace(/'/g, "''")}', '${r.district}', '${r.type}')`).join(',\n');
    sql += ';';

    fs.writeFileSync('institutions_seed.sql', sql);
    console.log('✅ Institutions seed SQL written to institutions_seed.sql');
    process.exit(0);
  } catch (err) {
    console.error('❌ FAILED:', err);
    process.exit(1);
  }
}

main();
