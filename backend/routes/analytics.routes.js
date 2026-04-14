const express  = require('express');
const router   = express.Router();
const {
  getDashboardStats, getRoutePopularity, getRevenueTrend,
  getPassDistribution, getFraudAlerts, getAllStudents,
  sendNotification, getMyNotifications,
} = require('../controllers/analyticsController');
const { verifyToken, requireRole } = require('../middleware/auth');

router.get('/stats',            verifyToken, requireRole('admin'),   getDashboardStats);
router.get('/routes',           verifyToken, requireRole('admin'),   getRoutePopularity);
router.get('/revenue',          verifyToken, requireRole('admin'),   getRevenueTrend);
router.get('/distribution',     verifyToken, requireRole('admin'),   getPassDistribution);
router.get('/fraud',            verifyToken, requireRole('admin'),   getFraudAlerts);
router.get('/students',         verifyToken, requireRole('admin'),   getAllStudents);
router.post('/notifications',   verifyToken, requireRole('admin'),   sendNotification);
router.get('/my-notifications', verifyToken,                         getMyNotifications);

module.exports = router;
