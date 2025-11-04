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


/**
 * @openapi
 * tags:
 *   name: Doctors
 *   description: API endpoints related to doctors
 */


/**
 * @openapi
 * /api/doctors/all:
 *   get:
 *     summary: Get all doctors
 *     tags: [Doctors]
 *     responses:
 *       200:
 *         description: Returns a list of doctors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 64a1b2c3d4e5f67890123456
 *                   name:
 *                     type: string
 *                     example: Dr. John Doe
 *                   gender:
 *                     type: string
 *                     example: Male
 *                   age:
 *                     type: integer
 *                     example: 38
 *                   email:
 *                     type: string
 *                     example: johndoe@example.com
 *                   mobile:
 *                     type: string
 *                     example: "+1234567890"
 *                   verifyBy:
 *                     type: string
 *                     example: email
 *                   isVerified:
 *                     type: boolean
 *                     example: true
 *                   isApproved:
 *                     type: boolean
 *                     example: true
 *                   speciality:
 *                     type: string
 *                     example: Cardiologist
 *                   experience:
 *                     type: integer
 *                     example: 10
 *                   consultationFee:
 *                     type: number
 *                     example: 500
 *                   about:
 *                     type: string
 *                     example: Experienced cardiologist specializing in heart health.
 *                   languages:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["English", "Spanish"]
 *                   areaOfInterest:
 *                     type: string
 *                     example: Heart disease prevention
 *                   education:
 *                     type: string
 *                     example: MBBS, MD
 *                   university:
 *                     type: string
 *                     example: Harvard Medical School
 *                   medicalCertificates:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         type:
 *                           type: string
 *                           example: Medical License
 *                         fileUrl:
 *                           type: string
 *                           example: https://example.com/license.pdf
 *                   consultationMode:
 *                     type: string
 *                     example: Both
 *                   profileImage:
 *                     type: string
 *                     example: https://example.com/profile.jpg
 *                   hospitalName:
 *                     type: string
 *                     example: City Hospital
 *                   hospitalLocation:
 *                     type: string
 *                     example: Downtown
 *                   isActive:
 *                     type: boolean
 *                     example: true
 *                   shortId:
 *                     type: string
 *                     example: JD1234
 *                   lastActiveAt:
 *                     type: string
 *                     format: date-time
 *                     example: 2025-09-28T06:19:45.375Z
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: 2025-09-15T08:46:20.103Z
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     example: 2025-09-28T06:19:45.376Z
 *                   username:
 *                     type: string
 *                     example: johndoe123
 *                   appointments:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         appointmentId:
 *                           type: string
 *                           example: 64b1c2d3e4f567890123abcd
 *                         type:
 *                           type: string
 *                           example: video
 *                         date:
 *                           type: string
 *                           format: date
 *                           example: 2025-10-01
 *                         time:
 *                           type: string
 *                           example: "15:30"
 *                         status:
 *                           type: string
 *                           example: booked
 *                         jitsiLink:
 *                           type: string
 *                           nullable: true
 *                           example: null
 *                   categoryId:
 *                     type: string
 *                     nullable: true
 *                     example: 64c7d8e9f0a123456789abcd
 *                   averageRating:
 *                     type: number
 *                     example: 4.8
 */


