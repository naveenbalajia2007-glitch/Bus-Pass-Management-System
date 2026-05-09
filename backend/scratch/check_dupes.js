const db = require('../config/db');

async function check() {
  try {
    // 1. Total count
    const [count] = await db.query('SELECT COUNT(*) as c FROM institutions');
    console.log('Total institutions:', count[0].c);

    // 2. Show table schema
    const [schema] = await db.query('DESCRIBE institutions');
    console.log('\nSchema:');
    schema.forEach(c => console.log(`  ${c.Field} ${c.Type} ${c.Key}`));

    // 3. Check for exact duplicates (same name, district, type)
    const [exactDupes] = await db.query(
      'SELECT name, district, type, COUNT(*) as cnt FROM institutions GROUP BY name, district, type HAVING cnt > 1 ORDER BY cnt DESC LIMIT 30'
    );
    console.log('\nExact duplicates (same name+district+type):', exactDupes.length);
    exactDupes.forEach(d => console.log(`  [${d.cnt}x] ${d.name} | ${d.district} | ${d.type}`));

    // 4. Check for near-duplicates: same simplified name in same district
    // Normalize: lowercase, remove punctuation, trim
    const [all] = await db.query('SELECT id, name, district, type FROM institutions ORDER BY district, name');
    
    const normalize = (s) => s.toLowerCase()
      .replace(/[''`]/g, '')
      .replace(/[^a-z0-9 ]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Group by district  
    const byDistrict = {};
    all.forEach(r => {
      if (!byDistrict[r.district]) byDistrict[r.district] = [];
      byDistrict[r.district].push({ ...r, norm: normalize(r.name) });
    });

    console.log('\n--- Near-duplicates (normalized name matches within same district) ---');
    let nearDupeCount = 0;
    for (const [dist, insts] of Object.entries(byDistrict)) {
      const seen = {};
      for (const inst of insts) {
        const key = `${inst.norm}|${inst.type}`;
        if (!seen[key]) seen[key] = [];
        seen[key].push(inst);
      }
      for (const [key, group] of Object.entries(seen)) {
        if (group.length > 1) {
          nearDupeCount++;
          console.log(`\n  [${dist}] ${group.length} entries:`);
          group.forEach(g => console.log(`    ID:${g.id} => "${g.name}" (${g.type})`));
        }
      }
    }
    console.log(`\nTotal near-duplicate groups: ${nearDupeCount}`);

    // 5. Check for semantic duplicates across similar institution name patterns
    console.log('\n--- Checking cross-pattern semantic duplicates ---');
    // e.g. "Loyola College" vs "Loyola College, Nungambakkam" vs "Loyola College (Autonomous)"
    const normNoLoc = (s) => normalize(s)
      .replace(/\b(autonomous|nungambakkam|egmore|adyar|mylapore|park town|royapettah|ramapuram|anna nagar|tambaram|chromepet|porur|velachery|sholinganallur|ambattur|perambur|santhome|george town|kodambakkam|kilpauk|guindy|teynampet|vepery|cathedral road|chepauk|ceg|ac tech|sap)\b/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    let semDupeCount = 0;
    for (const [dist, insts] of Object.entries(byDistrict)) {
      const seen = {};
      for (const inst of insts) {
        const key = `${normNoLoc(inst.name)}|${inst.type}`;
        if (!seen[key]) seen[key] = [];
        seen[key].push(inst);
      }
      for (const [key, group] of Object.entries(seen)) {
        if (group.length > 1) {
          semDupeCount++;
          console.log(`\n  [${dist}] Semantic group (${group.length}):`);
          group.forEach(g => console.log(`    ID:${g.id} => "${g.name}"`));
        }
      }
    }
    console.log(`\nTotal semantic duplicate groups: ${semDupeCount}`);

    // 6. Check for uniqueness constraints
    const [indexes] = await db.query('SHOW INDEX FROM institutions');
    console.log('\nIndexes:');
    indexes.forEach(i => console.log(`  ${i.Key_name} | ${i.Column_name} | Unique:${!i.Non_unique}`));

    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

check();
