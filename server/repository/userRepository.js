const User = require("../models/user");
const { Vonage } = require("@vonage/server-sdk");
const jwt = require("jsonwebtoken");

// Vonage setup
const vonage = new Vonage({
  apiKey: process.env.VONAGE_API_KEY,
  apiSecret: process.env.VONAGE_API_SECRET,
});

const pendingUsers = {};

// Helper: Mask phone number

function maskPhoneNumber(phone) {
  const str = phone.toString();
  return str.replace(/.(?=.{4})/g, "*");
}

// Helper: Format Indian phone number to E.164 (+91) format

function formatPhoneNumber(phone) {
  let num = phone.toString().trim();
  if (/^\d{10}$/.test(num)) {
    return "+91" + num;
  }
  if (num.startsWith("0") && num.length === 11) {
    return "+91" + num.slice(1);
  }
  return num;
}

/* // Registration - Send OTP

const registration_sendOtp = async (body) => {
  try {
    let { phone_number } = body;
    phone_number = formatPhoneNumber(phone_number);

    const existingUser = await User.findOne({ phone_number });
    if (existingUser) return { status: false, message: "User already exists" };

    const otp = Math.floor(1000 + Math.random() * 5000).toString();
    const text = `Your OTP code is: ${otp} (valid for 5 minutes)`;

    // Send OTP via Vonage SMS
    await vonage.sms.send({ to: phone_number, from: "VonageAPI", text });

    // Store OTP + user data temporarily
    pendingUsers[phone_number] = {
      userData: { ...body, phone_number },
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
      purpose: "registration",
    };

    console.log(`OTP sent to ${phone_number}: ${otp}`);
    return {
      status: true,
      message: "OTP sent successfully",
      maskedPhone: maskPhoneNumber(phone_number),
    };
  } catch (err) {
    console.error(" Failed to send OTP:", err.message);
    return { status: false, message: "Failed to send OTP", error: err.message };
  }
};


// Registration - Verify OTP

const registration_verifyOtp = async (body) => {
  try {
    let { phone_number, code } = body;
    phone_number = formatPhoneNumber(phone_number);

    const pending = pendingUsers[phone_number];
    if (!pending || pending.purpose !== "registration")
      return { status: false, message: "No OTP found or expired" };

    if (Date.now() > pending.expiresAt) {
      delete pendingUsers[phone_number];
      return { status: false, message: "OTP expired" };
    }

    if (pending.otp === code) {
      const userData = pending.userData;
      userData.otp_verified = true;
      const user = new User(userData);
      const details = await user.save();

      delete pendingUsers[phone_number];

      console.log(` OTP verified for ${phone_number}`);
      return {
        status: true,
        message: "OTP verified successfully",
        docs: details,
      };
    }

    return { status: false, message: "Invalid OTP" };
  } catch (err) {
    console.error(" OTP verification failed:", err.message);
    return {
      status: false,
      message: "OTP verification failed",
      error: err.message,
    };
  }
}; */

// Login

/* const user_login = async (body) => {
  try {
    let { phone_number, password } = body;
    phone_number = formatPhoneNumber(phone_number);

    const user = await User.findOne({ phone_number });
    if (!user) return { status: false, message: "User not found" };

    if (user.password !== password)
      return { status: false, message: "Invalid password" };

    if (!user.otp_verified)
      return { status: false, message: "OTP not verified" };

    const token = jwt.sign(
      { userId: user.userId, phone_number: user.phone_number },
      process.env.JWT_SECRET
    );

    user.tokens.push(token);
    await user.save();

    console.log(`User logged in: ${phone_number}`);
    return { status: true, message: "Login successful", token };
  } catch (err) {
    console.error("Login failed:", err.message);
    return { status: false, message: "Login failed", error: err.message };
  }
}; */

// Logout

