const express  = require('express');
const router   = express.Router();
const { registerStudent, loginStudent, loginAdmin, loginConductor, getProfile, loginOtp } = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');
const upload   = require('../middleware/upload');

router.post('/register',           upload.fields([{ name: 'id_proof', maxCount: 1 }, { name: 'student_photo', maxCount: 1 }]), registerStudent);
router.post('/login/student',      loginStudent);
router.post('/login/admin',        loginAdmin);
router.post('/login/conductor',    loginConductor);
router.post('/login/otp',          loginOtp);
router.get('/profile',             verifyToken, getProfile);


module.exports = router;
