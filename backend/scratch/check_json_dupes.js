const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'institutions_master.json'), 'utf8'));

console.log(`Total entries in institutions_master.json: ${data.length}`);

// 1. Check for exact duplicates
const exactMap = {};
const exactDupes = [];
data.forEach((item, idx) => {
  const key = `${item.name}|${item.district}|${item.type}`;
  if (!exactMap[key]) exactMap[key] = [];
  exactMap[key].push({ idx, ...item });
});

for (const [key, group] of Object.entries(exactMap)) {
  if (group.length > 1) {
    exactDupes.push(group);
  }
}
console.log(`\nExact duplicate groups in JSON: ${exactDupes.length}`);
exactDupes.forEach(g => {
  console.log(`  [${g.length}x] ${g[0].name} | ${g[0].district}`);
});

// 2. Normalize and check near-duplicates
const normalize = (s) => s.toLowerCase()
  .replace(/[''`()]/g, '')
  .replace(/[^a-z0-9 ]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const normMap = {};
data.forEach((item, idx) => {
  const key = `${normalize(item.name)}|${item.district}|${item.type}`;
  if (!normMap[key]) normMap[key] = [];
  normMap[key].push({ idx, ...item });
});

let nearDupeCount = 0;
for (const [key, group] of Object.entries(normMap)) {
  if (group.length > 1) {
    nearDupeCount++;
    console.log(`\n  Near-dupe group [${group[0].district}]:`);
    group.forEach(g => console.log(`    idx:${g.idx} => "${g.name}"`));
  }
}
console.log(`\nNear-duplicate groups in JSON: ${nearDupeCount}`);

// 3. Count by district
const distCounts = {};
data.forEach(item => {
  if (!distCounts[item.district]) distCounts[item.district] = { college: 0, school: 0 };
  distCounts[item.district][item.type]++;
});
console.log(`\nDistricts covered: ${Object.keys(distCounts).length}`);
console.log('Per-district breakdown:');
Object.entries(distCounts).sort((a, b) => a[0].localeCompare(b[0])).forEach(([d, c]) => {
  console.log(`  ${d}: ${c.college} colleges, ${c.school} schools = ${c.college + c.school} total`);
});
