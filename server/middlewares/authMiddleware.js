const { verifyToken } = require("../utils/jwt");
const Doctor = require("../models/doctorModel");
const User = require("../models/user");

exports.protect = async (req, res, next) => {
  let token;

  // 1️⃣ Extract token
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }

  // 2️⃣ Verify token using helper
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  console.log("Decoded JWT:", decoded);

  try {
    // 3️⃣ Fetch and validate based on role
    let userDoc;

    if (decoded.role === "doctor") {
      userDoc = await Doctor.findById(decoded.id).select("isActive lastActiveAt");
    } else if (decoded.role === "user") {
      userDoc = await User.findById(decoded.id).select("isActive lastActiveAt");
    } else {
      return res.status(400).json({ message: "Invalid token role" });
    }

    if (!userDoc) {
      return res.status(404).json({ message: `${decoded.role} not found` });
    }

    if (!userDoc.isActive) {
      return res.status(401).json({ message: `${decoded.role} is inactive. Please log in again.` });
    }

    // 4️⃣ Update last activity
    userDoc.lastActiveAt = Date.now();
    await userDoc.save();

    // 5️⃣ Attach to request properly (✅ FIXED)
    if (decoded.role === "doctor") {
      req.doctor = userDoc;
    } else if (decoded.role === "user") {
      req.user = userDoc;
    }
    req.userType = decoded.role;
    // 6️⃣ Continue
    next();
  } catch (err) {
    console.error("Protect middleware error:", err.message);
    return res.status(500).json({ message: "Server error while validating user" });
  }
};
