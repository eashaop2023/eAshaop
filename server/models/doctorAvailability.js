const mongoose = require("mongoose");

const doctorAvailabilitySchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  
  date: {
    type: String,
    required: true,
  },
  startTime: {
    type: String, 
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  slotDuration: {
    type: Number, 
    default: 30,
  },
});

module.exports = mongoose.model("DoctorAvailability", doctorAvailabilitySchema);
 