/**
 * @openapi
 * /api/doctors/register:
 *   post:
 *     summary: Register a new doctor
 *     tags: [Doctors]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Smith
 *               mobile:
 *                 type: string
 *                 example: "+911234567890"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: drjohn@gmail.com
 *               gender:
 *                 type: string
 *                 enum: [Male, Female, Other]
 *                 example: Male
 *               age:
 *                 type: integer
 *                 example: 35
 *               speciality:
 *                 type: string
 *                 example: Cardiologist
 *               consultationMode:
 *                 type: string
 *                 enum: [Video Consultation, Clinic Visit, Both]
 *                 example: Both
 *               hospitalName:
 *                 type: string
 *                 example: City Hospital
 *               hospitalLocation:
 *                 type: string
 *                 example: "123 Main Street, Mumbai"
 *               about:
 *                 type: string
 *                 example: Experienced cardiologist with 10 years of experience
 *               languages:
 *                 type: string
 *                 example: English,Hindi
 *               location:
 *                 type: string
 *                 example: Mumbai
 *               experience:
 *                 type: number
 *                 example: 10
 *               university:
 *                 type: string
 *                 example: AIIMS
 *               consultationFee:
 *                 type: number
 *                 example: 500
 *               areaOfInterest:
 *                 type: string
 *                 example: Cardiology, Internal Medicine
 *               education:
 *                 type: string
 *                 example: MBBS
 *               certification:
 *                 type: string
 *                 example: Board Certified
 *               verifyBy:
 *                 type: string
 *                 enum: [email, phone] 
 *                 example: email
 *               profileImage:
 *                 type: string
 *                 format: binary
 *               medicalLicense:
 *                 type: string
 *                 format: binary
 *               govtId:
 *                 type: string
 *                 format: binary
 *               educationCertificate:
 *                 type: string
 *                 format: binary
 *               additionalCertificate:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *             required:
 *               - name
 *               - mobile
 *               - password
 *               - email
 *               - gender
 *               - age
 *               - speciality
 *               - consultationMode
 *               - about
 *               - languages
 *               - experience
 *               - consultationFee
 *               - university
 *               - areaOfInterest
 *               - education
 *               - verifyBy
 *               - profileImage
 *               - medicalLicense
 *               - govtId
 *               - educationCertificate
 *     responses:
 *       201:
 *         description: Doctor registered successfully, OTP sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Doctor registered successfully. OTP sent."
 *                 doctor:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 6540abc1234
 *                     name:
 *                       type: string
 *                       example: Dr. John Smith
 *                     email:
 *                       type: string
 *                       example: drjohn@gmail.com
 *                     isVerified:
 *                       type: boolean
 *                       example: false
 *       400:
 *         description: Validation error or doctor already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Doctor already exists"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error message"
 */


/**
 * @openapi
 * /api/doctors/verify-otp:
 *   post:
 *     summary: Verify doctor OTP after registration or forgot password
 *     tags: [Doctors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               otp:
 *                 type: string
 *                 example: "123456"
 *             required:
 *               - otp
 *     parameters:
 *       - in: header
 *         name: doctorid
 *         schema:
 *           type: string
 *         required: true
 *         description: Doctor ID to identify which doctor to verify
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Doctor verified successfully. Please wait for admin approval."
 *       400:
 *         description: Missing Doctor ID or invalid/expired OTP
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Doctor ID missing or Invalid or expired OTP"
 *       404:
 *         description: Doctor not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Doctor not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error"
 */

/**
 * @openapi
 * /api/doctors/resend-verification-otp:
 *   post:
 *     summary: Resend OTP for doctor verification
 *     tags: [Doctors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               doctorId:
 *                 type: string
 *                 example: "64a1b2c3d4e5f67890123456"
 *               verifyBy:
 *                 type: string
 *                 enum: [email, phone]
 *                 example: email
 *             required:
 *               - doctorId
 *               - verifyBy
 *     responses:
 *       200:
 *         description: OTP resent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "OTP resent to your email"
 *       400:
 *         description: Validation error or doctor already verified
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   examples:
 *                     doctorIdMissing:
 *                       value: "Doctor ID is required"
 *                     alreadyVerified:
 *                       value: "Doctor already verified"
 *       404:
 *         description: Doctor not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Doctor not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error"
 */


/**
 * @openapi
 * /api/doctors/login:
 *   post:
 *     summary: Login doctor
 *     tags: [Doctors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "doctor@example.com"
 *               mobile:
 *                 type: string
 *                 example: "9876543210"
 *               password:
 *                 type: string
 *                 example: "password123"
 *             required:
 *               - password
 *     responses:
 *       200:
 *         description: Doctor logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "jwt_token_here"
 *                 doctor:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "64a1b2c3d4e5f67890123456"
 *                     name:
 *                       type: string
 *                       example: "Dr. John Doe"
 *                     email:
 *                       type: string
 *                       example: "doctor@example.com"
 *                     mobile:
 *                       type: string
 *                       example: "9876543210"
 *                     gender:
 *                       type: string
 *                       example: "male"
 *                     age:
 *                       type: integer
 *                       example: 35
 *                     speciality:
 *                       type: string
 *                       example: "Cardiology"
 *                     profileImage:
 *                       type: string
 *                       example: "https://example.com/profile.jpg"
 *                     languages:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["English", "Hindi"]
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-01-01T12:00:00.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-01-02T12:00:00.000Z"
 *       400:
 *         description: Missing email/mobile or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email or mobile is required"
 *       401:
 *         description: Invalid credentials or not verified
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   examples:
 *                     notVerified:
 *                       value: "Please verify your account first."
 *                     invalidCredentials:
 *                       value: "Invalid credentials"
 *       403:
 *         description: Account pending admin approval
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Your account is pending admin approval."
 *       404:
 *         description: Doctor not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Doctor not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error"
 */


