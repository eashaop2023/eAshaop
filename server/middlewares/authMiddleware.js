

const jwt = require("jsonwebtoken");
const Doctor = require("../models/doctorModel");

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      console.log("Decoded JWT:", decoded); 

      const doctor = await Doctor.findById(decoded.id).select("isActive lastActiveAt");
if (!doctor) return res.status(404).json({ message: "Doctor not found" });

if (!doctor.isActive) {
  return res.status(401).json({ message: "Doctor is inactive. Please log in again." });
}

doctor.lastActiveAt = Date.now();
await doctor.save();

req.doctor = doctor;
next();

    } catch (err) {
      console.error("JWT verification failed:", err);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};
