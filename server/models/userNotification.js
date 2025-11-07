const mongoose = require("mongoose");
const userNotificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
      text: { type: String, required: true, trim: true },
      createdAt: { type: Date, default: Date.now,required:true },
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
        required:true
      },
    },
  isRead: { type: Boolean, default: false },
},
);
userNotificationSchema.index({"message.expiresAt":1},{expireAfterSeconds:0});
module.exports = mongoose.model("UserNotification", userNotificationSchema);
