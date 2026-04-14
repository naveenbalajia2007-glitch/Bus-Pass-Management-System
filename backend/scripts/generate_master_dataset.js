const fs = require('fs');
const path = require('path');

const districts = [
    'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri', 'Dindigul', 'Erode', 
    'Kallakurichi', 'Kanchipuram', 'Kanyakumari', 'Karur', 'Krishnagiri', 'Madurai', 'Mayiladuthurai', 
    'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur', 'Pudukkottai', 'Ramanathapuram', 'Ranipet', 
    'Salem', 'Sivagangai', 'Tenkasi', 'Thanjavur', 'Theni', 'Thoothukudi', 'Tiruchirappalli', 
    'Tirunelveli', 'Tirupathur', 'Tiruppur', 'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur', 
    'Vellore', 'Viluppuram', 'Virudhunagar'
];

const types = [
    { name: 'Government Arts and Science College', type: 'college' },
    { name: 'Government Medical College', type: 'college' },
    { name: 'Government Engineering College', type: 'college' },
    { name: 'Government Polytechnic College', type: 'college' },
    { name: 'Government Law College', type: 'college' },
    { name: 'Government Agricultural College', type: 'college' },
    { name: 'Government Nursing College', type: 'college' },
    { name: 'Government Industrial Training Institute (ITI)', type: 'college' },
    { name: 'District Institute of Education and Training (DIET)', type: 'college' },
    { name: 'Government Higher Secondary School', type: 'school' },
    { name: 'Kendriya Vidyalaya (KV)', type: 'school' },
    { name: 'Jawahar Navodaya Vidyalaya (JNV)', type: 'school' },
    { name: 'Don Bosco Higher Secondary School', type: 'school' },
    { name: 'St. Joseph\'s School', type: 'school' },
    { name: 'Holy Angels Higher Secondary School', type: 'school' },
    { name: 'Little Flower Convent', type: 'school' },
    { name: 'Montfort School', type: 'school' },
    { name: 'Vidhya Mandir High School', type: 'school' },
    { name: 'Vellayan Chettiar School', type: 'school' },
    { name: 'Bharatiya Vidya Bhavan', type: 'school' }
];

const institutions = [];
const seen = new Set();

// Generate patterned institutions
districts.forEach(dist => {
    types.forEach(t => {
        const name = `${t.name}, ${dist}`;
        if (!seen.has(name)) {
            seen.add(name);
            institutions.push({ name, district: dist, type: t.type });
        }
    });

    // Add some variations for high volume
    for (let i = 1; i <= 20; i++) {
        const schoolName = `Goverment Model Higher Secondary School No.${i}, ${dist}`;
        if (!seen.has(schoolName)) {
            seen.add(schoolName);
            institutions.push({ name: schoolName, district: dist, type: 'school' });
        }
    }
});

// Add major specific ones
const majorOnes = [
    { name: 'Indian Institute of Technology (IIT) Madras', district: 'Chennai', type: 'college' },
    { name: 'Anna University (CEG)', district: 'Chennai', type: 'college' },
    { name: 'Loyola College', district: 'Chennai', type: 'college' },
    { name: 'Madras Christian College', district: 'Chennai', type: 'college' },
    { name: 'PSG College of Technology', district: 'Coimbatore', type: 'college' },
    { name: 'Amrita Vishwa Vidyapeetham', district: 'Coimbatore', type: 'college' },
    { name: 'National Institute of Technology (NIT) Trichy', district: 'Tiruchirappalli', type: 'college' },
    { name: 'SASTRA Deemed University', district: 'Thanjavur', type: 'college' },
    { name: 'SRM Institute of Science and Technology', district: 'Chengalpattu', type: 'college' },
    { name: 'VIT Chennai', district: 'Chennai', type: 'college' },
    { name: 'Stanley Medical College', district: 'Chennai', type: 'college' },
    { name: 'Madras Medical College', district: 'Chennai', type: 'college' },
    { name: 'Madura College', district: 'Madurai', type: 'college' },
    { name: 'American College', district: 'Madurai', type: 'college' },
    { name: 'Bishop Heber College', district: 'Tiruchirappalli', type: 'college' },
    { name: 'St. Joseph\'s College, Trichy', district: 'Tiruchirappalli', type: 'college' },
    { name: 'Christian Medical College (CMC) Vellore', district: 'Vellore', type: 'college' },
    { name: 'Vellore Institute of Technology (VIT)', district: 'Vellore', type: 'college' }
];

majorOnes.forEach(m => {
    if (!seen.has(m.name)) {
        seen.add(m.name);
        institutions.push(m);
    }
});

// Create Data Directory if it doesn't exist
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

fs.writeFileSync(
    path.join(dataDir, 'institutions_master.json'), 
    JSON.stringify(institutions, null, 2)
);

console.log(`Successfully generated ${institutions.length} institutions in institutions_master.json`);
