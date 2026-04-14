const db = require('../config/db');

exports.getInstitutions = async (req, res) => {
  try {
    const { type, district } = req.query; // 'school' or 'college', 'Chennai' etc
    let query = 'SELECT * FROM institutions WHERE is_active = 1';
    let params = [];
    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }
    if (district) {
      query += ' AND district = ?';
      params.push(district);
    }
    const [institutions] = await db.query(query, params);
    res.json({ success: true, institutions });
  } catch (error) {
    console.error('Fetch institutions error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.createInstitution = async (req, res) => {
  try {
    const { name, type, district, address, contact_email } = req.body;
    await db.query(
      'INSERT INTO institutions (name, type, district, address, contact_email) VALUES (?, ?, ?, ?, ?)',
      [name, type, district, address, contact_email]
    );
    res.json({ success: true, message: 'Institution added successfully' });
  } catch (error) {
    console.error('Create institution error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getBuses = async (req, res) => {
  try {
    // Need to calculate current occupied seats based on approved active passes
    const query = `
      SELECT b.*, r.route_name,
        (SELECT COUNT(*) FROM bus_passes p 
         WHERE p.allocated_bus_id = b.id 
           AND p.status = 'approved' 
           AND p.end_date >= CURRENT_DATE) as occupied_seats
      FROM buses b
      LEFT JOIN routes r ON b.route_id = r.id
      WHERE b.is_active = 1
    `;
    const [buses] = await db.query(query);
    res.json({ success: true, buses });
  } catch (error) {
    console.error('Fetch buses error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.createBus = async (req, res) => {
  try {
    const { bus_number, route_id, capacity, driver_name } = req.body;
    await db.query(
      'INSERT INTO buses (bus_number, route_id, capacity, driver_name) VALUES (?, ?, ?, ?)',
      [bus_number, route_id, capacity, driver_name]
    );
    res.json({ success: true, message: 'Bus added successfully' });
  } catch (error) {
    console.error('Create bus error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
