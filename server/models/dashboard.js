const mongoose = require('mongoose');

const DashboardSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  phone_number: { type: String, required: true, unique: true },
  full_name: { type: String, required: true },

  // Health status fields
  heart_rate: { type: Number, default: 0 },
  blood_pressure: { type: String, default: "0/0" },
  most_activities: { type: Number, default: 0 },
  walk: { type: Number, default: 0 },
  run: { type: Number, default: 0 },
  cycling: { type: Number, default: 0 },

  // Medication structure (structured object arrays)
  medication: {
    morning: { tablet1: String, tablet2: String },
    afternoon: { tablet1: String, tablet2: String },
    night: { tablet1: String, tablet2: String }
  },

  // Medicine remainder (flat, just tablet names)
  medicine: {
    morning: { type: String, default: "" },   // e.g., "Aspirin, Vitamin D"
    afternoon: { type: String, default: "" }, // e.g., "Metformin, Omega 3"
    night: { type: String, default: "" }      // e.g., "Melatonin, Calcium"
  },

  createdAt: { type: Date, default: Date.now }

});



module.exports = mongoose.model('Dashboard', DashboardSchema);
