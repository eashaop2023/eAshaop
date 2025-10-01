const userServices = require("../services/userServices");
const { cloudinary } = require("../config/cloudinaryUser.js");
const { generateToken } = require("../utils/jwt");
const bcrypt = require("bcrypt");

// const User = require("../models/user");
const User = require("../models/user.js");
const { generateOTP, sendOTP } = require("../utils/otpHelperUser.js"); 

exports.registerUserApp = async (req, res) => {
  try {
    let { full_name, phone_number, gender, password, email, dob } = req.body;

    if (!full_name || !phone_number || !gender || !password || !email || !dob) {
      return res
        .status(400)
        .json({ message: "All fields including DOB are required" });
    }

    const normalizedPhone = phone_number.replace(/\D/g, "");
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      $or: [{ phone_number }, { email: normalizedEmail }],
    });

    if (existingUser) {
      const field =
        existingUser.phone_number === normalizedPhone
          ? "phone number"
          : "email";
      return res
        .status(400)
        .json({ message: `User with this ${field} already exists` });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      full_name,
      // phone_number: normalizedPhone,
      phone_number,
      gender,
      password: hashedPassword,
      email: normalizedEmail,
      dob,
      otp_verified: true,
      forgot_password_otp: { verified: false },
      login_otp: { verified: false },
      status: true,
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully and verified",
      user: {
        id: newUser._id,
        full_name: newUser.full_name,
        phone_number: newUser.phone_number,
        gender: newUser.gender,
        email: newUser.email,
        dob: newUser.dob,
        otp_verified: newUser.otp_verified,
      },
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// User Registration with OTP
exports.registerUser = async (req, res) => {
  try {
    const { full_name, phone_number, dob, gender, password, email, verifyBy } =
      req.body;
    const method = verifyBy?.toLowerCase(); // "email" or "phone"

    if (!full_name || !phone_number || !dob || !gender || !password) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }

    let normalizedPhone = phone_number.replace(/\D/g, "");
    if (normalizedPhone.length === 10)
      normalizedPhone = `+91${normalizedPhone}`;
    else if (normalizedPhone.length === 12 && normalizedPhone.startsWith("91"))
      normalizedPhone = `+${normalizedPhone}`;

    const existingUser = await User.findOne({
      $or: [{ email }, { phone_number: normalizedPhone }],
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email or phone" });
    }

    const hashedPassword = await bcrypt.hash(password.trim(), 10);

    const otp = Math.floor(1000 + Math.random() * 5000);
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiry

    const user = new User({
      full_name,
      phone_number: normalizedPhone,
      dob,
      gender,
      password: hashedPassword,
      email,
      registration_otp: { code: otp, expires },
    });

    await user.save();

    if (method === "email") {
      await sendOTP({ verifyBy: "email", email, otp });
    } else {
      await sendOTP({ verifyBy: "phone", mobile: normalizedPhone, otp });
    }

    res.status(201).json({
      message: `OTP sent to your ${method}`,
      user: {
        id: user._id,
        full_name: user.full_name,
        phone_number: user.phone_number,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ message: "Registration failed" });
  }
};

//  Verify OTP & Save User
exports.verifyUserOtp = async (req, res) => {
  try {
    const { verifyByValue, otp } = req.body;
    if (!verifyByValue || !otp) {
      return res
        .status(400)
        .json({ message: "verifyByValue and otp are required" });
    }

    // Find the user
    const user = await User.findOne({
      $or: [{ email: verifyByValue }, { phone_number: verifyByValue }],
    });

    if (!user || !user.registration_otp.code) {
      return res
        .status(400)
        .json({ message: "OTP not found or user not registered" });
    }

    // Check OTP expiry
    if (user.registration_otp.expires < new Date()) {
      user.registration_otp = undefined;
      await user.save();
      return res.status(400).json({ message: "OTP has expired" });
    }

    // Verify OTP
    if (Number(user.registration_otp.code) !== Number(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Mark OTP as verified and clear it
    user.otp_verified = true;
    user.registration_otp = undefined;
    await user.save();

    res
      .status(200)
      .json({ message: "User registered successfully", userId: user._id });
  } catch (err) {
    console.error("OTP Verification Error:", err);
    res.status(500).json({ message: "OTP verification failed" });
  }
};

// Resend Registration OTP
exports.resendOtp = async (req, res) => {
  try {
    const { verifyByValue } = req.body;
    if (!verifyByValue) {
      return res.status(400).json({ message: "verifyByValue is required" });
    }

    // Find the user
    const user = await User.findOne({
      $or: [{ email: verifyByValue }, { phone_number: verifyByValue }],
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found or registration not started" });
    }

    // Generate new OTP
    const otp = Math.floor(1000 + Math.random() * 5000);
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiry
    user.registration_otp = { code: otp, expires };
    await user.save();

    // Send OTP
    if (user.email === verifyByValue || verifyByValue.includes("@")) {
      await sendOTP({ verifyBy: "email", email: user.email, otp });
      return res
        .status(200)
        .json({ message: "OTP resent successfully via email" });
    } else if (user.phone_number === verifyByValue) {
      await sendOTP({ verifyBy: "phone", mobile: user.phone_number, otp });
      return res
        .status(200)
        .json({ message: "OTP resent successfully via phone" });
    } else {
      return res.status(400).json({ message: "Invalid verifyByValue" });
    }
  } catch (err) {
    console.error("Resend OTP Error:", err);
    res.status(500).json({ message: "Failed to resend OTP" });
  }
};

// === Send Login OTP ===
exports.sendLoginOTP = async (req, res) => {
  try {
    const { value, verifyBy } = req.body;
    if (!value || !verifyBy)
      return res
        .status(400)
        .json({ message: "Value and verifyBy are required" });

    const method = verifyBy.toLowerCase();
    if (method !== "email" && method !== "phone")
      return res
        .status(400)
        .json({ message: "verifyBy must be 'email' or 'phone'" });

    const user =
      method === "email"
        ? await User.findOne({ email: value })
        : await User.findOne({ phone_number: value });

    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOTP();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiry

    // Save OTP in DB
    user.login_otp = { code: otp, expires, verified: false };
    await user.save();

    await sendOTP({
      verifyBy: method,
      email: user.email,
      mobile: user.phone_number,
      otp,
    });

    res.json({ message: `OTP sent to your ${method}` });
  } catch (err) {
    console.error("Send Login OTP error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// === Verify Login OTP ===
exports.verifyLoginOTP = async (req, res) => {
  try {
    const { value, otp } = req.body; // value = email or phone
    if (!value || !otp)
      return res.status(400).json({ message: "Value and OTP are required" });

    const user = value.includes("@")
      ? await User.findOne({ email: value })
      : await User.findOne({ phone_number: value });

    if (!user) return res.status(404).json({ message: "User not found" });

    const loginOtp = user.login_otp;

    if (!loginOtp || !loginOtp.code)
      return res
        .status(400)
        .json({ message: "OTP not found, request login OTP first" });

    if (loginOtp.expires < Date.now())
      return res.status(400).json({ message: "OTP expired" });

    if (Number(loginOtp.code) !== Number(otp))
      return res.status(400).json({ message: "Invalid OTP" });

    // Mark OTP as verified
    user.login_otp.verified = true;
    user.login_otp.code = null; // optional: clear OTP after verification
    await user.save();

    const token = generateToken(user._id);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        full_name: user.full_name,
        email: user.email,
        phone_number: user.phone_number,
        DOB: user.DOB,
        gender: user.gender,
      },
    });
  } catch (err) {
    console.error("Login OTP verification error:", err);
    res.status(500).json({ message: "OTP verification failed" });
  }
};

// === Resend Login OTP ===
exports.resendLoginOTP = async (req, res) => {
  try {
    const { value, verifyBy } = req.body;
    if (!value || !verifyBy)
      return res
        .status(400)
        .json({ message: "Value and verifyBy are required" });

    const method = verifyBy.toLowerCase();
    if (method !== "email" && method !== "phone")
      return res
        .status(400)
        .json({ message: "verifyBy must be 'email' or 'phone'" });

    const user =
      method === "email"
        ? await User.findOne({ email: value })
        : await User.findOne({ phone_number: value });

    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOTP();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiry

    // Update OTP in DB
    user.login_otp = { code: otp, expires, verified: false };
    await user.save();

    await sendOTP({
      verifyBy: method,
      email: user.email,
      mobile: user.phone_number,
      otp,
    });

    res.json({ message: `OTP resent to your ${method}` });
  } catch (err) {
    console.error("Resend Login OTP error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// === Login with Password ===
exports.login = async (req, res) => {
  try {
    let { phone_number, password, email } = req.body;

    if ((!phone_number && !email) || !password) {
      return res
        .status(400)
        .json({ message: "Phone number or email and password are required" });
    }

    let normalizedPhone = null;
    if (phone_number) {
      phone_number = phone_number.trim();
      normalizedPhone = phone_number.replace(/\D/g, "");
      if (normalizedPhone.length === 10)
        normalizedPhone = `+91${normalizedPhone}`;
      else if (
        normalizedPhone.length === 12 &&
        normalizedPhone.startsWith("91")
      )
        normalizedPhone = `+${normalizedPhone}`;
    }

    const searchCondition = email
      ? { email: email.trim().toLowerCase() }
      : { phone_number: normalizedPhone };

    const user = await User.findOne(searchCondition);
    if (!user) {
      console.log("User not found in DB");
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.otp_verified) {
      console.log("User OTP not verified");
      return res
        .status(401)
        .json({ message: "User registration not verified with OTP" });
    }

    const isValid = await bcrypt.compare(password.trim(), user.password);
    if (!isValid)
      return res.status(401).json({ message: "Invalid login credentials" });

    const token = generateToken({
      id: user._id,
      phone_number: user.phone_number,
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        full_name: user.full_name,
        phone_number: user.phone_number,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// === Send Forgot Password OTP ===
// userController.js
// exports.forgotPasswordSendOTP = async (req, res) => {
//   try {
//     const { verifyBy, value } = req.body; // verifyBy: "email" | "phone"

//     if (!verifyBy || !value)
//       return res.status(400).json({ message: "verifyBy and value are required" });

//     const method = verifyBy.toLowerCase();
//     if (method !== "email" && method !== "phone")
//       return res.status(400).json({ message: "verifyBy must be 'email' or 'phone'" });

//     // ONLY check the user collection here
//     const user =
//       method === "email"
//         ? await User.findOne({ email: value })
//         : await User.findOne({ phone_number: value });

//     if (!user) {
//       // THIS IS CRUCIAL: return 404 if user not found
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Generate OTP
//     const otp = generateOTP(); // Your OTP generator function
//     const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiry

//     // Save OTP in DB
//     user.forgot_password_otp = { code: otp, expires, verified: false };
//     await user.save();


// controllers/userController.js (example location)

// Forgot Password: Send OTP (for USERS only)
// exports.forgotPasswordSendOTP = async (req, res) => {
//   try {
//     const { value } = req.body;
//     if (!value) return res.status(400).json({ message: "Value required" });

//     const isEmail = /\S+@\S+\.\S+/.test(value);
//     const isPhone = /^\d{10}$/.test(value);

//     if (!isEmail && !isPhone) {
//       return res.status(400).json({ message: "Invalid email or phone format" });
//     }

//     // 🔍 Case-insensitive doctor email check
//     const doctorExists = isEmail
//       ? await Doctor.findOne({ email: new RegExp("^" + value + "$", "i") })
//       : await Doctor.findOne({ phone_number: value });

//     if (doctorExists) {
//       return res.status(400).json({
//         message: "This account belongs to a doctor. Please use doctor forgot password.",
//       });
//     }

//     // ✅ Only allow users
//     const user = isEmail
//       ? await User.findOne({ email: new RegExp("^" + value + "$", "i") })
//       : await User.findOne({ phone_number: value });

//     if (!user) {
//       return res.status(404).json({ message: "User not found." });
//     }

//     // OTP creation & sending logic...
//     const otpCode = Math.floor(1000 + Math.random() * 5000).toString();
//     const hashedOTP = await bcrypt.hash(otpCode, 10);

//     await OTP.create({
//       userId: user._id,
//       otp: hashedOTP,
//       createdAt: new Date(),
//       expiresAt: new Date(Date.now() + 5 * 60 * 1000),
//     });

//     await sendOTP({
//       verifyBy: isEmail ? "email" : "phone",
//       email: user.email,
//       mobile: user.phone_number,
//       otp: otpCode,
//     });

//     return res.status(200).json({
//       message: `OTP sent to your ${isEmail ? "email" : "phone"}`,
//       userId: user._id,
//     });
//   } catch (err) {
//     console.error("Send Forgot Password OTP Error:", err);
//     return res.status(500).json({ message: "Failed to send OTP" });
//   }
// };

// === Resend Forgot Password OTP ===
// Forgot Password: Send OTP (for USERS only)
// Forgot Password: Send OTP (for USERS only)

exports.forgotPasswordSendOTP = async (req, res) => {
  try {
    const { verifyBy, value } = req.body;

    if (!value) {
      console.log("No value provided in request body");
      return res.status(400).json({ message: `${verifyBy || "Identifier"} is required` });
    }

    let user;
    if (verifyBy === "email") {
      const email = value.trim().toLowerCase();
      console.log("Looking for user with email:", email);
      user = await User.findOne({ email });
    } else if (verifyBy === "phone") {
      const phone = value;
      console.log("Looking for user with phone:", phone);
      user = await User.findOne({ phone_number: phone });
    } else {
      return res.status(400).json({ message: "Invalid verifyBy value" });
    }

    if (!user) {
      console.log("User not found in DB");
      return res.status(404).json({ message: "User not found" });
    }

    // Generate OTP
    const OTP = generateOTP();
    console.log("Generated OTP:", OTP);

    // Send OTP
    if (verifyBy === "email") {
      await sendOTP({ verifyBy: "email", email: user.email, otp: OTP });
    } else {
      await sendOTP({ verifyBy: "phone", mobile: user.phone_number, otp: OTP });
    }

    // Save OTP
    user.forgot_password_otp.code = OTP;
    user.forgot_password_otp.expires = Date.now() + 10 * 60 * 1000; // 10 min
    user.forgot_password_otp.verified = false;
    await user.save();

    console.log("OTP saved successfully for user:", user._id);
    res.status(200).json({ message: "OTP sent successfully", userId: user._id });
  } catch (error) {
    console.error("Send Forgot Password OTP Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



exports.resendForgotOTP = async (req, res) => {
  try {
    const { verifyBy, value } = req.body;

    if (!value) {
      return res.status(400).json({ message: `${verifyBy || "Identifier"} is required` });
    }

    let user;
    if (verifyBy === "email") {
      const email = value.trim().toLowerCase();
      user = await User.findOne({ email });
    } else if (verifyBy === "phone") {
      const phone = value;
      user = await User.findOne({ phone_number: phone });
    } else {
      return res.status(400).json({ message: "Invalid verifyBy value" });
    }

    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate new OTP
    const OTP = generateOTP();

    // Send OTP
    if (verifyBy === "email") {
      await sendOTP({ verifyBy: "email", email: user.email, otp: OTP });
    } else {
      await sendOTP({ verifyBy: "phone", mobile: user.phone_number, otp: OTP });
    }

    // Update OTP in DB
    user.forgot_password_otp.code = OTP;
    user.forgot_password_otp.expires = Date.now() + 10 * 60 * 1000; // 10 min
    user.forgot_password_otp.verified = false;
    await user.save();

    res.status(200).json({ message: "OTP resent successfully", userId: user._id });
  } catch (error) {
    console.error("Resend Forgot OTP Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.verifyForgotOTP = async (req, res) => {
  try {
    const { verifyBy, value, otp } = req.body;

    if (!value || !otp) {
      return res.status(400).json({ message: "Identifier and OTP are required" });
    }

    let user;
    if (verifyBy === "email") {
      const email = value.trim().toLowerCase();
      user = await User.findOne({ email });
    } else if (verifyBy === "phone") {
      const phone = value;
      user = await User.findOne({ phone_number: phone });
    } else {
      return res.status(400).json({ message: "Invalid verifyBy value" });
    }

    if (!user) return res.status(404).json({ message: "User not found" });

    const otpRecord = user.forgot_password_otp;

    if (!otpRecord.code || otpRecord.verified) {
      return res.status(400).json({ message: "OTP already used or not generated" });
    }

    if (Date.now() > otpRecord.expires) {
      return res.status(400).json({ message: "OTP expired" });
    }

    if (otpRecord.code !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // OTP is valid
    user.forgot_password_otp.verified = true;
    await user.save();

    res.status(200).json({ message: "OTP verified successfully", userId: user._id });
  } catch (error) {
    console.error("Verify Forgot OTP Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



// === Reset Password ===
exports.resetPassword = async (req, res) => {
  try {
    const { value, newPassword } = req.body;
    if (!value || !newPassword)
      return res
        .status(400)
        .json({ message: "value and newPassword are required" });

    // Find user
    const user = await User.findOne({
      $or: [{ email: value }, { phone_number: value }],
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    const stored = user.forgot_password_otp;
    if (!stored || !stored.verified)
      return res.status(400).json({ message: "OTP not verified or expired" });

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.forgot_password_otp = null; // clear OTP
    await user.save();

    return res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset Password Error:", err);
    return res.status(500).json({ message: "Failed to reset password" });
  }
};

// === User Logout ===
exports.user_logout = async (req, res) => {
  const response = await userServices.user_logout(req.body);
  res.status(200).send(response);
};

// exports.resetPassword = async (req, res) => {
//   const response = await userServices.resetPassword(req.body);
//   res.status(200).send(response);
// };

// --- Upload Profile Image ---
exports.uploadProfileImage = async (req, res) => {
  try {
    const userId = req.params.id.trim(); // <-- trim here
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const imageUrl = req.file.path;

    const user = await userServices.uploadeProfileImage(userId, imageUrl);

    res.status(200).json({
      message: "Profile image uploaded successfully",
      imageUrl,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// --- Update Profile Image ---
exports.updateProfileImage = async (req, res) => {
  try {
    const userId = req.params.id.trim();

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "profile_images",
      overwrite: true,
    });

    const imageUrl = result.secure_url;

    const updatedUser = await userServices.updateProfileImage(userId, imageUrl);

    res.status(200).json({
      message: "Profile image updated successfully",
      imageUrl,
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await userServices.getAllUsers();
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get a particular user
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await userServices.getUserById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update a particular user (except full_name and phone_number)
exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const updateData = { ...req.body };

    delete updateData.full_name;
    delete updateData.phone_number;

    const updatedUser = await userServices.updateUserProfile(
      userId,
      updateData
    );
    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      message: "User profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Upload multiple documents
exports.uploadDocuments = async (req, res) => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const uploadedDocs = req.files.map((file) => ({
      public_id: file.filename || file.originalname.split(".")[0],
      url: file.path || file.secure_url, // Cloudinary URL
      format: file.mimetype,
      fileName: file.originalname,
      size: file.size,
      uploadedAt: new Date(),
    }));

    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { $push: { documents: { $each: uploadedDocs } } },
      { new: true }
    );

    res.status(200).json({
      message: "Documents uploaded successfully",
      documents: uploadedDocs,
    });
  } catch (error) {
    console.error("Error uploading documents:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all documents for a user
exports.getDocuments = async (req, res) => {
  try {
    const userId = req.params.userId;
    const docs = await userServices.getDocuments(userId);
    res.status(200).json({ documents: docs });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching documents", error: err.message });
  }
};

/* // Update (replace) a document
exports.updateDocument = async (req, res) => {
 try {
    const { userId, public_id } = req.params;

    // Full documents array replacement
    const documentsFiles = req.files ? req.files.filter(f => f.fieldname === "documents") : [];
    if (documentsFiles.length > 0) {
      const updatedUser = await userServices.updateDocument(userId, null, documentsFiles, true);
      return res.status(200).json({
        message: "Documents array replaced successfully",
        documents: updatedUser.documents
      });
    }

    // Single file replacement
    const singleFile = req.file ? req.file : null;
    if (singleFile && public_id) {
      const updatedUser = await userServices.updateDocument(userId, public_id, singleFile, false);
      return res.status(200).json({
        message: "Document updated successfully",
        documents: updatedUser.documents
      });
    }

    return res.status(400).json({ message: "No file uploaded or incorrect key" });

  } catch (err) {
    res.status(500).json({ message: "Error updating document", error: err.message });
  }
}; */

