const express  = require('express');
const router   = express.Router();
const { getRoutes, createRoute, updateRoute, deleteRoute, getNextArrivals } = require('../controllers/routeController');
const { verifyToken, requireRole } = require('../middleware/auth');

router.get('/',             getRoutes);
router.get('/:routeId/next-arrivals', getNextArrivals);
router.post('/',            verifyToken, requireRole('admin'), createRoute);
router.put('/:routeId',     verifyToken, requireRole('admin'), updateRoute);
router.delete('/:routeId',  verifyToken, requireRole('admin'), deleteRoute);

module.exports = router;
