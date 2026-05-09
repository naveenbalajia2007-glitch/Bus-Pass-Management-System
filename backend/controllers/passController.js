const db          = require('../config/db');
const QRCode      = require('qrcode');
const { v4: uuid } = require('uuid');

// ─── ADMIN: Generic Status Update ───────────────────────────
const updatePassStatus = async (req, res) => {
  try {
    const { passId } = req.params;
    const { status, rejection_note, allocated_bus_id } = req.body;
    const adminId = req.user.id;

    if (!['pending', 'approved', 'rejected', 'expired'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status.' });
    }

    const [rows] = await db.query('SELECT * FROM bus_passes WHERE id = ?', [passId]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Pass not found.' });
    const pass = rows[0];

    let updateQuery = 'UPDATE bus_passes SET status = ?';
    let params = [status];

    if (status === 'rejected') {
      updateQuery += ', rejection_note = ?';
      params.push(rejection_note || 'Status updated by admin.');
    } else if (status === 'approved') {
      if (!allocated_bus_id && !pass.allocated_bus_id) {
        return res.status(400).json({ success: false, message: 'Bus allocation required for approval.' });
      }
      if (allocated_bus_id) {
        updateQuery += ', allocated_bus_id = ?';
        params.push(allocated_bus_id);
      }
      
      // If moving to approved from something else and no QR exists, generate one
      if (!pass.qr_code || !pass.qr_token) {
        const qrToken = uuid();
        const verifyUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/verify-pass/${pass.id}`;
        const qrCode = await QRCode.toDataURL(verifyUrl);
        
        const today = new Date();
        const endMap = { monthly: 30, quarterly: 90, annual: 365 };
        const end = new Date(today);
        end.setDate(end.getDate() + endMap[pass.pass_type]);

        updateQuery += ', start_date = ?, end_date = ?, qr_code = ?, qr_token = ?';
        params.push(today.toISOString().split('T')[0], end.toISOString().split('T')[0], qrCode, qrToken);
      }
      
      updateQuery += ', approved_by = ?, approved_at = NOW()';
      params.push(adminId);
    }

    updateQuery += ' WHERE id = ?';
    params.push(passId);

    await db.query(updateQuery, params);

    // Notify student
    const title = status === 'approved' ? '🎉 Bus Pass Updated' : '⚠️ Bus Pass Status Updated';
    const message = `Your pass (${pass.pass_number}) status has been changed to ${status}. ${rejection_note ? `Note: ${rejection_note}` : ''}`;
    
    await db.query(
      `INSERT INTO notifications (user_id, title, message, type) VALUES (?,?,?,?)`,
      [pass.user_id, title, message, status === 'approved' ? 'success' : 'warning']
    );

    res.json({ success: true, message: `Pass status updated to ${status}.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error updating pass status.' });
  }
};

// ─── Apply for Bus Pass ──────────────────────────────────────
const applyPass = async (req, res) => {
  try {
    const userId = req.user.id;
    const { route_id, pass_type, boarding_point } = req.body;
    if (!route_id || !pass_type || !boarding_point) {
      return res.status(400).json({ success: false, message: 'Route, boarding point, and pass type are required.' });
    }

    // Check for existing active/pending pass
    const [existing] = await db.query(
      `SELECT id FROM bus_passes WHERE user_id = ? AND status IN ('pending','approved')`,
      [userId]
    );
    if (existing.length) {
      return res.status(409).json({ success: false, message: 'You already have an active or pending pass.' });
    }

    // --- Smart Bus Suggestion Algorithm ---
    // Find buses on this route sorted by current active passenger capacity
    const [buses] = await db.query(`
      SELECT b.id, b.capacity,
        (SELECT COUNT(*) FROM bus_passes p 
         WHERE p.allocated_bus_id = b.id AND p.status = 'approved' AND p.end_date >= CURRENT_DATE) as occupied
      FROM buses b WHERE b.route_id = ? AND b.is_active = 1
      ORDER BY occupied ASC
    `, [route_id]);

    // Choose the first one that has space, or NULL if none available/matched
    let suggestedBusId = null;
    if (buses.length > 0 && buses[0].occupied < buses[0].capacity) {
      suggestedBusId = buses[0].id;
    }

    const passNumber = 'BP' + Date.now();
    const [result] = await db.query(
      `INSERT INTO bus_passes (pass_number, user_id, route_id, pass_type, status, boarding_point, suggested_bus_id) 
       VALUES (?,?,?,?,'pending',?,?)`,
      [passNumber, userId, route_id, pass_type, boarding_point, suggestedBusId]
    );

    // Notify student
    await db.query(
      `INSERT INTO notifications (user_id, title, message, type) VALUES (?,?,?,'info')`,
      [userId, 'Pass Application Received', `Your bus pass application (${passNumber}) has been submitted and is under review.`]
    );

    res.status(201).json({ success: true, message: 'Pass application submitted successfully.', passId: result.insertId, passNumber });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error submitting application.' });
  }
};

// ─── Get Student's Passes ────────────────────────────────────
const getMyPasses = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT bp.*, r.route_name, r.route_number, r.source, r.destination,
              DATEDIFF(bp.end_date, CURDATE()) AS days_left,
              b.bus_number as allocated_bus,
              u.id_proof,
              u.student_photo
       FROM bus_passes bp
       JOIN routes r ON r.id = bp.route_id
       LEFT JOIN buses b ON b.id = bp.allocated_bus_id
       JOIN users u ON u.id = bp.user_id
       WHERE bp.user_id = ? ORDER BY bp.applied_at DESC`,
      [req.user.id]
    );
    res.json({ success: true, passes: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error fetching passes.' });
  }
};

// ─── Admin: Get All Applications ─────────────────────────────
const getAllPasses = async (req, res) => {
  try {
    const { status, district, institution_id } = req.query;
    let query = `SELECT bp.*, u.full_name, u.email, u.roll_number, u.department, u.id_proof, u.student_photo,
                        r.route_name, r.route_number,
                        i.name as institution_name, i.district,
                        b.bus_number as allocated_bus,
                        sb.bus_number as suggested_bus
                 FROM bus_passes bp
                 JOIN users  u  ON u.id = bp.user_id
                 JOIN institutions i ON i.id = u.institution_id
                 JOIN routes r  ON r.id = bp.route_id
                 LEFT JOIN buses b  ON b.id = bp.allocated_bus_id
                 LEFT JOIN buses sb ON sb.id = bp.suggested_bus_id
                 WHERE 1=1`;
    const params = [];
    
    if (status) { 
      query += ' AND bp.status = ?'; 
      params.push(status); 
    }
    if (district) {
      query += ' AND i.district = ?';
      params.push(district);
    }
    if (institution_id) {
      query += ' AND u.institution_id = ?';
      params.push(institution_id);
    }

    query += ' ORDER BY bp.applied_at DESC';
    const [rows] = await db.query(query, params);
    res.json({ success: true, passes: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error fetching passes.' });
  }
};

// ─── Admin: Approve Pass ─────────────────────────────────────
const approvePass = async (req, res) => {
  try {
    const { passId } = req.params;
    const { allocated_bus_id } = req.body;
    const adminId    = req.user.id;

    if (!allocated_bus_id) {
      return res.status(400).json({ success: false, message: 'A physical bus MUST be allocated to approve the pass.' });
    }

    // Verify seat capacity before final allocation
    const [busRows] = await db.query(`
      SELECT b.capacity, 
        (SELECT COUNT(*) FROM bus_passes p WHERE p.allocated_bus_id = b.id AND p.status = 'approved' AND p.end_date >= CURRENT_DATE) as occupied 
      FROM buses b WHERE b.id = ?
    `, [allocated_bus_id]);

    if (!busRows.length) return res.status(404).json({ success: false, message: 'Bus not found.' });
    if (busRows[0].occupied >= busRows[0].capacity) {
      return res.status(400).json({ success: false, message: 'Selected Bus is fully occupied!' });
    }

    const [rows] = await db.query('SELECT * FROM bus_passes WHERE id = ?', [passId]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Pass not found.' });

    const pass = rows[0];
    const today  = new Date();
    const endMap = { monthly: 30, quarterly: 90, annual: 365 };
    const end    = new Date(today);
    end.setDate(end.getDate() + endMap[pass.pass_type]);

    const qrToken = uuid();
    const verifyUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/verify-pass/${passId}`;
    const qrCode  = await QRCode.toDataURL(verifyUrl);

    await db.query(
      `UPDATE bus_passes SET status='approved', allocated_bus_id=?, start_date=?, end_date=?, qr_code=?, qr_token=?, approved_by=?, approved_at=NOW()
       WHERE id=?`,
      [allocated_bus_id, today.toISOString().split('T')[0], end.toISOString().split('T')[0], qrCode, qrToken, adminId, passId]
    );

    // Notify student
    await db.query(
      `INSERT INTO notifications (user_id, title, message, type) VALUES (?,?,?,'success')`,
      [pass.user_id, '🎉 Bus Pass Approved!', `Your bus pass (${pass.pass_number}) has been approved. Valid till ${end.toDateString()}.`]
    );

    res.json({ success: true, message: 'Pass approved and QR code generated.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error approving pass.' });
  }
};

// ─── Admin: Reject Pass ──────────────────────────────────────
const rejectPass = async (req, res) => {
  try {
    const { passId } = req.params;
    const { rejection_note } = req.body;
    const [rows] = await db.query('SELECT * FROM bus_passes WHERE id = ?', [passId]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Pass not found.' });

    const pass = rows[0];
    await db.query(
      `UPDATE bus_passes SET status='rejected', rejection_note=? WHERE id=?`,
      [rejection_note || 'Application rejected by admin.', passId]
    );

    await db.query(
      `INSERT INTO notifications (user_id, title, message, type) VALUES (?,?,?,'danger')`,
      [pass.user_id, 'Pass Application Rejected', `Your bus pass (${pass.pass_number}) was rejected. Reason: ${rejection_note || 'N/A'}`]
    );

    res.json({ success: true, message: 'Pass rejected.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error rejecting pass.' });
  }
};

// ─── Download Pass (QR Code) ─────────────────────────────────
const downloadPass = async (req, res) => {
  try {
    const { passId } = req.params;
    const [rows] = await db.query(
      `SELECT bp.*, u.full_name, u.roll_number, u.department, u.id_proof, r.route_name, r.route_number, b.bus_number
       FROM bus_passes bp
       JOIN users  u ON u.id = bp.user_id
       JOIN routes r ON r.id = bp.route_id
       LEFT JOIN buses b ON b.id = bp.allocated_bus_id
       WHERE bp.id = ? AND bp.user_id = ? AND bp.status = 'approved'`,
      [passId, req.user.id]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: 'Approved pass not found.' });
    res.json({ success: true, pass: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error fetching pass.' });
  }
};

// ─── Renew Pass ──────────────────────────────────────────────
const renewPass = async (req, res) => {
  try {
    const userId = req.user.id;
    const { passId, pass_type } = req.body;

    const [rows] = await db.query('SELECT * FROM bus_passes WHERE id = ? AND user_id = ?', [passId, userId]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Pass not found.' });

    // Mark old pass as expired, create new pending application
    await db.query(`UPDATE bus_passes SET status='expired' WHERE id=?`, [passId]);
    const passNumber = 'BP' + Date.now();
    const pass = rows[0];
    await db.query(
      `INSERT INTO bus_passes (pass_number, user_id, route_id, pass_type, status, is_renewed) VALUES (?,?,?,?,'pending',1)`,
      [passNumber, userId, pass.route_id, pass_type || pass.pass_type]
    );

    await db.query(
      `INSERT INTO notifications (user_id, title, message, type) VALUES (?,?,?,'info')`,
      [userId, 'Renewal Request Submitted', `Your renewal request (${passNumber}) is under review.`]
    );

    res.json({ success: true, message: 'Renewal application submitted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error processing renewal.' });
  }
};

const verifyPassPublic = async (req, res) => {
  try {
    const { passId } = req.params;
    const [rows] = await db.query(
      `SELECT bp.pass_number, bp.status, bp.start_date, bp.end_date, bp.boarding_point, bp.pass_type,
              u.full_name, u.roll_number, u.department, u.student_photo,
              r.route_name, r.route_number, r.stops as route_stops,
              i.name as institution_name,
              DATEDIFF(bp.end_date, CURDATE()) as days_left
       FROM bus_passes bp
       JOIN users  u ON u.id = bp.user_id
       JOIN routes r ON r.id = bp.route_id
       LEFT JOIN institutions i ON i.id = u.institution_id
       WHERE bp.id = ?`,
      [passId]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: 'Pass not found.' });
    
    const pass = rows[0];
    const isExpired = pass.end_date ? new Date(pass.end_date) < new Date() : true;
    const isValid = pass.status === 'approved' && !isExpired;
    const isExpiringSoon = pass.days_left <= 7 && pass.days_left > 0;
    
    res.json({ 
      success: true, 
      pass: { 
        ...pass, 
        isValid, 
        isExpiringSoon,
        verified_at: new Date().toISOString()
      } 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Verification error.' });
  }
};

module.exports = { applyPass, getMyPasses, getAllPasses, approvePass, rejectPass, updatePassStatus, downloadPass, renewPass, verifyPassPublic };
