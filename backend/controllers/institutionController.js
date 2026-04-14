const db = require('../config/db');

exports.getInstitutionsByDistrict = async (req, res) => {
    const { district, type } = req.query;
  
    try {
      let query = "SELECT id, name, type FROM institutions WHERE district = ? AND is_active = 1";
      let params = [district];
  
      if (type) {
        query += " AND type = ?";
        params.push(type);
      }

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching institutions:", error);
    res.status(500).json({ error: "Server error" });
  }
};


