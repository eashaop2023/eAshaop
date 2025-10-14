const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema;

const userDependentSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    full_name: { type: String, required: true, trim: true, minlength: 3 },
    phone_number: {
      type: String,
      required: true,
      unique: true,
      set: (v) => {
        const digits = v.replace(/\D/g, "");
        // Always store in +91XXXXXXXXXX format
        if (digits.length === 10) return `+91${digits}`;
        if (digits.length === 12 && digits.startsWith("91"))
          return `+${digits}`;
        return v;
      },
      validate: {
        validator: function (v) {
          // The validator now checks for the final, normalized format.
          return /^\+91[6-9]\d{9}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    dob: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return value < today;
        },
        message: "Date of Birth must be before today.",
      },
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female", "intersex", "other"],
      set: (v) => v.toLowerCase(),
    },
    address: { type: String, trim: true, minlength: 10 },
    pincode: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^[1-9][0-9]{5}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid PIN code!`,
      },
    },
    relation: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          if (!v) return true;
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email address!`,
      },
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("userDependent", userDependentSchema);