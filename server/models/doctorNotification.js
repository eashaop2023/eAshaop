const mongoose = require("mongoose");

const doctorNotificationSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
   message: {
    text: { type: String, required: true, trim: true }, // ✅ notification content
    createdAt: { type: Date, default: Date.now, required: true }, // ✅ timestamp when sent
    expiresAt: {
      type: Date,
      required: true, // ✅ must have expiry
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // expires in 24 hours
    },
  },
  isRead: { type: Boolean, default: false },
});
doctorNotificationSchema.index({"message.expiresAt":1},{expireAfterSeconds:0});

module.exports = mongoose.model("DoctorNotification", doctorNotificationSchema);
