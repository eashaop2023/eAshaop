const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { nanoid } = require("nanoid/non-secure");

const doctorSchema = new mongoose.Schema(
  {
    shortId: {
      type: String,
      default: () => nanoid(10),
      unique: true,
      index: true,
    },
    name: { type: String, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    age: { type: Number, required: true },
    email: { type: String, unique: true, sparse: true },
    mobile: { type: String, unique: true, sparse: true },
    password: { type: String, required: false }, // optional for OTP login
    verifyBy: {
      type: String,
      enum: ["email", "phone"],
      default: "email", // doctor chooses how they verify
    },
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: String },
    verificationCodeExpire: { type: Date },
    isApproved: {
      type: Boolean,
      default: false,
    },

    loginOTP: String,
    loginOTPExpire: Date,

    resetOTP: { type: String },
    resetOTPExpire: { type: Date },
    resetOTPVerified: { type: Boolean, default: false },

    speciality: { type: String, required: true },
    experience: { type: Number, default: 0 },
    consultationFee: { type: Number, default: 0 },
    about: { type: String, default: "" },
    languages: [{ type: String }],
    areaOfInterest: { type: String },
    education: { type: String },
    university: { type: String },
    certification: { type: String },
    medicalCertificates: [
      {
        type: { type: String },
        fileUrl: { type: String },
      },
    ],

    consultationMode: {
      type: String,
      enum: ["Clinic Visit", "Video Consultation", "Both"],
      required: true,
    },
    hospitalName: {
      type: String,
      validate: {
        validator: function (value) {
          if (
            (this.consultationMode === "Clinic Visit" ||
              this.consultationMode === "Both" ||
              this.consultationMode === "Video Consultation") &&
            !value
          ) {
            return false;
          }
          return true;
        },
        message:
          "Hospital name is required for Clinic Visit, Video Consultation, or Both",
      },
    },
    appointments: [
      {
        appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
        type: { type: String },
        date: { type: Date },
        time: { type: String },
        jitsiLink: { type: String, default: null },
        dependent: {
          fullName: String,
          dob: Date,
          mobile: String,
          email: String,
          gender: String,
          relation: String,
          address: String,
          pincode: String,
        },
        status: { type: String },
      },
    ],

    hospitalLocation: {
      type: String,
      validate: {
        validator: function (value) {
          if (
            (this.consultationMode === "Clinic Visit" ||
              this.consultationMode === "Both") &&
            !value
          ) {
            return false;
          }
          return true;
        },
        message: "Hospital location is required for Clinic Visit or Both",
      },
    },
    backgroundImage:{type:String},
    profileImage: { type: String },
    isActive: { type: Boolean, default: true },
    lastActiveAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

doctorSchema.pre("save", async function (next) {
  if (!this.password) return next();

  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

doctorSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

doctorSchema.pre("save", function (next) {
  if (typeof this.languages === "string") {
    this.languages = this.languages.split(",").map((lang) => lang.trim());
  }
  next();
});

module.exports = mongoose.model("Doctor", doctorSchema);
