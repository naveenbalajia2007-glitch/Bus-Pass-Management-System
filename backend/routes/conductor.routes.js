const express  = require('express');
const router   = express.Router();
const { verifyQR, getScanHistory } = require('../controllers/conductorController');
const { verifyToken, requireRole } = require('../middleware/auth');

router.post('/verify',    verifyToken, requireRole('conductor'), verifyQR);
router.get('/history',    verifyToken, requireRole('conductor'), getScanHistory);

module.exports = router;
