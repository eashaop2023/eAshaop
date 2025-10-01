const express = require('express');
const router = express.Router();
const pharmacyController = require('../../controllers/pharmacyController');
// const dashboardController = require('../../controllers/dashboardController');

router.post('/registerPharmacyCategory', pharmacyController.registerPharmacyCategory);
router.post('/registerBrand', pharmacyController.registerBrand);
router.post('/registerTablet', pharmacyController.registerTablet);
router.post('/getFilters', pharmacyController.getFilters);
router.post('/getTabletHistory', pharmacyController.getTabletHistory);


module.exports = router;