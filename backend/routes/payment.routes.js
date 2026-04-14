const express  = require('express');
const router   = express.Router();
const { initiatePayment, getPaymentHistory, getAllPayments } = require('../controllers/paymentController');
const { verifyToken, requireRole } = require('../middleware/auth');

router.post('/',          verifyToken, requireRole('student'), initiatePayment);
router.get('/my',         verifyToken, requireRole('student'), getPaymentHistory);
router.get('/all',        verifyToken, requireRole('admin'),   getAllPayments);

module.exports = router;