const user_logout = async (token) => {
  try {
    const user = await User.findOne({ tokens: token });

    if (user) {
      user.tokens = user.tokens.filter((t) => t !== token);
      await user.save();
      console.log(`Token invalidated for ${user.phone_number}`);
    }

    return { status: true, message: "Logged out successfully" };
  } catch (err) {
    console.error("Logout failed:", err.message);
    return { status: false, message: "Logout failed", error: err.message };
  }
};

/* // Resend OTP

const registration_resendOtp = async (body) => {
  try {
    let { phone_number } = body;
    phone_number = formatPhoneNumber(phone_number);

    const pending = pendingUsers[phone_number];
    if (!pending)
      return { status: false, message: "No pending OTP for this number" };

    const newOtp = Math.floor(1000 + Math.random() * 5000).toString();
    const text = `Your new OTP code is: ${newOtp} (valid for 5 minutes)`;

    await vonage.sms.send({ to: phone_number, from: "VonageAPI", text });

    pending.otp = newOtp;
    pending.expiresAt = Date.now() + 5 * 60 * 1000;

    console.log(`New OTP sent to ${phone_number}: ${newOtp}`);
    return { status: true, message: "New OTP sent successfully" };
  } catch (err) {
    console.error(" Failed to resend OTP:", err.message);
    return {
      status: false,
      message: "Failed to resend OTP",
      error: err.message,
    };
  }
}; */

/* 
// Forgot Password - Send OTP

const forgotPassword_sendOtp = async (body) => {
  try {
    let { phone_number } = body;
    phone_number = formatPhoneNumber(phone_number);

    const user = await User.findOne({ phone_number });
    if (!user) return { status: false, message: "No account found" };

    const otp = Math.floor(1000 + Math.random() * 5000).toString();
    const text = `Your password reset OTP is: ${otp} (valid for 5 minutes)`;

    await vonage.sms.send({ to: phone_number, from: "VonageAPI", text });

    pendingUsers[phone_number] = {
      phone_number,
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
      purpose: "forgotPassword",
    };

    console.log(`Forgot password OTP sent to ${phone_number}: ${otp}`);
    return {
      status: true,
      message: "OTP sent for password reset",
      maskedPhone: maskPhoneNumber(phone_number),
    };
  } catch (err) {
    console.error("Failed to send forgot password OTP:", err.message);
    return { status: false, message: "Failed to send OTP", error: err.message };
  }
};
 */

/* // Forgot Password - Verify OTP

const forgotPassword_verifyOtp = async (body) => {
  try {
    let { phone_number, code } = body;
    phone_number = formatPhoneNumber(phone_number);

    const pending = pendingUsers[phone_number];
    if (!pending || pending.purpose !== "forgotPassword")
      return { status: false, message: "No OTP found or expired" };

    if (Date.now() > pending.expiresAt) {
      delete pendingUsers[phone_number];
      return { status: false, message: "OTP expired" };
    }

    if (pending.otp === code) {
      pending.verified = true;
      console.log(`OTP verified for password reset: ${phone_number}`);
      return {
        status: true,
        message: "OTP verified. You can now reset your password.",
      };
    }

    return { status: false, message: "Invalid OTP" };
  } catch (err) {
    console.error(" OTP verification for forgot password failed:", err.message);
    return {
      status: false,
      message: "OTP verification failed",
      error: err.message,
    };
  }
}; */

/* 
// Forgot Password - Resend OTP

const forgotPassword_resendOtp = async (body) => {
  try {
    let { phone_number } = body;
    phone_number = formatPhoneNumber(phone_number);

    const pending = pendingUsers[phone_number];
    if (!pending || pending.purpose !== "forgotPassword") {
      return { status: false, message: "No pending OTP for this number" };
    }

    const newOtp = Math.floor(1000 + Math.random() * 5000).toString();
    const text = `Your new password reset OTP is: ${newOtp} (valid for 5 minutes)`;

    await vonage.sms.send({ to: phone_number, from: "VonageAPI", text });

    pending.otp = newOtp;
    pending.expiresAt = Date.now() + 5 * 60 * 1000;

    console.log(`New forgot password OTP sent to ${phone_number}: ${newOtp}`);
    return { status: true, message: "New OTP sent successfully" };
  } catch (err) {
    console.error(" Failed to resend forgot password OTP:", err.message);
    return {
      status: false,
      message: "Failed to resend OTP",
      error: err.message,
    };
  }
}; */

