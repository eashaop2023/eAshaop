const express = require('express');
const router = express.Router();
const { sendWhatsAppMessage } = require('../../controllers/whatsappController/whatsappController');
const { protect } = require("../../middlewares/authMiddleware");

router.post('/send', protect, sendWhatsAppMessage);

module.exports = router;
