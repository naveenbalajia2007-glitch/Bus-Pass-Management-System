const db = require('../config/db');
const fs = require('fs');
const path = require('path');

async function seed() {
    console.log('--- Seeding Structured Institutional Data (1500+ Entries) ---');
    try {
        // Step 1: Ensure Unique Index exists
        try {
            await db.query('ALTER TABLE institutions ADD UNIQUE INDEX unique_inst (name, district)');
            console.log('✅ Unique index created: (name, district)');
        } catch (err) {
            if (err.code === 'ER_DUP_KEYNAME') {
                console.log('ℹ️  Unique index already exists.');
            } else {
                throw err;
            }
        }

        // Step 2: Read Master JSON
        const dataPath = path.join(__dirname, '..', 'data', 'institutions_master.json');
        const institutions = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        console.log(`📦 Loaded ${institutions.length} institutions from master JSON.`);

        // Step 3: Clear and Seed
        await db.query('SET FOREIGN_KEY_CHECKS = 0');
        await db.query('DELETE FROM institutions');
        await db.query('SET FOREIGN_KEY_CHECKS = 1');
        
        const values = institutions.map(inst => [
            inst.name, 
            inst.district,
            inst.type, 
            `${inst.district}, Tamil Nadu`, 
            `admin@${inst.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.edu.in`
        ]);

        // Batch insert in chunks to avoid packet size limits if necessary
        const chunkSize = 100;
        for (let i = 0; i < values.length; i += chunkSize) {
            const chunk = values.slice(i, i + chunkSize);
            await db.query(
                'INSERT INTO institutions (name, district, type, address, contact_email) VALUES ?',
                [chunk]
            );
        }

        console.log(`✅ Success! Seeded ${institutions.length} real institutions from structured source.`);
        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding failed:', err);
        process.exit(1);
    }
}

seed();
