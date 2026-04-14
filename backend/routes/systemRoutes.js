const express = require('express');
const router = express.Router();
const systemController = require('../controllers/systemController');
const { verifyToken, requireRole } = require('../middleware/auth');

// Protected Admin Route to reset demo data
router.post('/reset-demo', verifyToken, requireRole('superadmin', 'admin'), systemController.resetDemoData);

module.exports = router;
