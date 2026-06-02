// controllers/notificationController.js
const UserNotification = require("../models/userNotification");
const DoctorNotification = require("../models/doctorNotification");
const Appointment = require("../models/Appointment");
const { emitNotification } = require("../services/socketService");
const cron = require("node-cron");
const mongoose = require("mongoose");

// 📅 Trigger notifications after appointment booking
exports.sendAppointmentNotifications = async (appointment) => {
  try {
    const { userId, doctorId, date, status } = appointment;


    // Get doctor/user details
    const populated = await Appointment.findById(appointment._id)
      .populate("doctorId", "name")
      .populate("userId", "full_name");

    const appointmentDate = new Date(date);
    const formattedDate = appointmentDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const formattedTime = appointmentDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    // User: Appointment booked or pending
    // Check if doctor name already includes "Dr." prefix to avoid duplication
    const doctorName = populated.doctorId.name;
    const doctorNameWithPrefix = doctorName.trim().toLowerCase().startsWith("dr.") 
      ? doctorName 
      : `Dr. ${doctorName}`;
    
    const userMessage =
      status === "pending"
        ? "Your appointment request is pending approval."
        : `Your appointment with ${doctorNameWithPrefix} is confirmed for ${formattedDate} at ${formattedTime}.`;

    const userNotif = await UserNotification.create({
      userId,
      message: { text: userMessage },
    });

    // Doctor message
    const doctorMessage = `You have a new appointment with ${populated.userId.full_name} on ${formattedDate} at ${formattedTime}.`;

    const doctorNotif = await DoctorNotification.create({
      doctorId,
      message: { text: doctorMessage },
    });

    // ✅ Emit real-time notifications via socket
    emitNotification(userId, {
      message: "You have a new notification! Please check.",
      notification: userNotif,
    });

    emitNotification(doctorId, {
      message: "You have a new notification! Please check.",
      notification: doctorNotif,
    });

    console.log("Notifications created for appointment:", appointment._id);
  } catch (error) {
    console.error("Error creating notifications:", error);
  }
};

// PATCH /api/notifications/:id/read?type=user OR doctor
exports.markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.query;

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
    const { type } = req.query;
    const { userId, doctorId } = req.body;

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

// 🕐 CRON JOB — runs every minute to send “5 minutes before” reminders
cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();
    const fiveMinLater = new Date(now.getTime() + 5 * 60 * 1000);

    const upcomingAppointments = await Appointment.find({
      date: { $gte: now, $lte: fiveMinLater },
      reminderSent: { $ne: true },
    })
      .populate("userId", "full_name")
      .populate("doctorId", "name");

    if (upcomingAppointments.length > 0) {
      console.log(`🕒 Found ${upcomingAppointments.length} upcoming appointments.`);

      for (const appointment of upcomingAppointments) {
        // Create reminder notifications

         const baseUrl = process.env.CLIENT_ORIGIN || "http://localhost:5173";
        const userNotif = await UserNotification.create({
          userId: appointment.userId._id,
          message: {
    text: "⏰ Reminder: Your appointment starts in 5 minutes. To Join 👉 ",
    link: "/user/appointment", // optional, for reference
           },
        });

        const doctorNotif = await DoctorNotification.create({
          doctorId: appointment.doctorId._id,
          message: { text: "⏰ Reminder: You have an appointment in 5 minutes." },
        });

        // Emit via socket (real-time)
        emitNotification(appointment.userId._id, {
          message: "⏰ Reminder: Your appointment starts in 5 minutes.",
          notification: userNotif,
        });

        emitNotification(appointment.doctorId._id, {
          message: "⏰ Reminder: You have an appointment in 5 minutes.",
          notification: doctorNotif,
        });

        // Mark appointment so it won't send again
        appointment.reminderSent = true;
        await appointment.save();

        console.log(
          `✅ Reminder created for ${appointment.userId.full_name} and ${appointment.doctorId.name}`
        );
      }
    }
  } catch (err) {
    console.error("❌ Error running reminder cron:", err);
  }
});
