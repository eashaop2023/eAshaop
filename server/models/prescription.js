const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },       // Medicine name
  dosage: { type: String, required: true },     // e.g., 500mg
  frequency: { type: String, required: true },  // e.g., Twice a day
  duration: { type: String, required: true },   // e.g., 5 days
  instruction: { type: String },                // e.g., After food
   quantity: { type: Number, required: true },   // e.g., number of tablets
  refills: { type: Number, default: 0 },        // Number of refills allowed

});

const prescriptionSchema = new mongoose.Schema(
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

    patientName: { type: String, required: true },
    patientAge: { type: Number, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true }, 
    hospitalName: { type: String }, 

    medicines: [medicineSchema],
    testsRecommended: [{ type: String }],

    advice: { type: String },

    pdfUrl: { type: String },
  },
  { timestamps: true }
);

const Prescription = mongoose.model("Prescription", prescriptionSchema);
module.exports = Prescription;
