const db         = require('../config/db');
const { v4: uuid } = require('uuid');

// ─── Initiate Payment ────────────────────────────────────────
const initiatePayment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { pass_id, payment_method, upi_id, card_last4 } = req.body;

    if (!pass_id || !payment_method) {
      return res.status(400).json({ success: false, message: 'Pass ID and payment method are required.' });
    }

    // Get fare from pass → route
    const [rows] = await db.query(
      `SELECT bp.pass_type, r.monthly_fare, r.quarterly_fare, r.annual_fare
       FROM bus_passes bp JOIN routes r ON r.id = bp.route_id
       WHERE bp.id = ? AND bp.user_id = ?`,
      [pass_id, userId]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: 'Pass not found.' });

    const p = rows[0];
    const fareMap = { monthly: p.monthly_fare, quarterly: p.quarterly_fare, annual: p.annual_fare };
    const amount  = fareMap[p.pass_type];

    // Simulate payment processing
    const transactionId  = 'TXN' + Date.now();
    const receiptNumber  = 'RCP' + Date.now();

    const [result] = await db.query(
      `INSERT INTO payments (receipt_number, user_id, pass_id, amount, payment_method, payment_status, transaction_id, upi_id, card_last4, paid_at)
       VALUES (?,?,?,?,?,'success',?,?,?, NOW())`,
      [receiptNumber, userId, pass_id, amount, payment_method, transactionId, upi_id || null, card_last4 || null]
    );

    await db.query(
      `INSERT INTO notifications (user_id, title, message, type) VALUES (?,?,?,'success')`,
      [userId, '💳 Payment Successful', `₹${amount} paid via ${payment_method.toUpperCase()}. Receipt: ${receiptNumber}`]
    );

    res.json({
      success: true,
      message: 'Payment successful.',
      receipt: {
        receipt_number: receiptNumber,
        transaction_id: transactionId,
        amount,
        payment_method,
        paid_at: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Payment processing error.' });
  }
};

// ─── Get Payment History ─────────────────────────────────────
const getPaymentHistory = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT p.*, bp.pass_number, r.route_name
       FROM payments p
       JOIN bus_passes bp ON bp.id = p.pass_id
       JOIN routes r ON r.id = bp.route_id
       WHERE p.user_id = ? ORDER BY p.created_at DESC`,
      [req.user.id]
    );
    res.json({ success: true, payments: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error fetching payments.' });
  }
};

// ─── Admin: All Payments ─────────────────────────────────────
const getAllPayments = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT p.*, u.full_name, u.email, bp.pass_number, r.route_name
       FROM payments p
       JOIN users     u  ON u.id = p.user_id
       JOIN bus_passes bp ON bp.id = p.pass_id
       JOIN routes r ON r.id = bp.route_id
       ORDER BY p.created_at DESC`
    );
    res.json({ success: true, payments: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error fetching payments.' });
  }
};

module.exports = { initiatePayment, getPaymentHistory, getAllPayments };
