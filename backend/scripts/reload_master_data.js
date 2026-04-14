const db = require('../config/db');

const districts = [
    'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri', 'Dindigul', 'Erode',
    'Kallakurichi', 'Kanchipuram', 'Kanyakumari', 'Karur', 'Krishnagiri', 'Madurai', 'Mayiladuthurai',
    'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur', 'Pudukkottai', 'Ramanathapuram', 'Ranipet',
    'Salem', 'Sivagangai', 'Tenkasi', 'Thanjavur', 'Theni', 'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli',
    'Tirupathur', 'Tiruppur', 'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur', 'Vellore', 'Viluppuram', 'Virudhunagar'
];

const creators = ['Anna', 'LOYOLA', 'PSG', 'SSN', 'Vellore', 'Loyola', 'Stella', 'Don Bosco', 'Evergreen', 'Apex', 'Royal', 'Ideal'];
const types = [
    { prefix: 'College of Engineering', type: 'college' },
    { prefix: 'Institute of Technology', type: 'college' },
    { prefix: 'Polytechnic College', type: 'college' }
];

const areasByDistrict = {
    'Chennai': ['Adyar', 'Guindy', 'Anna Nagar', 'Velachery', 'T-Nagar', 'Ambattur', 'Porur', 'Tambaram', 'Chromepet', 'Poonamallee'],
    'Coimbatore': ['Gandhipuram', 'Peelamedu', 'RS Puram', 'Vadavalli', 'Ukkadam', 'Saravanampatti', 'Singanallur'],
    'Madurai': ['Periyar', 'Anna Nagar', 'Sellur', 'Teppakulam', 'KK Nagar', 'Mattuthavani'],
    'Salem': ['Five Roads', 'New Bus Stand', 'Shevapet', 'Suramangalam', 'Hasthampatti'],
    'Default': ['Central Area', 'Main Junction', 'North Block', 'South Extension', 'West Gate', 'East Side']
};

const routePrefixes = ['MTC', 'TNSTC', 'SETC', 'Express', 'City Bus', 'Deluxe', 'Superfast'];

async function seed() {
    console.log('🚀 Starting NexPass Ultra-Scale Network Upgrade (3000+ Routes, 3000+ Buses)...');
    try {
        await db.query('SET FOREIGN_KEY_CHECKS = 0');
        await db.query('TRUNCATE TABLE institutions');
        await db.query('TRUNCATE TABLE routes');
        await db.query('TRUNCATE TABLE buses');
        await db.query('TRUNCATE TABLE bus_passes');
        await db.query('TRUNCATE TABLE payments');
        await db.query('SET FOREIGN_KEY_CHECKS = 1');
        console.log('🧹 Cleanup complete.');

        // 🏢 SEED INSTITUTIONS (800+)
        let instValues = [];
        for (const dist of districts) {
            const areas = areasByDistrict[dist] || areasByDistrict.Default;
            const count = (dist === 'Chennai') ? 100 : 20; 
            for (let i = 0; i < count; i++) {
                const creator = creators[Math.floor(Math.random() * creators.length)];
                const itype = types[Math.floor(Math.random() * types.length)];
                const area = areas[i % areas.length];
                const name = `${creator} ${itype.prefix}, ${dist} (${i + 1})`;
                const address = `${i + 10}, ${area} Road, ${dist}`;
                instValues.push([name, itype.type, dist, area, address, `admin@${name.replace(/[^a-z0-9]/gi, '').toLowerCase()}.edu`]);
            }
        }
        const [instResult] = await db.query('INSERT INTO institutions (name, type, district, area, address, contact_email) VALUES ?', [instValues]);
        const firstInstId = instResult.insertId;
        const totalInst = instValues.length;
        console.log(`✅ Seeded ${totalInst} Institutions.`);

        // 🚌 SEED ROUTES (15-30 per AREA)
        let routeValues = [];
        let r_id_global = 0;
        
        for (const dist of districts) {
            const areas = areasByDistrict[dist] || areasByDistrict.Default;
            const prefix = (dist === 'Chennai') ? 'MTC' : (dist === 'Coimbatore' ? 'Kovai' : 'TNSTC');
            const routesPerArea = (dist === 'Chennai') ? 30 : 15;

            for (const currentArea of areas) {
                for (let r = 1; r <= routesPerArea; r++) {
                    r_id_global++;
                    const routeNum = `${prefix}-${2000 + r_id_global}`;
                    const dest = areas[Math.floor(Math.random() * areas.length)];
                    const stops = JSON.stringify([currentArea, ...areas.slice(0, 3), dest]);
                    const distKm = 10 + Math.floor(Math.random() * 30);
                    
                    // Route Name: Prefix + Area + Number (e.g., MTC Adyar-101: Adyar to Guindy)
                    const routeName = `${prefix} ${currentArea}-${r}: ${currentArea} to ${dest}`;
                    
                    // Linked institution (50% probability)
                    const linkedInstId = (Math.random() > 0.5) ? Math.floor(firstInstId + Math.random() * (totalInst - 1)) : null;
                    
                    routeValues.push([
                        routeNum, routeName, dist, linkedInstId, currentArea, currentArea, dest, stops, 
                        distKm, 600, 1600, 5000
                    ]);
                }
            }
        }

        // Chunked insertion to avoid memory overflow for 3000+ records
        const chunkSize = 500;
        for (let i = 0; i < routeValues.length; i += chunkSize) {
            const chunk = routeValues.slice(i, i + chunkSize);
            await db.query(
                'INSERT INTO routes (route_number, route_name, district, institution_id, area, source, destination, stops, distance_km, monthly_fare, quarterly_fare, annual_fare) VALUES ?',
                [chunk]
            );
        }
        
        const [lastRouteResult] = await db.query('SELECT MIN(id) as firstId FROM routes');
        const firstRouteId = lastRouteResult[0].firstId;
        console.log(`✅ Seeded ${routeValues.length} High-Density Routes.`);

        // 🚛 SEED BUSES (Linked to Routes)
        let busValues = [];
        for (let i = 0; i < routeValues.length; i++) {
            const plate = `TN-${Math.floor(10+Math.random()*89)}-${String.fromCharCode(65+Math.floor(Math.random()*26))}${String.fromCharCode(65+Math.floor(Math.random()*26))}-${3000 + i}`;
            const routeId = firstRouteId + i;
            const lat = 10.0 + (Math.random() * 3.0); 
            const lng = 77.0 + (Math.random() * 3.0);
            busValues.push([plate, 45, routeId, 1, lat, lng]);
        }
        
        for (let i = 0; i < busValues.length; i += chunkSize) {
            const chunk = busValues.slice(i, i + chunkSize);
            await db.query('INSERT INTO buses (bus_number, capacity, route_id, is_active, last_latitude, last_longitude) VALUES ?', [chunk]);
        }
        console.log(`✅ Seeded ${busValues.length} Real Buses.`);

        // 👨‍💼 SEED ADMIN
        await db.query('DELETE FROM users WHERE role = "admin"');
        const bcrypt = require('bcryptjs');
        const hashedPass = await bcrypt.hash('admin123', 10);
        await db.query('INSERT INTO users (full_name, email, password, phone, role) VALUES (?,?,?,?,?)', ['System Admin', 'admin@buspass.edu', hashedPass, '9000000000', 'admin']);
        
        console.log('🌟 Ultra-Scale Network Upgrade Complete!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Upgrade failed:', err);
        process.exit(1);
    }
}

seed();
