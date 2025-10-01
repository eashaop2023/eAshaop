const express = require('express');
const router = express.Router();
const {getAllCategories, createCategory, getDoctorsByCategoryByUUID} = require('../controllers/categoryController');
router.post('/', createCategory);

router.get('/', getAllCategories);

router.get('/:uuid/doctors', getDoctorsByCategoryByUUID);

module.exports = router;
