const db = require('../config/db');

/**
 * Expiry Checker Utility
 * Handles automatic status updates for expired passes and sends renewal reminders.
 */
const checkExpiries = async () => {
    console.log('🕒 Running Scheduled Expiry & Renewal Check...');
    try {
        // 1. AUTO-EXPIRE: Mark passes past their end_date as 'expired'
        const [expireResult] = await db.query(`
            UPDATE bus_passes 
            SET status = 'expired' 
            WHERE status = 'approved' AND end_date < CURDATE()
        `);
        if (expireResult.affectedRows > 0) {
            console.log(`✅ Auto-expired ${expireResult.affectedRows} passes.`);
        }

        // 2. RENEWAL REMINDERS: Find passes expiring within 7 days that haven't been reminded yet
        const [remindRows] = await db.query(`
            SELECT bp.*, u.full_name, DATEDIFF(bp.end_date, CURDATE()) as days_left
            FROM bus_passes bp
            JOIN users u ON u.id = bp.user_id
            WHERE bp.status = 'approved' 
              AND bp.end_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)
              AND (bp.last_expiry_reminder IS NULL OR bp.last_expiry_reminder < DATE_SUB(CURDATE(), INTERVAL 2 DAY))
        `);

        for (const row of remindRows) {
            const title = '⚠️ Pass Expiring Soon';
            const message = `Hi ${row.full_name}, your bus pass (${row.pass_number}) expires in ${row.days_left} days. Please renew it to avoid service disruption.`;
            
            // Send Notification
            await db.query(`
                INSERT INTO notifications (user_id, title, message, type) 
                VALUES (?, ?, ?, 'warning')
            `, [row.user_id, title, message]);

            // Update reminder timestamp to prevent spam (max once every 2 days)
            await db.query(`
                UPDATE bus_passes SET last_expiry_reminder = NOW() WHERE id = ?
            `, [row.id]);
        }

        if (remindRows.length > 0) {
            console.log(`📢 Sent renewal reminders to ${remindRows.length} students.`);
        }

    } catch (err) {
        console.error('❌ Expiry Checker Error:', err);
    }
};

/**
 * Initializes the expiry checker interval
 */
const initExpiryChecker = () => {
    // Run immediately on boot
    checkExpiries();
    
    // Then run every 6 hours (21,600,000 ms)
    setInterval(checkExpiries, 6 * 60 * 60 * 1000);
};

module.exports = { initExpiryChecker, checkExpiries };