/**
 * @openapi
 * /api/doctors/login/request-otp:
 *   post:
 *     summary: Request OTP for doctor login
 *     tags: [Doctors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               verifyBy:
 *                 type: string
 *                 enum: [email, mobile]
 *                 example: email
 *               value:
 *                 type: string
 *                 example: "doctor@example.com"
 *             required:
 *               - verifyBy
 *               - value
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "OTP sent to your email"
 *                 doctorId:
 *                   type: string
 *                   example: "64a1b2c3d4e5f67890123456"
 *       401:
 *         description: Doctor not verified
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Please verify your account first."
 *       403:
 *         description: Account pending admin approval
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Pending admin approval."
 *       404:
 *         description: Doctor not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Doctor not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error"
 */

/**
 * @openapi
 * /api/doctors/login/resend-login-otp:
 *   post:
 *     summary: Resend login OTP for doctor authentication
 *     tags: [Doctors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               doctorId:
 *                 type: string
 *                 example: "64a1b2c3d4e5f67890123456"
 *               verifyBy:
 *                 type: string
 *                 enum: [email, mobile]
 *                 example: email
 *             required:
 *               - doctorId
 *               - verifyBy
 *     responses:
 *       200:
 *         description: Login OTP resent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login OTP resent to your email"
 *       400:
 *         description: Missing doctor ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Doctor ID is required"
 *       401:
 *         description: Account not verified
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Please verify your account first."
 *       403:
 *         description: Account pending admin approval
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Pending admin approval."
 *       404:
 *         description: Doctor not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Doctor not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error"
 */

/**
 * @openapi
 * /api/doctors/login/verify-otp:
 *   post:
 *     summary: Verify OTP for doctor login
 *     tags: [Doctors]
 *     parameters:
 *       - in: header
 *         name: doctorid
 *         schema:
 *           type: string
 *         required: true
 *         description: Doctor ID used for verifying login OTP
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               otp:
 *                 type: string
 *                 example: "123456"
 *             required:
 *               - otp
 *     responses:
 *       200:
 *         description: OTP verified successfully, login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "jwt_token_here"
 *                 doctor:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "64a1b2c3d4e5f67890123456"
 *                     name:
 *                       type: string
 *                       example: "Dr. John Doe"
 *                     email:
 *                       type: string
 *                       example: "doctor@example.com"
 *                     gender:
 *                       type: string
 *                       example: "Male"
 *                     age:
 *                       type: integer
 *                       example: 35
 *                     speciality:
 *                       type: string
 *                       example: "Cardiology"
 *                     consultationMode:
 *                       type: string
 *                       example: "Video Consultation"
 *                     hospitalName:
 *                       type: string
 *                       example: "City Hospital"
 *                     hospitalLocation:
 *                       type: string
 *                       example: "Downtown"
 *                     about:
 *                       type: string
 *                       example: "Experienced cardiologist specializing in heart care."
 *                     languages:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["English", "Hindi"]
 *                     location:
 *                       type: string
 *                       example: "Mumbai"
 *                     certification:
 *                       type: string
 *                       example: "Board Certified"
 *                     education:
 *                       type: string
 *                       example: "MBBS, MD"
 *                     university:
 *                       type: string
 *                       example: "AIIMS Delhi"
 *                     experience:
 *                       type: number
 *                       example: 10
 *                     consultationFee:
 *                       type: number
 *                       example: 500
 *                     profileImage:
 *                       type: string
 *                       example: "https://example.com/profile.jpg"
 *                     medicalCertificates:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           type:
 *                             type: string
 *                             example: "Medical License"
 *                           fileUrl:
 *                             type: string
 *                             example: "https://example.com/license.pdf"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-01-01T12:00:00.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-01-02T12:00:00.000Z"
 *       400:
 *         description: Missing doctor ID, invalid, or expired OTP
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid OTP"
 *       404:
 *         description: Doctor not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Doctor not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error"
 */


