const db = require('../config/db');

const productionInstitutions = [
    // 1. ARIYALUR
    { name: 'Government Arts College, Ariyalur', district: 'Ariyalur', type: 'college' },
    { name: 'Government Medical College, Ariyalur', district: 'Ariyalur', type: 'college' },
    { name: 'Meenakshi Ramasamy Engineering College', district: 'Ariyalur', type: 'college' },
    { name: 'Nirmala Matriculation Higher Secondary School', district: 'Ariyalur', type: 'school' },
    { name: 'Government Higher Secondary School, Ariyalur', district: 'Ariyalur', type: 'school' },

    // 2. CHENGALPATTU
    { name: 'Chengalpattu Medical College', district: 'Chengalpattu', type: 'college' },
    { name: 'SRM Institute of Science and Technology (Kattankulathur)', district: 'Chengalpattu', type: 'college' },
    { name: 'SRM University (Kattankulathur)', district: 'Chengalpattu', type: 'college' },
    { name: 'Valliammai Engineering College', district: 'Chengalpattu', type: 'college' },
    { name: 'St. Joseph\'s Institute of Technology', district: 'Chengalpattu', type: 'college' },
    { name: 'St. Mary\'s Matriculation Higher Secondary School', district: 'Chengalpattu', type: 'school' },

    // 3. CHENNAI
    { name: 'Indian Institute of Technology Madras (IITM)', district: 'Chennai', type: 'college' },
    { name: 'Anna University (CEG, AC Tech, SAP)', district: 'Chennai', type: 'college' },
    { name: 'Madras Medical College (MMC)', district: 'Chennai', type: 'college' },
    { name: 'Stanley Medical College', district: 'Chennai', type: 'college' },
    { name: 'Madras Christian College (MCC)', district: 'Chennai', type: 'college' },
    { name: 'Loyola College', district: 'Chennai', type: 'college' },
    { name: 'Ethiraj College for Women', district: 'Chennai', type: 'college' },
    { name: 'Presidency College', district: 'Chennai', type: 'college' },
    { name: 'Stella Maris College', district: 'Chennai', type: 'college' },
    { name: 'Women\'s Christian College (WCC)', district: 'Chennai', type: 'college' },
    { name: 'DG Vaishnav College', district: 'Chennai', type: 'college' },
    { name: 'Justice Basheer Ahmed Sayeed College (SIET)', district: 'Chennai', type: 'college' },
    { name: 'VIT Chennai', district: 'Chennai', type: 'college' },
    { name: 'SSN College of Engineering', district: 'Chennai', type: 'college' },
    { name: 'B.S. Abdur Rahman Crescent Institute of Science and Technology', district: 'Chennai', type: 'college' },
    { name: 'Sathyabama Institute of Science and Technology', district: 'Chennai', type: 'college' },
    { name: 'Saveetha Institute of Medical and Technical Sciences', district: 'Chennai', type: 'college' },
    { name: 'Meenakshi College for Women', district: 'Chennai', type: 'college' },
    { name: 'The New College (Autonomous)', district: 'Chennai', type: 'college' },
    { name: 'Dr. Ambedkar Government Arts College', district: 'Chennai', type: 'college' },
    { name: 'Dr. M.G.R. Educational and Research Institute', district: 'Chennai', type: 'college' },
    { name: 'Easwari Engineering College', district: 'Chennai', type: 'college' },
    { name: 'SRM Institute of Science and Technology (Ramapuram)', district: 'Chennai', type: 'college' },
    { name: 'St. Peter\'s Institute of Higher Education and Research', district: 'Chennai', type: 'college' },
    { name: 'Don Bosco Higher Secondary School (Egmore)', district: 'Chennai', type: 'school' },
    { name: 'PSBB Senior Secondary School', district: 'Chennai', type: 'school' },
    { name: 'DAV Boys Senior Secondary School (Gopalapuram)', district: 'Chennai', type: 'school' },
    { name: 'National Public School', district: 'Chennai', type: 'school' },
    { name: 'St. Bede\'s Anglo Indian Higher Secondary School', district: 'Chennai', type: 'school' },
    { name: 'SBOA School and Junior College', district: 'Chennai', type: 'school' },
    { name: 'The Hindu Higher Secondary School', district: 'Chennai', type: 'school' },
    { name: 'Lady Andal Venkatasubba Rao Matriculation School', district: 'Chennai', type: 'school' },
    { name: 'St. John\'s Senior Secondary School', district: 'Chennai', type: 'school' },
    { name: 'Chinmaya Vidyalaya', district: 'Chennai', type: 'school' },
    { name: 'Kola Saraswathi Vaishnav Senior Secondary School', district: 'Chennai', type: 'school' },
    { name: 'Maharishi Vidya Mandir Senior Secondary School', district: 'Chennai', type: 'school' },
    { name: 'Velammal Main School (Mogappair)', district: 'Chennai', type: 'school' },
    { name: 'Chettinad Vidyashram', district: 'Chennai', type: 'school' },
    { name: 'Vidya Mandir Senior Secondary School', district: 'Chennai', type: 'school' },

    // 4. COIMBATORE
    { name: 'PSG College of Technology', district: 'Coimbatore', type: 'college' },
    { name: 'Coimbatore Institute of Technology (CIT)', district: 'Coimbatore', type: 'college' },
    { name: 'Government College of Technology (GCT)', district: 'Coimbatore', type: 'college' },
    { name: 'Amrita Vishwa Vidyapeetham', district: 'Coimbatore', type: 'college' },
    { name: 'Kumaraguru College of Technology (KCT)', district: 'Coimbatore', type: 'college' },
    { name: 'Karunya Institute of Technology and Sciences', district: 'Coimbatore', type: 'college' },
    { name: 'Nirmala College for Women', district: 'Coimbatore', type: 'college' },
    { name: 'PSGR Krishnammal College for Women', district: 'Coimbatore', type: 'college' },
    { name: 'Stanes Anglo-Indian Higher Secondary School', district: 'Coimbatore', type: 'school' },
    { name: 'G.D. Matriculation Higher Secondary School', district: 'Coimbatore', type: 'school' },

    // 5. CUDDALORE
    { name: 'Annamalai University', district: 'Cuddalore', type: 'college' },
    { name: 'Government Medical College, Chidambaram', district: 'Cuddalore', type: 'college' },
    { name: 'St. Joseph\'s College of Arts and Science', district: 'Cuddalore', type: 'college' },
    { name: 'CK College of Engineering and Technology', district: 'Cuddalore', type: 'college' },
    { name: 'Government Higher Secondary School, Cuddalore', district: 'Cuddalore', type: 'school' },

    // 6. DHARMAPURI
    { name: 'Government Medical College, Dharmapuri', district: 'Dharmapuri', type: 'college' },
    { name: 'Government Engineering College, Dharmapuri', district: 'Dharmapuri', type: 'college' },
    { name: 'Adhiyaman Arts and Science College', district: 'Dharmapuri', type: 'college' },
    { name: 'Sri Vijay Vidyalaya Schools', district: 'Dharmapuri', type: 'school' },

    // 7. DINDIGUL
    { name: 'Gandhigram Rural Institute', district: 'Dindigul', type: 'college' },
    { name: 'PSNA College of Engineering and Technology', district: 'Dindigul', type: 'college' },
    { name: 'GTN Arts College', district: 'Dindigul', type: 'college' },
    { name: 'St. Mary\'s Higher Secondary School', district: 'Dindigul', type: 'school' },

    // 8. ERODE
    { name: 'Kongu Engineering College', district: 'Erode', type: 'college' },
    { name: 'Vellalar College for Women', district: 'Erode', type: 'college' },
    { name: 'Erode Sengunthar Engineering College', district: 'Erode', type: 'college' },
    { name: 'Bhavani Kooduthurai Higher Secondary School', district: 'Erode', type: 'school' },

    // 9. KALLAKURICHI
    { name: 'Government Medical College, Kallakurichi', district: 'Kallakurichi', type: 'college' },
    { name: 'Bharathiyar Institute of Engineering for Women', district: 'Kallakurichi', type: 'college' },
    { name: 'AKT Memorial College of Engineering', district: 'Kallakurichi', type: 'college' },

    // 10. KANCHIPURAM
    { name: 'Kanchi University (SCSVMV)', district: 'Kanchipuram', type: 'college' },
    { name: 'Sri Chandrasekharendra Saraswathi Viswa Mahavidyalaya', district: 'Kanchipuram', type: 'college' },
    { name: 'Rajalakshmi Engineering College', district: 'Kanchipuram', type: 'college' },
    { name: 'Meenakshi Amman Engineering College', district: 'Kanchipuram', type: 'college' },

    // 11. KANYAKUMARI
    { name: 'Scott Christian College', district: 'Kanyakumari', type: 'college' },
    { name: 'Holy Cross College', district: 'Kanyakumari', type: 'college' },
    { name: 'S.T. Hindu College', district: 'Kanyakumari', type: 'college' },
    { name: 'Kanyakumari Medical College', district: 'Kanyakumari', type: 'college' },
    { name: 'St. Jude\'s College', district: 'Kanyakumari', type: 'college' },

    // 12. KARUR
    { name: 'Government Arts College, Karur', district: 'Karur', type: 'college' },
    { name: 'M.Kumarasamy College of Engineering', district: 'Karur', type: 'college' },
    { name: 'NSHSS Karur', district: 'Karur', type: 'school' },

    // 13. KRISHNAGIRI
    { name: 'Government College of Engineering, Bargur', district: 'Krishnagiri', type: 'college' },
    { name: 'Adhiyaman College of Engineering', district: 'Krishnagiri', type: 'college' },
    { name: 'Krishnagiri Medical College', district: 'Krishnagiri', type: 'college' },

    // 14. MADURAI
    { name: 'American College, Madurai', district: 'Madurai', type: 'college' },
    { name: 'Madura College', district: 'Madurai', type: 'college' },
    { name: 'Lady Doak College', district: 'Madurai', type: 'college' },
    { name: 'Thiagarajar College of Engineering (TCE)', district: 'Madurai', type: 'college' },
    { name: 'Thiagarajar College', district: 'Madurai', type: 'college' },
    { name: 'Madurai Medical College', district: 'Madurai', type: 'college' },
    { name: 'Fatima College', district: 'Madurai', type: 'college' },
    { name: 'Velammal College of Engineering and Technology', district: 'Madurai', type: 'college' },
    { name: 'Sethupathi Higher Secondary School', district: 'Madurai', type: 'school' },
    { name: 'St. Mary\'s Higher Secondary School (Madurai)', district: 'Madurai', type: 'school' },

    // 15. MAYILADUTHURAI
    { name: 'A.V.C. College', district: 'Mayiladuthurai', type: 'college' },
    { name: 'Dharmapuram Adhinam Arts College', district: 'Mayiladuthurai', type: 'college' },
    { name: 'Government Arts College, Mayiladuthurai', district: 'Mayiladuthurai', type: 'college' },

    // 16. NAGAPATTINAM
    { name: 'E.G.S. Pillay Engineering College', district: 'Nagapattinam', type: 'college' },
    { name: 'A.D.M. College for Women', district: 'Nagapattinam', type: 'college' },
    { name: 'Valivalam Desikar Polytechnic College', district: 'Nagapattinam', type: 'college' },

    // 17. NAMAKKAL
    { name: 'Vivekanandha College of Engineering for Women', district: 'Namakkal', type: 'college' },
    { name: 'K.S.R. College of Technology', district: 'Namakkal', type: 'college' },
    { name: 'Gnanamani College of Engineering', district: 'Namakkal', type: 'college' },
    { name: 'Namakkal Medical College', district: 'Namakkal', type: 'college' },

    // 18. NILGIRIS
    { name: 'Government Arts College, Ooty', district: 'Nilgiris', type: 'college' },
    { name: 'JSS College of Pharmacy', district: 'Nilgiris', type: 'college' },
    { name: 'Lawrence School, Lovedale', district: 'Nilgiris', type: 'school' },

    // 19. PERAMBALUR
    { name: 'Dhanalakshmi Srinivasan Engineering College', district: 'Perambalur', type: 'college' },
    { name: 'Government Arts College, Perambalur', district: 'Perambalur', type: 'college' },

    // 20. PUDUKKOTTAI
    { name: 'Government Medical College, Pudukkottai', district: 'Pudukkottai', type: 'college' },
    { name: 'H.H. The Rajah\'s College', district: 'Pudukkottai', type: 'college' },
    { name: 'J.J. College of Arts and Science', district: 'Pudukkottai', type: 'college' },

    // 21. RAMANATHAPURAM
    { name: 'Government Medical College, Ramanathapuram', district: 'Ramanathapuram', type: 'college' },
    { name: 'Syed Ammal Engineering College', district: 'Ramanathapuram', type: 'college' },
    { name: 'Mohamed Sathak Engineering College', district: 'Ramanathapuram', type: 'college' },

    // 22. RANIPET
    { name: 'Government College of Engineering, Ranipet', district: 'Ranipet', type: 'college' },
    { name: 'Adhiparasakthi Engineering College', district: 'Ranipet', type: 'college' },

    // 23. SALEM
    { name: 'Government College of Engineering, Salem', district: 'Salem', type: 'college' },
    { name: 'Sona College of Technology', district: 'Salem', type: 'college' },
    { name: 'Salem Sowdeswari College', district: 'Salem', type: 'college' },
    { name: 'Vinayaka Mission\'s Kirupananda Variyar Medical College', district: 'Salem', type: 'college' },
    { name: 'Cluny Girls Higher Secondary School', district: 'Salem', type: 'school' },

    // 24. SIVAGANGAI
    { name: 'Alagappa University', district: 'Sivagangai', type: 'college' },
    { name: 'Alagappa College of Engineering and Technology (ACGCET)', district: 'Sivagangai', type: 'college' },
    { name: 'Government Medical College, Sivagangai', district: 'Sivagangai', type: 'college' },

    // 25. TENKASI
    { name: 'ICL Engineering College', district: 'Tenkasi', type: 'college' },
    { name: 'Government Arts College, Tenkasi', district: 'Tenkasi', type: 'college' },

    // 26. THANJAVUR
    { name: 'SASTRA Deemed University', district: 'Thanjavur', type: 'college' },
    { name: 'Thanjavur Medical College', district: 'Thanjavur', type: 'college' },
    { name: 'Tamil University', district: 'Thanjavur', type: 'college' },
    { name: 'Bon Secours College for Women', district: 'Thanjavur', type: 'college' },

    // 27. THENI
    { name: 'Government Medical College, Theni', district: 'Theni', type: 'college' },
    { name: 'C.P.A. College', district: 'Theni', type: 'college' },

    // 28. THOOTHUKUDI
    { name: 'St. Mary\'s College', district: 'Thoothukudi', type: 'college' },
    { name: 'V.O.C. College', district: 'Thoothukudi', type: 'college' },
    { name: 'Government Medical College, Thoothukudi', district: 'Thoothukudi', type: 'college' },
    { name: 'Govindammal Aditanar College for Women', district: 'Thoothukudi', type: 'college' },

    // 29. TIRUCHIRAPPALLI
    { name: 'National Institute of Technology (NIT) Trichy', district: 'Tiruchirappalli', type: 'college' },
    { name: 'St. Joseph\'s College (Autonomous)', district: 'Tiruchirappalli', type: 'college' },
    { name: 'Bishop Heber College', district: 'Tiruchirappalli', type: 'college' },
    { name: 'Jamal Mohamed College', district: 'Tiruchirappalli', type: 'college' },
    { name: 'National College (Autonomous)', district: 'Tiruchirappalli', type: 'college' },
    { name: 'Holy Cross College (Autonomous)', district: 'Tiruchirappalli', type: 'college' },
    { name: 'BHEL Matriculation Higher Secondary School', district: 'Tiruchirappalli', type: 'school' },

    // 30. TIRUNELVELI
    { name: 'Government College of Engineering, Tirunelveli', district: 'Tirunelveli', type: 'college' },
    { name: 'St. Xavier\'s College (Autonomous)', district: 'Tirunelveli', type: 'college' },
    { name: 'Tirunelveli Medical College', district: 'Tirunelveli', type: 'college' },
    { name: 'Manonmaniam Sundaranar University', district: 'Tirunelveli', type: 'college' },

    // 31. TIRUPATHUR
    { name: 'Sacred Heart College (Autonomous)', district: 'Tirupathur', type: 'college' },
    { name: 'Government Arts College, Tirupathur', district: 'Tirupathur', type: 'college' },

    // 32. TIRUPPUR
    { name: 'Government Fashion Institute', district: 'Tiruppur', type: 'college' },
    { name: 'Kumaran College for Women', district: 'Tiruppur', type: 'college' },

    // 33. TIRUVALLUR
    { name: 'Saveetha Engineering College', district: 'Tiruvallur', type: 'college' },
    { name: 'Velammal Engineering College', district: 'Tiruvallur', type: 'college' },
    { name: 'Panimalar Engineering College', district: 'Tiruvallur', type: 'college' },

    // 34. TIRUVANNAMALAI
    { name: 'Governmet Medical College, Tiruvannamalai', district: 'Tiruvannamalai', type: 'college' },
    { name: 'Arunai Engineering College', district: 'Tiruvannamalai', type: 'college' },

    // 35. TIRUVARUR
    { name: 'Central University of Tamil Nadu (CUTN)', district: 'Tiruvarur', type: 'college' },
    { name: 'Government Medical College, Tiruvarur', district: 'Tiruvarur', type: 'college' },

    // 36. VELLORE
    { name: 'Vellore Institute of Technology (VIT)', district: 'Vellore', type: 'college' },
    { name: 'Christian Medical College (CMC)', district: 'Vellore', type: 'college' },
    { name: 'Voorhees College', district: 'Vellore', type: 'college' },
    { name: 'Auxilium College', district: 'Vellore', type: 'college' },
    { name: 'Idhaya Deepam Matriculation Higher Secondary School', district: 'Vellore', type: 'school' },

    // 37. VILUPPURAM
    { name: 'Government Medical College, Viluppuram', district: 'Viluppuram', type: 'college' },
    { name: 'Anna University Regional Campus, Viluppuram', district: 'Viluppuram', type: 'college' },

    // 38. VIRUDHUNAGAR
    { name: 'Ayya Nadar Janaki Ammal College', district: 'Virudhunagar', type: 'college' },
    { name: 'VHNSN College', district: 'Virudhunagar', type: 'college' },
    { name: 'Kalasalingam Academy of Research and Education', district: 'Virudhunagar', type: 'college' }
];

async function seed() {
    console.log('--- Seeding Verified Production Institutional Data ---');
    try {
        // Clear existing data
        await db.query('DELETE FROM institutions');
        
        const values = productionInstitutions.map(inst => [
            inst.name, 
            inst.type, 
            inst.district, 
            `${inst.district}, Tamil Nadu`, 
            `admin@${inst.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.edu.in`
        ]);

        await db.query(
            'INSERT INTO institutions (name, type, district, address, contact_email) VALUES ?',
            [values]
        );

        console.log(`✅ Success! Seeded ${productionInstitutions.length} verified real institutions.`);
        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding failed:', err);
        process.exit(1);
    }
}

seed();
