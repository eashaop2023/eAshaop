const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    date: {
      type: Date, 
      required: true,
    },
    slot: {
      start: { type: String, required: true }, 
      end: { type: String, required: true },   
    },
    status: {
      type: String,
      enum: ["booked", "cancelled", "completed"],
      default: "booked",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
