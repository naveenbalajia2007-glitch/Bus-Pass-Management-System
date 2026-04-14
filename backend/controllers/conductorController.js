const db = require('../config/db');

// ─── Verify QR Code ──────────────────────────────────────────
const verifyQR = async (req, res) => {
  try {
    const { qr_data } = req.body;
    const conductorId = req.user.id;

    let parsed;
    try {
      parsed = JSON.parse(qr_data);
    } catch {
      return res.status(400).json({ success: false, result: 'invalid', message: 'Invalid QR code data.' });
    }

    const { passId, userId, token } = parsed;
    const [rows] = await db.query(
      `SELECT bp.*, u.full_name, u.roll_number, u.department, u.phone,
              r.route_name, r.route_number, r.source, r.destination
       FROM bus_passes bp
       JOIN users  u ON u.id = bp.user_id
       JOIN routes r ON r.id = bp.route_id
       WHERE bp.id = ? AND bp.user_id = ? AND bp.qr_token = ?`,
      [passId, userId, token]
    );

    if (!rows.length) {
      await logScan({ passId: passId||0, userId: userId||0, conductorId, routeId: 0, result: 'invalid' });
      return res.json({ success: true, result: 'invalid', message: '❌ Invalid or tampered QR code!' });
    }

    const pass = rows[0];

    // Check expiry
    if (pass.status === 'expired' || new Date(pass.end_date) < new Date()) {
      await logScan({ passId, userId, conductorId, routeId: pass.route_id, result: 'expired' });
      return res.json({ success: true, result: 'expired', message: '⚠️ Pass has expired!', pass });
    }

    // Check status
    if (pass.status !== 'approved') {
      await logScan({ passId, userId, conductorId, routeId: pass.route_id, result: 'invalid' });
      return res.json({ success: true, result: 'invalid', message: '❌ Pass is not approved.', pass });
    }

    // Fraud detection: > 5 scans today by same student
    const [scans] = await db.query(
      `SELECT COUNT(*) AS cnt FROM qr_logs WHERE user_id=? AND DATE(scanned_at)=CURDATE()`,
      [userId]
    );
    if (scans[0].cnt >= 5) {
      await logScan({ passId, userId, conductorId, routeId: pass.route_id, result: 'fraud' });
      await db.query(
        `INSERT INTO notifications (user_id, title, message, type) VALUES (?,?,?,'warning')`,
        [userId, '⚠️ Unusual Activity Detected', 'Multiple scan attempts detected on your pass. Please contact admin if this was not you.']
      );
      return res.json({ success: true, result: 'fraud', message: '🚨 Fraud detected! Multiple scans today.', pass });
    }

    await logScan({ passId, userId, conductorId, routeId: pass.route_id, result: 'valid' });
    return res.json({ success: true, result: 'valid', message: '✅ Pass is valid!', pass });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Verification error.' });
  }
};

const logScan = async ({ passId, userId, conductorId, routeId, result }) => {
  await db.query(
    `INSERT INTO qr_logs (pass_id, user_id, conductor_id, route_id, scan_result) VALUES (?,?,?,?,?)`,
    [passId, userId, conductorId, routeId || 0, result]
  );
};

// ─── Get Conductor's Scan History ────────────────────────────
const getScanHistory = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT ql.*, u.full_name, u.roll_number, r.route_name
       FROM qr_logs ql
       JOIN users  u ON u.id = ql.user_id
       JOIN routes r ON r.id = ql.route_id
       WHERE ql.conductor_id = ? ORDER BY ql.scanned_at DESC LIMIT 50`,
      [req.user.id]
    );
    res.json({ success: true, logs: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error fetching scan history.' });
  }
};

module.exports = { verifyQR, getScanHistory };
