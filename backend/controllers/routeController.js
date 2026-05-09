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

// ─── Next Bus Arrivals (Public) ──────────────────────────────
const getNextArrivals = async (req, res) => {
  try {
    const { routeId } = req.params;
    const [rows] = await db.query(
      'SELECT id, route_number, route_name, source, destination, stops, departure_times, distance_km FROM routes WHERE id = ? AND is_active = 1',
      [routeId]
    );
    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Route not found.' });
    }

    const route = rows[0];
    let departureTimes = [];
    try {
      departureTimes = typeof route.departure_times === 'string'
        ? JSON.parse(route.departure_times || '[]')
        : (route.departure_times || []);
    } catch { departureTimes = []; }

    let stops = [];
    try {
      stops = typeof route.stops === 'string'
        ? JSON.parse(route.stops || '[]')
        : (route.stops || []);
    } catch { stops = []; }

    // Current time in IST
    const now = new Date();
    const istOffset = 5.5 * 60; // IST = UTC+5:30
    const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
    const currentMinutes = (utcMinutes + istOffset) % 1440;
    const currentTimeStr = `${String(Math.floor(currentMinutes / 60)).padStart(2, '0')}:${String(Math.floor(currentMinutes % 60)).padStart(2, '0')}`;

    // Parse each departure time and compute minutes until arrival
    const schedule = departureTimes.map(timeStr => {
      const [h, m] = timeStr.split(':').map(Number);
      const depMinutes = h * 60 + m;
      let minutesUntil = depMinutes - currentMinutes;
      if (minutesUntil < 0) minutesUntil += 1440; // next day
      const isNextDay = depMinutes < currentMinutes;
      return {
        time: timeStr,
        minutesUntil,
        isNextDay,
        isPast: depMinutes < currentMinutes,
      };
    });

    // Sort by soonest arrival
    const sorted = [...schedule].sort((a, b) => a.minutesUntil - b.minutesUntil);

    // Get the next 5 upcoming buses
    const upcoming = sorted.slice(0, 5);

    // Determine the very next bus
    const nextBus = upcoming.length > 0 ? upcoming[0] : null;

    // Count how many buses are left today
    const busesLeftToday = schedule.filter(s => !s.isPast).length;

    res.json({
      success: true,
      route: {
        id: route.id,
        route_number: route.route_number,
        route_name: route.route_name,
        source: route.source,
        destination: route.destination,
        stops,
        total_departures: departureTimes.length,
      },
      currentTime: currentTimeStr,
      nextBus,
      upcoming,
      busesLeftToday,
      fullSchedule: schedule.sort((a, b) => {
        const [ah, am] = a.time.split(':').map(Number);
        const [bh, bm] = b.time.split(':').map(Number);
        return (ah * 60 + am) - (bh * 60 + bm);
      }),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error computing next arrivals.' });
  }
};

module.exports = { getRoutes, createRoute, updateRoute, deleteRoute, getNextArrivals };
