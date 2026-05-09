const db = require('../config/db');
const fs = require('fs');
const path = require('path');

async function analyze() {
  const masterData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'institutions_master.json'), 'utf8'));
  const [dbRows] = await db.query('SELECT id, name, district, type FROM institutions ORDER BY district, name');
  
  console.log(`DB records: ${dbRows.length}`);
  console.log(`JSON master records: ${masterData.length}`);

  // Build sets for comparison
  const jsonSet = new Set(masterData.map(i => `${i.name}|${i.district}|${i.type}`));
  const dbSet = new Set(dbRows.map(i => `${i.name}|${i.district}|${i.type}`));

  // What's in DB but not in JSON
  const dbOnly = dbRows.filter(r => !jsonSet.has(`${r.name}|${r.district}|${r.type}`));
  console.log(`\nIn DB but NOT in master JSON: ${dbOnly.length}`);
  
  // Sample some
  console.log('\nSample DB-only entries (first 30):');
  dbOnly.slice(0, 30).forEach(r => console.log(`  ID:${r.id} | ${r.name} | ${r.district} | ${r.type}`));

  // What's in JSON but not in DB
  const jsonOnly = masterData.filter(r => !dbSet.has(`${r.name}|${r.district}|${r.type}`));
  console.log(`\nIn master JSON but NOT in DB: ${jsonOnly.length}`);
  jsonOnly.slice(0, 10).forEach(r => console.log(`  ${r.name} | ${r.district} | ${r.type}`));

  // Check if there are users referencing institutions
  const [userRefs] = await db.query('SELECT DISTINCT institution_id FROM users WHERE institution_id IS NOT NULL');
  console.log(`\nUsers referencing institution IDs: ${userRefs.length}`);
  for (const ref of userRefs) {
    const [inst] = await db.query('SELECT id, name, district FROM institutions WHERE id = ?', [ref.institution_id]);
    if (inst.length) {
      console.log(`  User refs ID:${ref.institution_id} => "${inst[0].name}" (${inst[0].district})`);
    } else {
      console.log(`  User refs ID:${ref.institution_id} => NOT FOUND (orphan!)`);
    }
  }

  // Check routes referencing institutions
  const [routeRefs] = await db.query('SELECT DISTINCT institution_id FROM routes WHERE institution_id IS NOT NULL LIMIT 20');
  console.log(`\nRoutes referencing institution IDs: ${routeRefs.length}+`);

  process.exit(0);
}

analyze().catch(e => { console.error(e); process.exit(1); });