// Forgot Password - Reset Password

// const resetPassword = async (body) => {
//   try {
//     let { phone_number, oldPassword, newPassword, confirmPassword } = body;
//     phone_number = formatPhoneNumber(phone_number);

//     if (!phone_number || !newPassword || !confirmPassword)
//       return { status: false, message: "Missing required fields" };

//     if (newPassword !== confirmPassword)
//       return {
//         status: false,
//         message: "New password and confirm password do not match",
//       };

//     const user = await User.findOne({ phone_number });
//     if (!user) return { status: false, message: "User not found" };

//     if (oldPassword) {
//       // Change password flow
//       if (user.password !== oldPassword)
//         return { status: false, message: "Old password is incorrect" };

//       user.password = newPassword;
//       await user.save();

//       console.log(` Password changed successfully for ${phone_number}`);
//       return { status: true, message: "Password changed successfully" };
//     } else {
//       // Forgot password flow
//       const pending = pendingUsers[phone_number];
//       if (!pending || !pending.verified || pending.purpose !== "forgotPassword")
//         return { status: false, message: "OTP not verified or expired" };

//       user.password = newPassword;
//       await user.save();

//       delete pendingUsers[phone_number];

//       console.log(` Password reset successfully for ${phone_number}`);
//       return { status: true, message: "Password reset successfully" };
//     }
//   } catch (err) {
//     console.error(" Password update failed:", err.message);
//     return {
//       status: false,
//       message: "Password update failed",
//       error: err.message,
//     };
//   }
// };

//  Uploade profile image

const uploadeProfileImage = async (userId, imageUrl) => {
  return await User.findByIdAndUpdate(
    userId,
    { profileImage: imageUrl },
    { new: true }
  );
};

// Update profile image

const updateProfileImage = async (userId, imageUrl) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profileImage: imageUrl },
      { new: true }
    );
    return updatedUser;
  } catch (error) {
    throw new Error("Error updating profile image: " + error.message);
  }
};

// Get all users

const getAllUsers = async () => {
  return await User.find({});
};

// Get user by ID

const getUserById = async (userId) => {
  return await User.findById(userId);
};

// Update user profile (except full_name and phone_number)

const updateUserProfile = async (userId, updateData) => {
  return await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true, runValidators: true }
  );
};

// upload multiple documents

const addDocuments = async (userId, docs) => {
  return await User.findByIdAndUpdate(
    userId,
    { $push: { documents: { $each: docs } } },
    { new: true }
  );
};

// Get all documents for a user

const getUserDocuments = async (userId) => {
  const user = await User.findById(userId).select("documents");
  return user ? user.documents : [];
};

/* const updateDocument = async (userId, public_id, newDocOrArray, isFullArray = false) => {
  let updatedUser;

  if (isFullArray) {
    updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { documents: newDocOrArray } },
      { new: true }
    );
  } else {
    updatedUser = await User.findOneAndUpdate(
      { _id: userId, "documents.public_id": public_id },
      { $set: { "documents.$": newDocOrArray } },
      { new: true }
    );
  }

  if (!updatedUser) {
    throw new Error(isFullArray ? "User not found" : "Document not found");
  }

  return updatedUser;
};
 */
// ======================
// EXPORT ALL FUNCTIONS
// ======================
module.exports = {
  //  registration_sendOtp,
  //registration_verifyOtp,
  // user_login,
  user_logout,
  //  registration_resendOtp,
  //forgotPassword_sendOtp,
  //forgotPassword_resendOtp,
  //forgotPassword_verifyOtp,
  // resetPassword,
  uploadeProfileImage,
  updateProfileImage,
  getAllUsers,
  getUserById,
  updateUserProfile,
  addDocuments,
  getUserDocuments,
  // updateDocument,
};