/**
 * @openapi
 * /api/doctors/forgot-password/request-otp:
 *   post:
 *     summary: Request OTP for doctor password reset
 *     tags: [Doctors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               verifyBy:
 *                 type: string
 *                 enum: [email, mobile]
 *                 example: "email"
 *               value:
 *                 type: string
 *                 example: "doctor@example.com"
 *             required:
 *               - verifyBy
 *               - value
 *     responses:
 *       200:
 *         description: OTP sent successfully for password reset
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "OTP sent to your email"
 *                 doctorId:
 *                   type: string
 *                   example: "64a1b2c3d4e5f67890123456"
 *       400:
 *         description: Missing verifyBy or value fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "verifyBy and value are required"
 *       404:
 *         description: Doctor not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Doctor not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error"
 */


/**
 * @openapi
 * /api/doctors/forgot-password/resend-otp:
 *   post:
 *     summary: Resend OTP for doctor password reset
 *     tags: [Doctors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               doctorId:
 *                 type: string
 *                 example: "64a1b2c3d4e5f67890123456"
 *               verifyBy:
 *                 type: string
 *                 enum: [email, mobile]
 *                 example: "mobile"
 *             required:
 *               - doctorId
 *               - verifyBy
 *     responses:
 *       200:
 *         description: Forgot password OTP resent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Forgot Password OTP resent to your mobile"
 *       400:
 *         description: Missing doctor ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Doctor ID is required"
 *       401:
 *         description: Doctor account not verified
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Please verify your account first."
 *       404:
 *         description: Doctor not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Doctor not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error"
 */

/**
 * @openapi
 * /api/doctors/forgot-password/verify-otp:
 *   post:
 *     summary: Verify OTP for doctor password reset
 *     tags: [Doctors]
 *     parameters:
 *       - in: header
 *         name: doctorid
 *         required: true
 *         schema:
 *           type: string
 *         description: Doctor ID associated with the OTP verification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               otp:
 *                 type: string
 *                 example: "123456"
 *             required:
 *               - otp
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "OTP verified successfully"
 *       400:
 *         description: Missing or invalid doctorId, invalid or expired OTP
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid OTP"
 *       404:
 *         description: Doctor not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Doctor not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error"
 */


/**
 * @openapi
 * /api/doctors/forgot-password/reset:
 *   post:
 *     summary: Reset doctor password after OTP verification
 *     tags: [Doctors]
 *     parameters:
 *       - in: header
 *         name: doctorid
 *         required: true
 *         schema:
 *           type: string
 *         description: Doctor ID associated with the password reset
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *                 example: "newSecurePassword123"
 *             required:
 *               - newPassword
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password updated successfully"
 *       400:
 *         description: Missing doctorId or OTP not verified
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "OTP not verified"
 *       404:
 *         description: Doctor not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Doctor not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error"
 */


/**
 * @openapi
 * /api/doctors/logout:
 *   post:
 *     summary: Logout the currently authenticated doctor
 *     description: Logs out the doctor by marking them inactive and updating their last active timestamp.
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Doctor logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Doctor logged out successfully"
 *                 doctorId:
 *                   type: string
 *                   example: "64a1b2c3d4e5f67890123456"
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Not authorized, token failed"
 *       404:
 *         description: Doctor not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Doctor not found"
 *       500:
 *         description: Error logging out doctor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error logging out doctor"
 */

