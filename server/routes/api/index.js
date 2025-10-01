const express = require('express');
const router = express.Router();

router.use('/user', require('./user'));
router.use('/dashboard', require('./dashboard'));
router.use('/pharmacy', require('./pharmacy'));

module.exports = router;

