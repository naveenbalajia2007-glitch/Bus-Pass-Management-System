require('dotenv').config();
const db = require('../config/db');

async function runMigration() {
    console.log('🚀 Running database migration: Add expiry tracking columns...');
    try {
        // Try adding the column directly
        await db.query(`
            ALTER TABLE bus_passes 
            ADD COLUMN last_expiry_reminder DATETIME DEFAULT NULL;
        `);
        
        console.log('✅ Migration successful: last_expiry_reminder added.');
        process.exit(0);
    } catch (err) {
        // Check if the column already exists (ER_DUP_COLUMN_NAME is 1060)
        if (err.errno === 1060 || err.code === 'ER_DUP_COLUMN_NAME') {
            console.log('ℹ️ Column already exists, skipping.');
            process.exit(0);
        }
        console.error('❌ Migration failed:', err);
        process.exit(1);
    }
}

runMigration();
