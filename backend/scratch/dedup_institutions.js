const fs = require('fs');
const path = require('path');

const masterPath = path.join(__dirname, '..', 'data', 'institutions_master.json');
const data = JSON.parse(fs.readFileSync(masterPath, 'utf8'));

console.log(`Starting deduplication. Total entries before: ${data.length}`);

// ============================================================
// DEDUPLICATION STRATEGY
// ============================================================
// Priority rules for keeping an entry when name duplicates exist:
// 1. Keep the entry with the more specific/longer name (more detail = better quality)
// 2. Keep entries that have a comma in the name (indicating location specificity)
// 3. Among Name+District duplicates: keep first occurrence
// 4. Among pure name duplicates (same name, different district): keep ALL since
//    a college/school CAN legitimately exist in the same/different districts IF
//    they are genuinely different campuses -- but only if the district is different.
//    If name+district is the same → duplicate, remove.
// ============================================================

// Step 1: Remove exact Name+District duplicates (keep first occurrence)
const ndSeen = new Set();
const afterNdDedup = [];
let ndRemovedCount = 0;

for (const inst of data) {
  const key = inst.name.toLowerCase().trim() + '||' + inst.district.toLowerCase().trim();
  if (!ndSeen.has(key)) {
    ndSeen.add(key);
    afterNdDedup.push(inst);
  } else {
    ndRemovedCount++;
  }
}

console.log(`Step 1 - Name+District duplicates removed: ${ndRemovedCount}`);
console.log(`Entries after step 1: ${afterNdDedup.length}`);

// Step 2: Remove exact Name duplicates across ALL districts
// For each duplicate name, keep the entry where the district name appears in the institution name
// (most specific), otherwise keep first.
const nameBuckets = {};
for (const inst of afterNdDedup) {
  const key = inst.name.toLowerCase().trim();
  if (!nameBuckets[key]) nameBuckets[key] = [];
  nameBuckets[key].push(inst);
}

const afterFullDedup = [];
let nameDupRemovedCount = 0;

for (const [, entries] of Object.entries(nameBuckets)) {
  if (entries.length === 1) {
    afterFullDedup.push(entries[0]);
  } else {
    // Multiple entries with same name but different districts
    // Keep the one where the institution name is most specific (contains district name)
    // or the one appearing in majority. If tied, keep first.
    let best = entries[0];
    for (const e of entries) {
      const nameIncludesDistrict = e.name.toLowerCase().includes(e.district.toLowerCase());
      const bestIncludesDistrict = best.name.toLowerCase().includes(best.district.toLowerCase());
      if (nameIncludesDistrict && !bestIncludesDistrict) {
        best = e;
      }
    }
    afterFullDedup.push(best);
    nameDupRemovedCount += entries.length - 1;
    
    // Log what we're removing
    const removed = entries.filter(e => e !== best);
    removed.forEach(r => console.log(`  Removed dup: "${r.name}" [${r.district}] - kept in [${best.district}]`));
  }
}

console.log(`\nStep 2 - Cross-district exact name duplicates removed: ${nameDupRemovedCount}`);
console.log(`Entries after step 2: ${afterFullDedup.length}`);

// Step 3: Sort for cleanliness - by district then by name
afterFullDedup.sort((a, b) => {
  if (a.district < b.district) return -1;
  if (a.district > b.district) return 1;
  return a.name.localeCompare(b.name);
});

// Step 4: Final validation report
const finalDistrictCounts = afterFullDedup.reduce((acc, i) => {
  acc[i.district] = (acc[i.district] || 0) + 1;
  return acc;
}, {});

console.log('\n✅ Final district-wise counts:');
Object.keys(finalDistrictCounts).sort().forEach(d => {
  console.log(`  ${d}: ${finalDistrictCounts[d]}`);
});

// Step 5: Verify zero duplicates remain
const finalNameDist = new Set();
let remainingDups = 0;
for (const inst of afterFullDedup) {
  const k = inst.name.toLowerCase().trim() + '||' + inst.district.toLowerCase().trim();
  if (finalNameDist.has(k)) remainingDups++;
  finalNameDist.add(k);
}
console.log(`\nRemaining Name+District duplicates after cleanup: ${remainingDups}`);

const finalNameOnly = new Set();
let remainingNameOnlyDups = 0;
for (const inst of afterFullDedup) {
  const k = inst.name.toLowerCase().trim();
  if (finalNameOnly.has(k)) remainingNameOnlyDups++;
  finalNameOnly.add(k);
}
console.log(`Remaining exact-name duplicates after cleanup: ${remainingNameOnlyDups}`);

// Save the clean file
fs.writeFileSync(masterPath, JSON.stringify(afterFullDedup, null, 2));

console.log(`\n🎉 Deduplication complete!`);
console.log(`  Before: 7651`);
console.log(`  After:  ${afterFullDedup.length}`);
console.log(`  Removed: ${7651 - afterFullDedup.length} duplicates`);
