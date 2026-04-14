const db = require('../config/db');

const verifiedInstitutions = [
    // CHENNAI
    { name: 'Loyola College', district: 'Chennai', type: 'college' },
    { name: 'Anna University (CEG)', district: 'Chennai', type: 'college' },
    { name: 'Madras Christian College', district: 'Chennai', type: 'college' },
    { name: 'Stella Maris College', district: 'Chennai', type: 'college' },
    { name: 'Indian Institute of Technology Madras (IITM)', district: 'Chennai', type: 'college' },
    { name: 'Madras Medical College', district: 'Chennai', type: 'college' },
    { name: 'Ethiraj College for Women', district: 'Chennai', type: 'college' },
    { name: 'PSBB Senior Secondary School', district: 'Chennai', type: 'school' },
    { name: 'Don Bosco Higher Secondary School', district: 'Chennai', type: 'school' },
    { name: 'Kendriya Vidyalaya CLRI', district: 'Chennai', type: 'school' },

    // COIMBATORE
    { name: 'PSG College of Technology', district: 'Coimbatore', type: 'college' },
    { name: 'Coimbatore Institute of Technology (CIT)', district: 'Coimbatore', type: 'college' },
    { name: 'Government College of Technology (GCT)', district: 'Coimbatore', type: 'college' },
    { name: 'Amrita Vishwa Vidyapeetham', district: 'Coimbatore', type: 'college' },
    { name: 'Kumaraguru College of Technology', district: 'Coimbatore', type: 'college' },
    { name: 'Stanes Higher Secondary School', district: 'Coimbatore', type: 'school' },
    { name: 'G.D. Naidu Matriculation School', district: 'Coimbatore', type: 'school' },

    // MADURAI
    { name: 'The American College', district: 'Madurai', type: 'college' },
    { name: 'Madura College', district: 'Madurai', type: 'college' },
    { name: 'Lady Doak College', district: 'Madurai', type: 'college' },
    { name: 'Thiagarajar College of Engineering', district: 'Madurai', type: 'college' },
    { name: 'Madurai Medical College', district: 'Madurai', type: 'college' },
    { name: 'Sethupathi Higher Secondary School', district: 'Madurai', type: 'school' },

    // TIRUCHIRAPPALLI (TRICHY)
    { name: 'National Institute of Technology (NIT) Trichy', district: 'Tiruchirappalli', type: 'college' },
    { name: 'St. Joseph\'s College', district: 'Tiruchirappalli', type: 'college' },
    { name: 'Bishop Heber College', district: 'Tiruchirappalli', type: 'college' },
    { name: 'Holy Cross College', district: 'Tiruchirappalli', type: 'college' },
    { name: 'RSK Higher Secondary School', district: 'Tiruchirappalli', type: 'school' },

    // SALEM
    { name: 'Government College of Engineering, Salem', district: 'Salem', type: 'college' },
    { name: 'Sona College of Technology', district: 'Salem', type: 'college' },
    { name: 'Salem Sowdeswari College', district: 'Salem', type: 'college' },
    { name: 'Cluny Girls Higher Secondary School', district: 'Salem', type: 'school' },

    // VELLORE
    { name: 'Vellore Institute of Technology (VIT)', district: 'Vellore', type: 'college' },
    { name: 'Christian Medical College (CMC)', district: 'Vellore', type: 'college' },
    { name: 'Voorhees College', district: 'Vellore', type: 'college' },
    { name: 'Auxilium Girls Higher Secondary School', district: 'Vellore', type: 'school' },

    // TIRUPPUR
    { name: 'NIFT-TEA College of Knitwear Fashion', district: 'Tiruppur', type: 'college' },
    { name: 'Angel College of Engineering and Technology', district: 'Tiruppur', type: 'college' },
    { name: 'Tiruppur Kumaran College for Women', district: 'Tiruppur', type: 'college' },

    // ERODE
    { name: 'Kongu Engineering College', district: 'Erode', type: 'college' },
    { name: 'Vellalar College for Women', district: 'Erode', type: 'college' },
    { name: 'Erode Sengunthar Engineering College', district: 'Erode', type: 'college' },

    // TIRUNELVELI
    { name: 'Government College of Engineering, Tirunelveli', district: 'Tirunelveli', type: 'college' },
    { name: 'St. Xavier\'s College', district: 'Tirunelveli', type: 'college' },
    { name: 'Sarah Tucker College', district: 'Tunelveli', type: 'college' },

    // THOOTHUKUDI
    { name: 'V.O. Chidambaram College', district: 'Thoothukudi', type: 'college' },
    { name: 'APC Mahalakshmi College for Women', district: 'Thoothukudi', type: 'college' },
    { name: 'St. Mary\'s College', district: 'Thoothukudi', type: 'college' },

    // THANJAVUR
    { name: 'SASTRA Deemed University', district: 'Thanjavur', type: 'college' },
    { name: 'Thanjavur Medical College', district: 'Thanjavur', type: 'college' },
    { name: 'Kundumani Matriculation School', district: 'Thanjavur', type: 'school' },

    // KANYAKUMARI
    { name: 'Scott Christian College', district: 'Kanyakumari', type: 'college' },
    { name: 'Holy Cross College (Autonomous)', district: 'Kanyakumari', type: 'college' },
    { name: 'S.L.B. Government Higher Secondary School', district: 'Kanyakumari', type: 'school' },

    // DINDIGUL
    { name: 'Gandhigram Rural Institute', district: 'Dindigul', type: 'college' },
    { name: 'PSNA College of Engineering and Technology', district: 'Dindigul', type: 'college' },
    { name: 'St. Mary\'s Higher Secondary School', district: 'Dindigul', type: 'school' },

    // KANCHIPURAM
    { name: 'SRM Institute of Science and Technology (Kattankulathur)', district: 'Kanchipuram', type: 'college' },
    { name: 'Meenakshi Amman Engineering College', district: 'Kanchipuram', type: 'college' },

    // CHENGALPATTU
    { name: 'Chengalpattu Medical College', district: 'Chengalpattu', type: 'college' },
    { name: 'Asan Memorial Dental College', district: 'Chengalpattu', type: 'college' },

    // Other Districts (Representative)
    { name: 'Government Arts College, Ariyalur', district: 'Ariyalur', type: 'college' },
    { name: 'Government Arts College, Dharmapuri', district: 'Dharmapuri', type: 'college' },
    { name: 'Government Polytechnic College, Kallakurichi', district: 'Kallakurichi', type: 'college' },
    { name: 'Government Arts College, Karur', district: 'Karur', type: 'college' },
    { name: 'Government Arts College, Krishnagiri', district: 'Krishnagiri', type: 'college' },
    { name: 'Government Arts College, Nagapattinam', district: 'Nagapattinam', type: 'college' },
    { name: 'Government Arts College, Namakkal', district: 'Namakkal', type: 'college' },
    { name: 'Government Arts College, Nilgiris', district: 'Nilgiris', type: 'college' },
    { name: 'Government Arts College, Perambalur', district: 'Perambalur', type: 'college' },
    { name: 'Government Arts College, Pudukkottai', district: 'Pudukkottai', type: 'college' },
    { name: 'Government Arts College, Ramanathapuram', district: 'Ramanathapuram', type: 'college' },
    { name: 'Government Arts College, Sivagangai', district: 'Sivagangai', type: 'college' },
    { name: 'Government Arts College, Theni', district: 'Theni', type: 'college' },
    { name: 'Government Arts College, Tiruvarur', district: 'Tiruvarur', type: 'college' },
    { name: 'Government Arts College, Viluppuram', district: 'Viluppuram', type: 'college' },
    { name: 'Government Arts College, Virudhunagar', district: 'Virudhunagar', type: 'college' },
    { name: 'Government Arts College, Mayiladuthurai', district: 'Mayiladuthurai', type: 'college' },
    { name: 'Government Arts College, Tenkasi', district: 'Tenkasi', type: 'college' },
    { name: 'Government Arts College, Tirupathur', district: 'Tirupathur', type: 'college' },
    { name: 'Government Arts College, Ranipet', district: 'Ranipet', type: 'college' },
];

async function seed() {
    console.log('--- Seeding Comprehensive Verified Institutional Data ---');
    try {
        await db.query('DELETE FROM institutions');
        
        const values = verifiedInstitutions.map(inst => [
            inst.name, 
            inst.type, 
            inst.district, 
            null, // Area set to NULL
            `${inst.district}, Tamil Nadu`, 
            `admin@${inst.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.edu.in`
        ]);

        await db.query(
            'INSERT INTO institutions (name, type, district, area, address, contact_email) VALUES ?',
            [values]
        );

        console.log(`✅ Success! Seeded ${verifiedInstitutions.length} verified institutions across TN.`);
        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding failed:', err);
        process.exit(1);
    }
}

seed();
