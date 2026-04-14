const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const db     = require('../config/db');

// ─── Helpers ────────────────────────────────────────────────
const issueToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// ─── Student Register ────────────────────────────────────────
const registerStudent = async (req, res) => {
  try {
    let { full_name, email, password, phone, roll_number, department, year_of_study, address, student_type, institution_id } = req.body;
    if (email) email = email.trim().toLowerCase();

    if (!full_name || !email || !password || !student_type || !institution_id) {
      return res.status(400).json({ success: false, message: 'Name, email, password, student type and institution are required.' });
    }
    const [existing] = await db.query('SELECT id, email, phone, roll_number FROM users WHERE email = ? OR phone = ? OR (roll_number = ? AND roll_number IS NOT NULL AND roll_number != "")', [email, phone, roll_number]);
    if (existing.length) {
      if (existing.some(u => u.email === email)) return res.status(409).json({ success: false, message: 'Email already registered.' });
      if (existing.some(u => u.phone === phone)) return res.status(409).json({ success: false, message: 'Phone number already registered.' });
      if (existing.some(u => u.roll_number === roll_number)) return res.status(409).json({ success: false, message: 'Roll number already registered.' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const id_proof = req.files && req.files.id_proof ? req.files.id_proof[0].filename : null;
    const student_photo = req.files && req.files.student_photo ? req.files.student_photo[0].filename : null;

    console.log(`[Auth] Attempting to register user: ${email}`);
    const [result] = await db.query(
      `INSERT INTO users (full_name,email,password,student_type,institution_id,phone,roll_number,department,year_of_study,address,id_proof,student_photo)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
      [full_name, email, hashed, student_type, institution_id, phone, roll_number, department, year_of_study, address, id_proof, student_photo]
    );
    console.log(`[Auth] Registration successful for ${email}, User ID: ${result.insertId}`);
    const token = issueToken({ id: result.insertId, email, role: 'student' });
    res.status(201).json({ success: true, message: 'Registration successful.', token, userId: result.insertId });
  } catch (err) {
    console.error(`[Auth Error] Registration failed:`, err);
    res.status(500).json({ success: false, message: 'Server error during registration.', error: err.message });
  }
};

// ─── Student Login ───────────────────────────────────────────
const loginStudent = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (email) email = email.trim().toLowerCase();
    console.log(`[Auth] Student login attempt: ${email}`);
    const [rows] = await db.query(`
      SELECT u.*, i.name as institution_name, i.district 
      FROM users u 
      LEFT JOIN institutions i ON u.institution_id = i.id 
      WHERE u.email = ? AND u.role = 'student' AND u.is_active = 1
    `, [email]);

    if (!rows.length) {
      console.warn(`[Auth] Login failed: User ${email} not found or inactive`);
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.warn(`[Auth] Login failed: Incorrect password for ${email}`);
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    console.log(`[Auth] Student login successful: ${email} (${user.full_name || user.name})`);
    const userRole = user.role || 'student';
    const token = issueToken({ id: user.id, email: user.email, role: userRole, name: user.full_name || user.name });
    const { password: _, ...safeUser } = user;
    res.json({ success: true, token, user: { ...safeUser, role: userRole } });
  } catch (err) {
    console.error(`[Auth Error] Student login error:`, err);
    res.status(500).json({ success: false, message: 'Login error.' });
  }
};

// ─── Admin Login ─────────────────────────────────────────────
const loginAdmin = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (email) email = email.trim().toLowerCase();
    const [rows] = await db.query('SELECT * FROM users WHERE email = ? AND role = "admin" AND is_active = 1', [email]);
    if (!rows.length) return res.status(401).json({ success: false, message: 'Invalid admin credentials.' });

    const admin = rows[0];
    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      console.warn(`[Auth] Admin login failed: Incorrect password for ${email}`);
      return res.status(401).json({ success: false, message: 'Invalid admin credentials.' });
    }

    console.log(`[Auth] Admin login successful: ${email}`);
    const adminRole = admin.role || 'admin';
    const token = issueToken({ id: admin.id, email: admin.email, role: adminRole, name: admin.full_name || admin.name });
    const { password: _, ...safeAdmin } = admin;
    res.json({ success: true, token, user: { ...safeAdmin, role: adminRole } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Login error.' });
  }
};

// ─── Conductor Login ─────────────────────────────────────────
const loginConductor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await db.query('SELECT * FROM users WHERE email = ? AND role = "conductor" AND is_active = 1', [email]);
    if (!rows.length) return res.status(401).json({ success: false, message: 'Invalid conductor credentials.' });

    const conductor = rows[0];
    const match = await bcrypt.compare(password, conductor.password);
    if (!match) return res.status(401).json({ success: false, message: 'Invalid conductor credentials.' });

    const token = issueToken({ id: conductor.id, email: conductor.email, role: 'conductor', name: conductor.full_name || conductor.name });
    const { password: _, ...safeConductor } = conductor;
    res.json({ success: true, token, user: safeConductor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Login error.' });
  }
};

// ─── Get Profile ─────────────────────────────────────────────
const getProfile = async (req, res) => {
  try {
    const { id, role } = req.user;
    let query = `SELECT * FROM users WHERE id = ?`;
    if (role === 'student') {
      query = `
        SELECT u.*, i.name as institution_name, i.district 
        FROM users u 
        LEFT JOIN institutions i ON u.institution_id = i.id 
        WHERE u.id = ?
      `;
    }
    const [rows] = await db.query(query, [id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'User not found.' });
    const { password: _, ...safe } = rows[0];
    res.json({ success: true, user: safe });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error fetching profile.' });
  }
};

// ─── OTP Login ───────────────────────────────────────────────
const loginOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    let cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length > 10) cleanPhone = cleanPhone.slice(-10); // Extract last 10 digits

    console.log(`[Auth] OTP login attempt for phone: ${cleanPhone}`);
    let [rows] = await db.query(`
      SELECT u.*, i.name as institution_name, i.district 
      FROM users u 
      LEFT JOIN institutions i ON u.institution_id = i.id 
      WHERE u.phone LIKE ? AND u.is_active = 1
    `, [`%${cleanPhone}`]);

    let user;

    if (!rows.length) {
      // Option A: Auto-create user
      console.log(`[Auth] User not found for ${cleanPhone}. Creating new user automatically.`);
      const email = `${cleanPhone}@nexpass.tn`;
      const full_name = `User ${cleanPhone}`;
      const hashed = await bcrypt.hash('AutoCreated@123', 10);
      
      const [result] = await db.query(
        `INSERT INTO users (full_name, email, password, student_type, phone)
         VALUES (?, ?, ?, ?, ?)`,
        [full_name, email, hashed, 'college', cleanPhone]
      );
      
      [rows] = await db.query(`
        SELECT u.*, i.name as institution_name, i.district 
        FROM users u 
        LEFT JOIN institutions i ON u.institution_id = i.id 
        WHERE u.id = ?
      `, [result.insertId]);
      
      user = rows[0];
    } else {
      user = rows[0];
    }

    console.log(`[Auth] OTP Login successful: ${user.phone} (${user.full_name})`);
    const token = issueToken({ id: user.id, email: user.email, role: 'student', name: user.full_name });
    const { password: _, ...safeUser } = user;
    res.json({ success: true, token, user: safeUser });
  } catch (err) {
    console.error(`[Auth Error] OTP login error:`, err);
    res.status(500).json({ success: false, message: 'OTP Login error.' });
  }
};

module.exports = { registerStudent, loginStudent, loginAdmin, loginConductor, getProfile, loginOtp };
