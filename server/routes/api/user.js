
const express = require("express");
const router = express.Router();
// const userController = require("../../controllers/userController");
const userController = require("../../controllers/userController.js");
const { protect } = require('../../middlewares/authMiddleware.js')
console.log("userController keys:", Object.keys(userController));

const { upload } = require("../../config/cloudinary"); // Use Cloudinary multer

// --- Login / Logout ---
router.post('/login', userController.login);
router.post("/logout", userController.user_logout);

// Register a new user in app
router.post("/register", userController.registerUserApp);

// --- Registration ---
router.post("/registration/send-otp", userController.registerUser);
router.post("/registration/verify-otp", userController.verifyUserOtp);
router.post("/registration/resend-otp", userController.resendOtp);

// Login with OTP routes
router.post("/login/send-otp", userController.sendLoginOTP);
router.post("/login/verify-otp", userController.verifyLoginOTP);
router.post("/login/resend-otp", userController.resendLoginOTP);

// Forgot Password
router.post("/forgot-password/send-otp", userController.forgotPasswordSendOTP);
router.post("/forgot-password/verify-otp", userController.verifyForgotOTP);
router.post("/forgot-password/resend-otp", userController.resendForgotOTP);

// Reset Password
router.post("/reset-password", userController.resetPassword);

// Change password
router.put("/change-password/:id", userController.changePassword);

// --- Profile Image Upload ---
router.post(
  "/upload-profile-image/:id",
  upload.single("profileImage"),
  userController.uploadProfileImage
);

// --- Profile Image Update ---
router.put(
  "/update-profile-image/:id",
  upload.single("profileImage"),
  userController.updateProfileImage
);

// --- Get Profile Image ---
router.get("/get-profile-image/:id", protect, userController.updateProfileImage);

// --- User APIs ---
// Get all users
router.get("/", protect, userController.getAllUsers);
// Get user by ID
router.get("/:id", protect, userController.getUserById);
// Update user (except name & phone)
router.put("/:id", protect, userController.updateUserProfile);

// Upload multiple documents
router.post(
  "/:userId/documents", protect,
  upload.array("documents", 10),
  userController.uploadDocuments
);

// Get all documents for a user
router.get("/:userId/documents", protect, userController.getDocuments);


/* // Full documents array replacement
router.put("/:userId/documents", upload.array("documents"), userController.updateDocument);

// Single document update (within documents array)
router.put("/:userId/documents/:public_id", upload.single("filename"), userController.updateDocument);
 */
router.post("/dependent", protect, userController.userDependent);

module.exports = router;



