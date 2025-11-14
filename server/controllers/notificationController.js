// controllers/notificationController.js
const UserNotification = require("../models/userNotification");
const DoctorNotification = require("../models/doctorNotification");
const Appointment = require("../models/Appointment");

// Utility: Schedule a notification (for “5 min before”)
const scheduleNotification = (model, data, delayMs) => {
  setTimeout(async () => {
    try {
      await model.create(data);
      console.log("Scheduled notification sent:", data.message);
    } catch (err) {
      console.error("Error sending scheduled notification:", err);
    }
  }, delayMs);
};

// 📅 Trigger notifications after appointment booking
exports.sendAppointmentNotifications = async (appointment) => {
  try {
    const { userId, doctorId, date, time, status } = appointment;

    // Get doctor/user details
    const populated = await Appointment.findById(appointment._id)
      .populate("doctorId", "name")
      .populate("userId", "full_name");

           const appointmentDate = new Date(date);
const formattedDate = appointmentDate.toLocaleDateString("en-US", {
  weekday: "long",   // 👉 gives full day name (e.g., Monday)
  year: "numeric",
  month: "long",
  day: "numeric",
});
                   const formattedTime = appointmentDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // set true if you want 12-hour format
    });







    // User: Appointment booked or pending
    let userMessage =
      status === "pending"
        ? "Your appointment request is pending approval."
        : `Your appointment with Dr. ${populated.doctorId.name} is confirmed for ${formattedDate} at ${formattedTime}.`;

    await UserNotification.create({
      userId,
      message: { text: userMessage },
    });

    const doctorMessage = `You have a new appointment with ${populated.userId.full_name} on ${formattedDate} at ${formattedTime}.`;


    // Doctor: Appointment booked
    await DoctorNotification.create({
      doctorId,
      message: { text: doctorMessage },
    });

    // ⏱ Schedule 5-min before notifications
    const appointmentDateTime = new Date(date);
    const appointmentTime = new Date(appointmentDateTime.getTime() - 5 * 60 * 1000);
    const delayMs = appointmentTime - Date.now();

    if (delayMs > 0) {
      scheduleNotification(
        UserNotification,
        { userId, message: { text: "⏰ Reminder: Your appointment starts in 5 minutes." } },
        delayMs
      );

      scheduleNotification(
        DoctorNotification,
        { doctorId, message: { text: "⏰ Reminder: You have an appointment in 5 minutes." } },
        delayMs
      );
    }
    console.log("Notifications scheduled for appointment:", appointment._id);
  } catch (error) {
    console.error("Error creating notifications:", error);
  }
};


// PATCH /api/notifications/:id/read?type=user OR doctor
exports.markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params; // notification ID
    const { type } = req.query; // 'user' or 'doctor'

    if (!id || !type)
      return res.status(400).json({ message: "Notification ID and type are required" });

    const Model = type === "doctor" ? DoctorNotification : UserNotification;

    const notification = await Model.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );

    if (!notification)
      return res.status(404).json({ message: "Notification not found" });

    res.status(200).json({ message: "Marked as read", notification });
  } catch (err) {
    console.error("Error marking notification as read:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/notifications/mark-all-read?type=user OR doctor
exports.markAllAsRead = async (req, res) => {
  try {
    const { type } = req.query; // 'user' or 'doctor'
    const { userId, doctorId } = req.body; // send from frontend

    if (!type)
      return res.status(400).json({ message: "Notification type is required" });

    const Model = type === "doctor" ? DoctorNotification : UserNotification;
    const filter = type === "doctor" ? { doctorId } : { userId };

    const result = await Model.updateMany(filter, { $set: { isRead: true } });

    res.status(200).json({
      message: "All notifications marked as read",
      modifiedCount: result.modifiedCount,
    });
  } catch (err) {
    console.error("Error marking all notifications as read:", err);
    res.status(500).json({ message: "Server error" });
  }
};


