const express  = require('express');
const router   = express.Router();
const { applyPass, getMyPasses, getAllPasses, approvePass, rejectPass, updatePassStatus, downloadPass, renewPass, verifyPassPublic } = require('../controllers/passController');
const { verifyToken, requireRole } = require('../middleware/auth');

router.post('/',                    verifyToken, requireRole('student'), applyPass);
router.get('/my',                   verifyToken, requireRole('student'), getMyPasses);
router.get('/all',                  verifyToken, requireRole('admin'),   getAllPasses);
router.get('/verify-public/:passId', verifyPassPublic);
router.patch('/:passId/status',     verifyToken, requireRole('admin'),   updatePassStatus);
router.put('/:passId/approve',      verifyToken, requireRole('admin'),   approvePass);
router.put('/:passId/reject',       verifyToken, requireRole('admin'),   rejectPass);
router.get('/:passId/download',     verifyToken, requireRole('student'), downloadPass);
router.post('/renew',               verifyToken, requireRole('student'), renewPass);

module.exports = router;
