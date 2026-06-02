const jwt = require("jsonwebtoken");

/**
 * Generate JWT token for user or doctor
 * @param {String} id - user._id or doctor._id
 * @param {String} role - 'user' or 'doctor'
 */
const generateToken = (id,role) => {
  return jwt.sign(
    { id, role }, // include role in payload
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null; // if token is invalid or expired
  }
};


module.exports = { generateToken,verifyToken };
