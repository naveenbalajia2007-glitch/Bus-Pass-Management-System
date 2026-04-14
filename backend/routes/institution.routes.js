const express = require('express');
const router = express.Router();
const institutionController = require('../controllers/institutionController');

router.get('/by-district', institutionController.getInstitutionsByDistrict);

module.exports = router;
