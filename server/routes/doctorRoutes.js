const express = require("express");
const { addAvailability, getSlots, bookSlot } = require("../controllers/doctorAvailabilityController");
const {
  registerDoctor,
  resendDoctorOtp,
  verifyDoctorOtp,
  requestLoginOTP,
  resendLoginOTP,
  verifyLoginOTP,
  requestForgotPasswordOTP,
  resendForgotPasswordOTP,
  resetPassword,
  loginDoctor,
  logoutDoctor,
  getDoctorProfile,
  updateDoctorProfile,
  filterDoctors,
  getDoctorById,
  deleteDoctor,
  toggleDoctorActive,
  verifyForgotPasswordOTP,getAllDoctors
} = require("../controllers/doctorController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadCertificates"); 
const router = express.Router();

router.post(
  "/register",
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "govtId", maxCount: 1 },
    { name: "medicalLicense", maxCount: 1 },
    { name: "educationCertificate", maxCount: 1 },
    { name: "additionalCertificate", maxCount: 2 },

  ]),
  registerDoctor
);
router.post("/verify-otp", verifyDoctorOtp);
router.post("/resend-verification-otp", resendDoctorOtp);


router.post("/login", loginDoctor);
router.post("/login/request-otp", requestLoginOTP);
router.post("/login/resend-login-otp", resendLoginOTP);
router.post("/login/verify-otp", verifyLoginOTP);


router.post("/forgot-password/request-otp", requestForgotPasswordOTP);
router.post("/forgot-password/verify-otp",verifyForgotPasswordOTP);
router.post("/forgot-password/resend-otp", resendForgotPasswordOTP);
router.post("/forgot-password/reset", resetPassword);

router.post("/logout", protect, logoutDoctor);

router.get("/profile", protect, getDoctorProfile);

router.put("/toggle-active", protect, toggleDoctorActive);


router.put(
  "/profile",
  protect,
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "govtId", maxCount: 1 },
    { name: "medicalLicense", maxCount: 1 },
    { name: "educationCertificate", maxCount: 1 },
  ]),
  updateDoctorProfile
);

router.get("/filter", filterDoctors);

router.get("/all", getAllDoctors);



router.put("/:id/set-password", async (req, res) => {
  try {
    const bcrypt = require("bcryptjs");
    const Doctor = require("../models/doctorModel");

    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const hash = await bcrypt.hash(password, 10);

    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      {
        password: hash,
        isApproved: true,   
        isVerified: true    
      },
      { new: true }         
    );

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json({
      message: "Password set and doctor approved",
    });
  } catch (error) {
    console.error("Error setting password:", error);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/:id", getDoctorById);

router.delete("/:id", deleteDoctor);


router.post("/:doctorId/availability", addAvailability);

router.get("/:doctorId/availability/:date", getSlots);

router.post("/bookings", bookSlot);







module.exports = router;


