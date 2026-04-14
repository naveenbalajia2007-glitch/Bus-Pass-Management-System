const db = require('../config/db');

const realInstitutions = [
    // CHENNAI
    { name: 'Loyola College', district: 'Chennai', area: 'Nungambakkam', type: 'college' },
    { name: 'Anna University (CEG)', district: 'Chennai', area: 'Guindy', type: 'college' },
    { name: 'Madras Christian College', district: 'Chennai', area: 'Tambaram', type: 'college' },
    { name: 'Stella Maris College', district: 'Chennai', area: 'Cathedral Road', type: 'college' },
    { name: 'Indian Institute of Technology Madras (IITM)', district: 'Chennai', area: 'Adyar', type: 'college' },
    { name: 'Presidency College', district: 'Chennai', area: 'Chepauk', type: 'college' },
    { name: 'Ethiraj College for Women', district: 'Chennai', area: 'Egmore', type: 'college' },
    { name: 'Madras Medical College', district: 'Chennai', area: 'Park Town', type: 'college' },
    { name: 'Kendriya Vidyalaya CLRI', district: 'Chennai', area: 'Adyar', type: 'school' },
    { name: 'PSBB Senior Secondary School', district: 'Chennai', area: 'Nungambakkam', type: 'school' },
    { name: 'Don Bosco Higher Secondary School', district: 'Chennai', area: 'Egmore', type: 'school' },

    // COIMBATORE
    { name: 'PSG College of Technology', district: 'Coimbatore', area: 'Peelamedu', type: 'college' },
    { name: 'Coimbatore Institute of Technology (CIT)', district: 'Coimbatore', area: 'Aerodrome Post', type: 'college' },
    { name: 'Government College of Technology (GCT)', district: 'Coimbatore', area: 'Thadagam Road', type: 'college' },
    { name: 'Amrita Vishwa Vidyapeetham', district: 'Coimbatore', area: 'Ettimadai', type: 'college' },
    { name: 'Kumaraguru College of Technology', district: 'Coimbatore', area: 'Saravanampatti', type: 'college' },
    { name: 'Stanes Higher Secondary School', district: 'Coimbatore', area: 'Avinashi Road', type: 'school' },
    { name: 'G.D. Naidu Matriculation School', district: 'Coimbatore', area: 'Peelamedu', type: 'school' },

    // MADURAI
    { name: 'The American College', district: 'Madurai', area: 'Goripalayam', type: 'college' },
    { name: 'Madura College', district: 'Madurai', area: 'TVS Nagar', type: 'college' },
    { name: 'Lady Doak College', district: 'Madurai', area: 'Tallakulam', type: 'college' },
    { name: 'Thiagarajar College of Engineering (TCE)', district: 'Madurai', area: 'Thiruparankundram', type: 'college' },
    { name: 'Madurai Medical College', district: 'Madurai', area: 'Alwarpuram', type: 'college' },
    { name: 'Sethupathi Higher Secondary School', district: 'Madurai', area: 'North Veli Street', type: 'school' },

    // TRICHY (TIRUCHIRAPPALLI)
    { name: 'National Institute of Technology (NIT) Trichy', district: 'Tiruchirappalli', area: 'Thuvakudi', type: 'college' },
    { name: 'St. Joseph\'s College', district: 'Tiruchirappalli', area: 'Chatram', type: 'college' },
    { name: 'Bishop Heber College', district: 'Tiruchirappalli', area: 'Puthur', type: 'college' },
    { name: 'Holy Cross College', district: 'Tiruchirappalli', area: 'Teppakulam', type: 'college' },
    { name: 'RSK Higher Secondary School', district: 'Tiruchirappalli', area: 'BHEL Township', type: 'school' },

    // VELLORE
    { name: 'Vellore Institute of Technology (VIT)', district: 'Vellore', area: 'Katpadi', type: 'college' },
    { name: 'Christian Medical College (CMC)', district: 'Vellore', area: 'Bagayam', type: 'college' },
    { name: 'Voorhees College', district: 'Vellore', area: 'Officers Line', type: 'college' },
    { name: 'Idaya Deepam Matric School', district: 'Vellore', area: 'Sathuvachari', type: 'school' },

    // SALEM
    { name: 'Government College of Engineering', district: 'Salem', area: 'Karuppur', type: 'college' },
    { name: 'Sona College of Technology', district: 'Salem', area: 'Suramangalam', type: 'college' },
    { name: 'Salem Sowdeswari College', district: 'Salem', area: 'Kondalampatti', type: 'college' },

    // KANYAKUMARI
    { name: 'Scott Christian College', district: 'Kanyakumari', area: 'Nagercoil', type: 'college' },
    { name: 'Sree Devi Kumari Women\'s College', district: 'Kanyakumari', area: 'Kuzhithurai', type: 'college' },

    // THANJAVUR
    { name: 'SASTRA Deemed University', district: 'Thanjavur', area: 'Thirumalaisamudram', type: 'college' },
    { name: 'Thanjavur Medical College', district: 'Thanjavur', area: 'Medical College Road', type: 'college' },
    { name: 'Bon Secours College for Women', district: 'Thanjavur', area: 'Vilar Bypass', type: 'college' }
];

async function seed() {
    console.log('--- Seeding Verified Institutional Data ---');
    try {
        // Clear existing mock data first to keep it clean
        await db.query('DELETE FROM institutions');
        
        const values = realInstitutions.map(inst => [
            inst.name, 
            inst.type, 
            inst.district, 
            inst.area, 
            inst.address || `${inst.area}, ${inst.district}`, 
            `admin@${inst.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.edu.in`
        ]);

        await db.query(
            'INSERT INTO institutions (name, type, district, area, address, contact_email) VALUES ?',
            [values]
        );

        console.log(`✅ Success! Seeded ${realInstitutions.length} verified institutions.`);
        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding failed:', err);
        process.exit(1);
    }
}

seed();
