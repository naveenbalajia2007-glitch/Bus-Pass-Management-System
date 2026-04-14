const express = require('express');
const router = express.Router();
const transportController = require('../controllers/transportController');
const { verifyToken, requireRole } = require('../middleware/auth');

// Public route to populate registration form dropdown
router.get('/institutions', transportController.getInstitutions);
router.get('/institutions/by-district', transportController.getInstitutions);

// Protected Admin Routes
router.post('/institutions', verifyToken, requireRole('admin', 'superadmin'), transportController.createInstitution);
router.get('/buses', verifyToken, requireRole('admin', 'superadmin'), transportController.getBuses);
router.post('/buses', verifyToken, requireRole('admin', 'superadmin'), transportController.createBus);

module.exports = router;
