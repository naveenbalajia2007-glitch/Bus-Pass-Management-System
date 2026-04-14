const db = require('../config/db');

// ─── Dashboard Stats (Admin) ─────────────────────────────────
const getDashboardStats = async (req, res) => {
  try {
    const { district, institution_id } = req.query;
    let whereClause = 'WHERE 1=1';
    const params = [];

    if (district) {
      whereClause += ' AND i.district = ?';
      params.push(district);
    }
    if (institution_id) {
      whereClause += ' AND u.institution_id = ?';
      params.push(institution_id);
    }

    const baseJoin = 'FROM users u LEFT JOIN institutions i ON u.institution_id = i.id';

    const [[totalStudents]] = await db.query(`SELECT COUNT(u.id) AS cnt ${baseJoin} ${whereClause}`, params);
    
    // For passes, since users are linked to institutions, we join users
    const passJoin = 'FROM bus_passes bp JOIN users u ON u.id = bp.user_id LEFT JOIN institutions i ON u.institution_id = i.id';
    
    const [[totalPasses]]   = await db.query(`SELECT COUNT(bp.id) AS cnt ${passJoin} ${whereClause}`, params);
    const [[activePasses]]  = await db.query(`SELECT COUNT(bp.id) AS cnt ${passJoin} ${whereClause} AND bp.status='approved' AND bp.end_date >= CURDATE()`, params);
    const [[pendingPasses]] = await db.query(`SELECT COUNT(bp.id) AS cnt ${passJoin} ${whereClause} AND bp.status='pending'`, params);
    
    const payJoin = 'FROM payments p JOIN users u ON u.id = p.user_id LEFT JOIN institutions i ON u.institution_id = i.id';
    const [[totalRevenue]]  = await db.query(`SELECT COALESCE(SUM(p.amount),0) AS total ${payJoin} ${whereClause} AND p.payment_status='success'`, params);
    
    const qrJoin = 'FROM qr_logs ql JOIN users u ON u.id = ql.user_id LEFT JOIN institutions i ON u.institution_id = i.id';
    const [[fraudAlerts]]   = await db.query(`SELECT COUNT(ql.id) AS cnt ${qrJoin} ${whereClause} AND ql.scan_result='fraud'`, params);
    const [[expiringSoon]]  = await db.query(`SELECT COUNT(bp.id) AS cnt ${passJoin} ${whereClause} AND bp.status='approved' AND bp.end_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)`, params);

    res.json({
      success: true,
      stats: {
        totalStudents:  totalStudents.cnt,
        totalPasses:    totalPasses.cnt,
        activePasses:   activePasses.cnt,
        pendingPasses:  pendingPasses.cnt,
        totalRevenue:   parseFloat(totalRevenue.total),
        fraudAlerts:    fraudAlerts.cnt,
        expiringSoon:   expiringSoon.cnt,
      },
      filters: { district, institution_id }
    });
  } catch (err) {
    console.error('[Analytics Error]', err);
    res.status(500).json({ success: false, message: 'Error fetching filtered stats.' });
  }
};

// ─── Route Popularity (AI) ───────────────────────────────────
const getRoutePopularity = async (_req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT r.route_number, r.route_name, COUNT(ql.id) AS scan_count
       FROM qr_logs ql JOIN routes r ON r.id = ql.route_id
       WHERE ql.scan_result = 'valid'
       GROUP BY ql.route_id ORDER BY scan_count DESC`
    );
    // Fallback from bus_passes if no logs yet
    if (!rows.length) {
      const [passRows] = await db.query(
        `SELECT r.route_number, r.route_name, COUNT(bp.id) AS scan_count
         FROM bus_passes bp JOIN routes r ON r.id = bp.route_id
         GROUP BY bp.route_id ORDER BY scan_count DESC`
      );
      return res.json({ success: true, data: passRows });
    }
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error fetching route analytics.' });
  }
};

// ─── Monthly Revenue Trend ───────────────────────────────────
const getRevenueTrend = async (_req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT DATE_FORMAT(paid_at,'%Y-%m') AS month, SUM(amount) AS revenue, COUNT(*) AS transactions
       FROM payments WHERE payment_status='success' AND paid_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
       GROUP BY month ORDER BY month`
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error fetching revenue trend.' });
  }
};

// ─── Pass Status Distribution ────────────────────────────────
const getPassDistribution = async (_req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT status, COUNT(*) AS count FROM bus_passes GROUP BY status`
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error fetching distribution.' });
  }
};

// ─── Fraud / Misuse Alerts ───────────────────────────────────
const getFraudAlerts = async (_req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT u.full_name, u.email, u.roll_number, COUNT(ql.id) AS fraud_count
       FROM qr_logs ql JOIN users u ON u.id = ql.user_id
       WHERE ql.scan_result = 'fraud'
       GROUP BY ql.user_id ORDER BY fraud_count DESC`
    );
    res.json({ success: true, alerts: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error fetching fraud alerts.' });
  }
};

// ─── All Students (Admin) ────────────────────────────────────
const getAllStudents = async (req, res) => {
  try {
    const { district, institution_id } = req.query;
    let whereClause = 'WHERE 1=1';
    const params = [];

    if (district) {
      whereClause += ' AND i.district = ?';
      params.push(district);
    }
    if (institution_id) {
      whereClause += ' AND u.institution_id = ?';
      params.push(institution_id);
    }

    const [rows] = await db.query(
      `SELECT u.id, u.full_name, u.email, u.phone, u.roll_number, u.department,
              u.year_of_study, u.is_active, u.created_at,
              i.name as institution_name, i.district,
              (SELECT COUNT(*) FROM bus_passes bp WHERE bp.user_id = u.id AND bp.status='approved') AS active_passes
       FROM users u
       LEFT JOIN institutions i ON i.id = u.institution_id
       ${whereClause}
       ORDER BY u.created_at DESC`,
       params
    );
    res.json({ success: true, students: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error fetching filtered students.' });
  }
};

// ─── Send Notification (Admin) ───────────────────────────────
const sendNotification = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { user_id, title, message, type } = req.body;
    // user_id = null means broadcast to all
    if (user_id) {
      await db.query(
        `INSERT INTO notifications (user_id, title, message, type, sent_by) VALUES (?,?,?,?,?)`,
        [user_id, title, message, type || 'info', adminId]
      );
    } else {
      const [users] = await db.query('SELECT id FROM users WHERE is_active=1');
      for (const u of users) {
        await db.query(
          `INSERT INTO notifications (user_id, title, message, type, sent_by) VALUES (?,?,?,?,?)`,
          [u.id, title, message, type || 'info', adminId]
        );
      }
    }
    res.json({ success: true, message: 'Notification sent.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error sending notification.' });
  }
};

// ─── Get My Notifications ────────────────────────────────────
const getMyNotifications = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 20`,
      [req.user.id]
    );
    // Mark as read
    await db.query('UPDATE notifications SET is_read=1 WHERE user_id=?', [req.user.id]);
    res.json({ success: true, notifications: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error fetching notifications.' });
  }
};

module.exports = {
  getDashboardStats, getRoutePopularity, getRevenueTrend,
  getPassDistribution, getFraudAlerts, getAllStudents,
  sendNotification, getMyNotifications,
};
