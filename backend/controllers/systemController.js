const db = require('../config/db');

/**
 * Resets the demo data to a "Perfect" initial state for viva presentation.
 * Clears dynamic data (Passes, Payments, Logs, Notifications) and re-seeds them.
 */
exports.resetDemoData = async (req, res) => {
  try {
    // 1. Clear dynamic tables
    await db.query('DELETE FROM qr_logs');
    await db.query('DELETE FROM payments');
    await db.query('DELETE FROM notifications');
    // Disable FK checks to safely clear bus_passes
    await db.query('SET FOREIGN_KEY_CHECKS = 0');
    await db.query('DELETE FROM bus_passes');
    await db.query('SET FOREIGN_KEY_CHECKS = 1');

    // 2. Re-seed Demo Student Bus Passes
    await db.query(`
      INSERT INTO bus_passes (id, pass_number, user_id, route_id, boarding_point, allocated_bus_id, pass_type, status, start_date, end_date, applied_at, approved_at, approved_by, qr_token) VALUES
      (1, 'PASS-ARUN-M70', 1, 1, 'Chennai Central', 1, 'monthly', 'approved', CURRENT_DATE, DATE_ADD(CURRENT_DATE, INTERVAL 30 DAY), '2024-04-01 10:00:00', '2024-04-02 14:00:00', 1, 'TOKEN_ARUN_PRO'),
      (2, 'PASS-PRIYA-21G', 2, 2, 'Tambaram', 2, 'quarterly', 'approved', CURRENT_DATE, DATE_ADD(CURRENT_DATE, INTERVAL 90 DAY), '2024-04-03 09:00:00', '2024-04-04 11:00:00', 1, 'TOKEN_PRIYA_LIVE'),
      (3, 'PASS-KARTH-CBE12', 3, 3, 'Gandhipuram', 3, 'annual', 'approved', CURRENT_DATE, DATE_ADD(CURRENT_DATE, INTERVAL 1 YEAR), '2024-04-02 12:00:00', '2024-04-03 10:00:00', 1, 'TOKEN_KARTHIK_LIVE'),
      (4, 'PASS-SNEHA-M70', 4, 1, 'Velachery', 1, 'monthly', 'pending', NULL, NULL, '2024-04-08 14:00:00', NULL, NULL, NULL),
      (5, 'PASS-DEEPAK-TRY5', 5, 5, 'Chatram', 5, 'monthly', 'approved', CURRENT_DATE, DATE_ADD(CURRENT_DATE, INTERVAL 30 DAY), '2024-04-04 08:00:00', '2024-04-05 09:00:00', 1, 'TOKEN_DEEPAK_LIVE'),
      (6, 'PASS-VIJAY-MDU7', 6, 4, 'Periyar', 4, 'monthly', 'rejected', NULL, NULL, '2024-04-01 10:30:00', NULL, 1, NULL)
    `);

    // 3. Re-seed Payments
    await db.query(`
      INSERT INTO payments (id, receipt_number, user_id, pass_id, amount, payment_method, payment_status, transaction_id, paid_at) VALUES
      (1, 'REC-001', 1, 1, 450.00, 'upi', 'success', 'TXN_ARUN_01', '2024-04-02 14:05:00'),
      (2, 'REC-002', 2, 2, 2000.00, 'card', 'success', 'TXN_PRIYA_02', '2024-04-04 11:10:00'),
      (3, 'REC-003', 3, 3, 3200.00, 'netbanking', 'success', 'TXN_KARTHIK_03', '2024-04-03 10:15:00')
    `);

    // 4. Re-seed QR Logs (Last 7 Days)
    await db.query(`
      INSERT INTO qr_logs (pass_id, user_id, conductor_id, bus_id, scan_result, scanned_at) VALUES
      (1, 1, 1, 1, 'valid', DATE_SUB(NOW(), INTERVAL 6 DAY)),
      (1, 1, 1, 1, 'valid', DATE_SUB(NOW(), INTERVAL 5 DAY)),
      (1, 1, 1, 1, 'valid', DATE_SUB(NOW(), INTERVAL 4 DAY)),
      (1, 1, 1, 1, 'valid', DATE_SUB(NOW(), INTERVAL 3 DAY)),
      (1, 1, 1, 1, 'valid', DATE_SUB(NOW(), INTERVAL 2 DAY)),
      (1, 1, 1, 1, 'valid', DATE_SUB(NOW(), INTERVAL 1 DAY)),
      (1, 1, 1, 1, 'valid', NOW()),
      (2, 2, 2, 2, 'valid', DATE_SUB(NOW(), INTERVAL 3 DAY)),
      (2, 2, 2, 2, 'valid', DATE_SUB(NOW(), INTERVAL 2 DAY)),
      (2, 2, 2, 2, 'valid', DATE_SUB(NOW(), INTERVAL 1 DAY)),
      (1, 1, 1, 1, 'invalid', DATE_SUB(NOW(), INTERVAL 12 HOUR))
    `);

    // 5. Re-seed Notifications
    await db.query(`
      INSERT INTO notifications (user_id, title, message, type) VALUES
      (1, 'Pass Approved', 'Your bus pass application for M70 has been approved.', 'success'),
      (2, 'Payment Success', 'Payment for your quarterly pass was successful.', 'info'),
      (4, 'Application Pending', 'Your pass application is under review by the transport office.', 'warning'),
      (6, 'Application Rejected', 'Incomplete ID proof provided. Please re-apply.', 'danger')
    `);

    res.json({ success: true, message: 'Demo environment reset to "Perfect Presentation" state successfully.' });
  } catch (error) {
    console.error('Reset Demo Data error:', error);
    res.status(500).json({ success: false, message: 'Failed to reset demo data.' });
  }
};
