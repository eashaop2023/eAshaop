const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");

// // Book appointment
// router.post("/", appointmentController.bookAppointment);

// Get all appointments for a user
router.get("/:userId", appointmentController.getUserAppointments);

// Cancel appointment (Doctor only)
router.patch("/:id/cancel", appointmentController.cancelAppointment);

// Create Razorpay order & book appointment (pending)
router.post("/", appointmentController.bookAppointment);

// Confirm payment after Razorpay success
router.post("/confirm-payment", appointmentController.confirmPayment);

// Razorpay webhook (auto payment confirmation)
router.post(
  "/razorpay/webhook",
  express.raw({ type: "application/json" }), // 👈 Add this
  appointmentController.razorpayWebhook
);

router.get("/", appointmentController.getAllAppointments); // admin
router.get("/user/:userId", appointmentController.getUserAppointments);
router.get("/doctor/:doctorId", appointmentController.getDoctorAppointments);
module.exports = router;
