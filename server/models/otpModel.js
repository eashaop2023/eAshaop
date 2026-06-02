const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  identifier: { type: String, required: true }, // email or mobile
  otp: { type: Number, required: true },
  method: { type: String, enum: ["phone","mobile","email"], required: true },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("OTP", otpSchema);
