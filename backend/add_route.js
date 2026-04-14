require('dotenv').config();
const db = require('./config/db');

async function addRoute() {
    console.log('--- Adding Specific Bus Route ---');
    try {
        const route = {
            route_number: '100',
            route_name: 'Central - Egmore Local',
            district: 'Chennai',
            source: 'Chennai Central',
            destination: 'Egmore Railway Station',
            stops: JSON.stringify(["Central", "Egmore"]),
            distance_km: 2.5,
            monthly_fare: 200.00,
            quarterly_fare: 500.00,
            annual_fare: 1800.00,
            departure_times: JSON.stringify(["07:00", "08:00", "18:00", "19:00"])
        };

        await db.query(`
            INSERT INTO routes 
            (route_number, route_name, district, source, destination, stops, distance_km, monthly_fare, quarterly_fare, annual_fare, departure_times) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            route.route_number, 
            route.route_name, 
            route.district, 
            route.source, 
            route.destination, 
            route.stops, 
            route.distance_km, 
            route.monthly_fare, 
            route.quarterly_fare, 
            route.annual_fare, 
            route.departure_times
        ]);

        console.log('✅ Success! Central - Egmore route added to database.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error adding route:', err);
        process.exit(1);
    }
}

addRoute();
