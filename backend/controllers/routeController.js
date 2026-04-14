const db = require('../config/db');

// ─── Get All Routes ──────────────────────────────────────────
const getRoutes = async (req, res) => {
  try {
    const { district, area, institution_id } = req.query;
    let query = 'SELECT * FROM routes WHERE is_active = 1';
    let params = [];

    if (district) {
      query += ' AND district = ?';
      params.push(district);
    }
    if (area) {
      query += ' AND area = ?';
      params.push(area);
    }
    if (institution_id) {
      query += ' AND (institution_id IS NULL OR institution_id = ?)';
      params.push(institution_id);
    }

    query += ' ORDER BY route_number';
    const [rows] = await db.query(query, params);
    res.json({ success: true, routes: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error fetching routes.' });
  }
};

// ─── Create Route (Admin) ────────────────────────────────────
const createRoute = async (req, res) => {
  try {
    const { route_number, route_name, source, destination, stops, distance_km,
            monthly_fare, quarterly_fare, annual_fare, departure_times } = req.body;
    const [result] = await db.query(
      `INSERT INTO routes (route_number, route_name, source, destination, stops, distance_km,
                           monthly_fare, quarterly_fare, annual_fare, departure_times)
       VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [route_number, route_name, source, destination,
       JSON.stringify(stops || []), distance_km,
       monthly_fare, quarterly_fare, annual_fare,
       JSON.stringify(departure_times || [])]
    );
    res.status(201).json({ success: true, message: 'Route created.', routeId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error creating route.' });
  }
};

// ─── Update Route (Admin) ────────────────────────────────────
const updateRoute = async (req, res) => {
  try {
    const { routeId } = req.params;
    const fields = req.body;
    const keys   = Object.keys(fields);
    const vals   = Object.values(fields);
    const set    = keys.map(k => `${k} = ?`).join(', ');
    await db.query(`UPDATE routes SET ${set} WHERE id = ?`, [...vals, routeId]);
    res.json({ success: true, message: 'Route updated.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error updating route.' });
  }
};

// ─── Delete Route (Admin) ────────────────────────────────────
const deleteRoute = async (req, res) => {
  try {
    const { routeId } = req.params;
    await db.query('UPDATE routes SET is_active = 0 WHERE id = ?', [routeId]);
    res.json({ success: true, message: 'Route deactivated.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error deleting route.' });
  }
};

module.exports = { getRoutes, createRoute, updateRoute, deleteRoute };
