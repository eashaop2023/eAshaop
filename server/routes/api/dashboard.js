const express = require('express');
const router = express.Router();
const dashboardController = require('../../controllers/dashboardController');

router.post('/getUserDashboard', dashboardController.getUserDashboard);
router.post('/getUserMedicationAndRemainder', dashboardController.getUserMedicationAndRemainder);

module.exports = router;


