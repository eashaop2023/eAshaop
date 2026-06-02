const mongoose = require("mongoose");

const receiptSchema = new mongoose.Schema({
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true
  },
  appointmentNumber: {
    type: String,
    required: true
  },
  // Doctor Details
  doctorDetails: {
    name: { type: String, required: true },
    speciality: { type: String },
    email: { type: String },
    mobile: { type: String },
    hospitalName: { type: String },
    hospitalLocation: { type: String }
  },
  // Patient Details
  patientDetails: {
    name: { type: String, required: true },
    age: { type: String },
    gender: { type: String },
    email: { type: String },
    mobile: { type: String },
    address: { type: String },
    pincode: { type: String }
  },
  // Appointment Details
  appointmentDetails: {
    date: { type: Date, required: true },
    time: { type: String, required: true },
    type: { type: String, enum: ["video", "clinic"], required: true },
    status: { type: String, required: true }
  },
  // Payment Details
  paymentDetails: {
    amount: { type: Number, required: true },
    paymentMethod: { type: String, default: "Pay at Clinic" },
    status: { type: String, default: "Pending" }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model("Receipt", receiptSchema, "receipts");