/**
 * @openapi
 * /api/doctors/profile:
 *   get:
 *     summary: Get the profile of the authenticated doctor
 *     description: Retrieves the currently logged-in doctor’s profile details.
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved doctor profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "64a1b2c3d4e5f67890123456"
 *                 shortId:
 *                   type: string
 *                   example: "JD1234"
 *                 name:
 *                   type: string
 *                   example: "Dr. John Doe"
 *                 mobile:
 *                   type: string
 *                   example: "+911234567890"
 *                 gender:
 *                   type: string
 *                   example: "Male"
 *                 age:
 *                   type: integer
 *                   example: 40
 *                 email:
 *                   type: string
 *                   example: "doctor@example.com"
 *                 areaOfInterest:
 *                   type: string
 *                   example: "Cardiology"
 *                 speciality:
 *                   type: string
 *                   example: "Heart Specialist"
 *                 consultationMode:
 *                   type: string
 *                   example: "Video Consultation"
 *                 hospitalName:
 *                   type: string
 *                   example: "City Hospital"
 *                 hospitalLocation:
 *                   type: string
 *                   example: "Downtown Mumbai"
 *                 about:
 *                   type: string
 *                   example: "Experienced cardiologist with over 10 years of practice."
 *                 languages:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["English", "Hindi"]
 *                 location:
 *                   type: string
 *                   example: "Mumbai"
 *                 certification:
 *                   type: string
 *                   example: "Board Certified"
 *                 education:
 *                   type: string
 *                   example: "MBBS, MD (Cardiology)"
 *                 experience:
 *                   type: number
 *                   example: 12
 *                 consultationFee:
 *                   type: number
 *                   example: 500
 *                 profileImage:
 *                   type: string
 *                   example: "https://example.com/profile.jpg"
 *                 medicalCertificates:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                         example: "Medical License"
 *                       fileUrl:
 *                         type: string
 *                         example: "https://example.com/license.pdf"
 *                 university:
 *                   type: string
 *                   example: "AIIMS Delhi"
 *                 isActive:
 *                   type: boolean
 *                   example: true
 *                 lastActiveAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-28T06:19:45.375Z"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-15T08:46:20.103Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-28T06:19:45.376Z"
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Not authorized, token failed"
 *       404:
 *         description: Doctor not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Doctor not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error"
 */

/**
 * @openapi
 * /api/doctors/toggle-active:
 *   put:
 *     summary: Toggle doctor active/inactive status
 *     description: Allows the authenticated doctor to toggle their active status (e.g., online/offline).
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully toggled doctor active status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Doctor is now inactive"
 *                 isActive:
 *                   type: boolean
 *                   example: false
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Not authorized, token failed"
 *       404:
 *         description: Doctor not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Doctor not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error"
 */


/**
 * @openapi
 * /api/doctors/profile:
 *   put:
 *     summary: Update doctor profile
 *     description: Allows an authenticated doctor to update their profile information and upload related documents/images.
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profileImage:
 *                 type: string
 *                 format: binary
 *                 description: Doctor profile image
 *               govtId:
 *                 type: string
 *                 format: binary
 *                 description: Government ID document
 *               medicalLicense:
 *                 type: string
 *                 format: binary
 *                 description: Medical license document
 *               educationCertificate:
 *                 type: string
 *                 format: binary
 *                 description: Education certificate document
 *               additionalCertificate:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Additional certificates
 *               age:
 *                 type: integer
 *               email:
 *                 type: string
 *               mobile:
 *                 type: string
 *               about:
 *                 type: string
 *               languages:
 *                 type: string
 *                 description: Comma-separated list of languages
 *               location:
 *                 type: string
 *               certification:
 *                 type: string
 *               education:
 *                 type: string
 *               university:
 *                 type: string
 *               experience:
 *                 type: string
 *               consultationFee:
 *                 type: number
 *               consultationMode:
 *                 type: string
 *                 enum: [Online, Clinic Visit, Both]
 *               hospitalName:
 *                 type: string
 *               hospitalLocation:
 *                 type: string
 *               areaOfInterest:
 *                 type: string
 *     responses:
 *       200:
 *         description: Doctor profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Doctor'
 *       400:
 *         description: Invalid request or forbidden fields included
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cannot edit fields: someField"
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Not authorized, token failed"
 *       404:
 *         description: Doctor not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Doctor not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error"
 */

/**
 * @openapi
 * /api/doctors/filter:
 *   get:
 *     summary: Filter doctors based on multiple criteria
 *     description: Retrieve a list of doctors filtered by hospital location, gender, languages, and consultation fee.
 *     tags: [Doctors]
 *     parameters:
 *       - in: query
 *         name: hospitalLocation
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: Filter by one or more hospital locations
 *         style: form
 *         explode: true
 *       - in: query
 *         name: gender
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: Filter by one or more genders
 *         style: form
 *         explode: true
 *       - in: query
 *         name: languages
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: Filter by one or more languages
 *         style: form
 *         explode: true
 *       - in: query
 *         name: consultationFee
 *         schema:
 *           type: array
 *           items:
 *             type: number
 *         description: Filter by one or more consultation fees
 *         style: form
 *         explode: true
 *     responses:
 *       200:
 *         description: List of filtered doctors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Doctor'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error"
 */



