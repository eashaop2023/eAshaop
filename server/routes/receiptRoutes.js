const express = require("express");
const router = express.Router();
const receiptController = require("../controllers/receiptController");

// Get all receipts for a user
router.get("/user/:userId", receiptController.getUserReceipts);

// Get all receipts for a doctor
router.get("/doctor/:doctorId", receiptController.getDoctorReceipts);

// Get a single receipt by ID
router.get("/:receiptId", receiptController.getReceiptById);

// Get receipt by appointment ID
router.get("/appointment/:appointmentId", receiptController.getReceiptByAppointmentId);

module.exports = router;

