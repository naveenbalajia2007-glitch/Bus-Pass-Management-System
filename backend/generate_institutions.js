const db = require('./config/db');

const districts = [
  'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri', 'Dindigul', 'Erode', 'Kallakurichi', 'Kanchipuram', 'Kanyakumari', 'Karur', 'Krishnagiri', 'Madurai', 'Mayiladuthurai', 'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur', 'Pudukkottai', 'Ramanathapuram', 'Ranipet', 'Salem', 'Sivagangai', 'Tenkasi', 'Thanjavur', 'Theni', 'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli', 'Tirupathur', 'Tiruppur', 'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur', 'Vellore', 'Viluppuram', 'Virudhunagar'
];

const institutionTypes = [
  { prefix: 'Government Arts & Science College', type: 'college' },
  { prefix: 'College of Engineering', type: 'college' },
  { prefix: 'Institute of Medical Sciences', type: 'college' },
  { prefix: 'Polytechnic College', type: 'college' },
  { prefix: 'Higher Secondary School', type: 'school' },
  { prefix: 'Matriculation School', type: 'school' },
  { prefix: 'Public School', type: 'school' }
];

const creators = [
  'Anna', 'Jawaharlal Nehru', 'Tagore', 'Vivekananda', 'Loyola', 'Stella', 'Don Bosco', 'Evergreen', 'Apex', 'Royal', 'Ideal', 'Oxford', 'Cambridge', 'Elite', 'Zion', 'St. Marys', 'St. Josephs', 'Holy Angels', 'Sacred Heart', 'National', 'Bharathiar', 'Periyar', 'Kamarayar', 'Ambedkar'
];

async function seed() {
  console.log('--- Starting Production-Ready Data Generation (800+ Institutions) ---');
  try {
    // Clear existing institutions to prevent dupes if necessary, but IGNORE is safer
    // await db.query('TRUNCATE TABLE institutions'); 

    let totalCreated = 0;
    
    for (const district of districts) {
      console.log(`Processing ${district}...`);
      const instPerDistrict = 22 + Math.floor(Math.random() * 5); // 22-26 per district
      
      const values = [];
      for (let i = 0; i < instPerDistrict; i++) {
        const creator = creators[Math.floor(Math.random() * creators.length)];
        const instType = institutionTypes[Math.floor(Math.random() * institutionTypes.length)];
        
        const name = `${creator} ${instType.prefix}, ${district}`;
        const type = instType.type;
        const address = `${i + 10}, Main Road, ${district}, Tamil Nadu`;
        const email = `admin@${name.toLowerCase().replace(/[^a-z0-0]/g, '')}.edu.in`;
        
        values.push([name, type, district, address, email]);
      }
      
      await db.query(
        'INSERT IGNORE INTO institutions (name, type, district, address, contact_email) VALUES ?',
        [values]
      );
      totalCreated += instPerDistrict;
    }

    console.log(`✅ Success! Seeded ${totalCreated} institutions across all 38 districts.`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seed();