/**
 * @openapi
 * /api/doctors/{id}/set-password:
 *   put:
 *     summary: Set password and approve doctor
 *     description: Allows setting a password for a doctor by ID and marks them as approved and verified.
 *     tags: [Doctors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Doctor ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 example: "newStrongPassword123"
 *     responses:
 *       200:
 *         description: Password set and doctor approved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password set and doctor approved"
 *       400:
 *         description: Password not provided or invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password is required"
 *       404:
 *         description: Doctor not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Doctor not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error"
 */

/**
 * @openapi
 * /api/doctors/{id}:
 *   get:
 *     summary: Get doctor by ID
 *     description: Retrieve doctor details by their unique ID. Password is excluded from the response.
 *     tags: [Doctors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Doctor ID
 *     responses:
 *       200:
 *         description: Doctor found and returned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Doctor'
 *       400:
 *         description: Invalid doctor ID format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid doctor ID format"
 *       404:
 *         description: Doctor not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Doctor not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error"
 */

/**
 * @openapi
 * /api/doctors/{id}:
 *   delete:
 *     summary: Delete doctor by ID
 *     description: Deletes a doctor record by ID. Restricted to Admin users.
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Doctor ID
 *     responses:
 *       200:
 *         description: Doctor deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Doctor deleted successfully"
 *       404:
 *         description: Doctor not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Doctor not found"
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Not authorized, token failed"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error"
 */


/**
 * @openapi
 * /api/doctors/{doctorId}/availability:
 *   post:
 *     summary: Add doctor availability
 *     description: Adds available time slots for a doctor on a given date.
 *     tags: [Availability]
 *     parameters:
 *       - in: path
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: string
 *         description: Doctor ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - date
 *               - startTime
 *               - endTime
 *               - slotDuration
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-11-01"
 *               startTime:
 *                 type: string
 *                 example: "09:00"
 *               endTime:
 *                 type: string
 *                 example: "17:00"
 *               slotDuration:
 *                 type: number
 *                 example: 30
 *     responses:
 *       201:
 *         description: Availability added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Availability added"
 *                 availability:
 *                   type: object
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error"
 */

/**
 * @openapi
 * /api/doctors/{doctorId}/availability/{date}:
 *   get:
 *     summary: Get available slots for a doctor
 *     description: Retrieves all available time slots for a doctor on a specific date, excluding already booked slots.
 *     tags: [Availability]
 *     parameters:
 *       - in: path
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: string
 *         description: Doctor ID
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Date to fetch slots for
 *     responses:
 *       200:
 *         description: Available slots returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 doctorId:
 *                   type: string
 *                 date:
 *                   type: string
 *                   format: date
 *                 slots:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       start:
 *                         type: string
 *                         example: "09:00"
 *                       end:
 *                         type: string
 *                         example: "09:30"
 *       400:
 *         description: Invalid doctor ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid doctor ID"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error"
 */

/**
 * @openapi
 * /api/doctors/bookings:
 *   post:
 *     summary: Book a slot with a doctor
 *     description: Books a time slot for a patient with a doctor on a specific date.
 *     tags: [Bookings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - doctorId
 *               - patientId
 *               - date
 *               - slot
 *             properties:
 *               doctorId:
 *                 type: string
 *                 example: "64a12345abcdef6789"
 *               patientId:
 *                 type: string
 *                 example: "64a98765fedcba4321"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-11-01"
 *               slot:
 *                 type: object
 *                 properties:
 *                   start:
 *                     type: string
 *                     example: "09:00"
 *                   end:
 *                     type: string
 *                     example: "09:30"
 *     responses:
 *       201:
 *         description: Slot booked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Slot booked"
 *                 booking:
 *                   type: object
 *       400:
 *         description: Slot already booked
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Slot already booked"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error"
 */



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
    { name: "backgroundImage", maxCount: 1 },
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


