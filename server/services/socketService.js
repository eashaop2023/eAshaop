// services/socketService.js
const { Server } = require("socket.io");
const Appointment = require("../models/Appointment");

let io;

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: [
        "https://eashaop.com",
        "https://www.eashaop.com",
        "http://localhost:5500",
        "http://127.0.0.1:5173",
        "http://localhost:5173"
      ],
      methods: ["GET", "POST"],
      credentials: true,
    },
    pingInterval:10000,
    pingTimeout:20000,
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("joinDoctorRoom", (doctorId) => {
      socket.join(doctorId);
      console.log(`Doctor ${doctorId} joined room`);
    });

     socket.on("joinUser", (userId) => {
    if (userId) {
      socket.join(userId.toString());
      console.log(`User ${userId} joined their room`);
    }
  });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  setupAppointmentChangeStream();
  return io;
}
function setupAppointmentChangeStream() {
  const mongoose = require("mongoose");
  mongoose.connection.once("open", () => {
    console.log(" MongoDB connected — setting up change stream");

    const changeStream = Appointment.watch();
    changeStream.on("change", async (change) => {
      console.log("Change detected in Appointments:", change.operationType);

      if (["insert", "update", "replace"].includes(change.operationType)) {
        const docId = change.documentKey._id;
        const updatedDoc = await Appointment.findById(docId).lean();
        if (updatedDoc?.doctorId) {
          io.to(updatedDoc.doctorId.toString()).emit("appointmentUpdated", updatedDoc);
        }
      } else if (change.operationType === "delete") {
        const doctorId = change.fullDocumentBeforeChange?.doctorId;
        if (doctorId) {
          io.to(doctorId.toString()).emit("appointmentDeleted", change.documentKey._id);
        }
      }
    });
  });
}


// --- Utility function to emit notifications anywhere ---
// 
function emitNotification(userId, notification) {
  if (io) {
    // io.to(userId.toString()).emit("newNotification", {
    //   message: notification?.message?.text || "You have a new notification! please check.",
    //   notification,
    // });
     io.to(userId.toString()).emit("newNotification", {
      message: notification.message,  // send entire message object
      _id: notification._id,          // also send ID (useful)
      createdAt: notification.createdAt
  });
    console.log(`📩 Notification sent to user ${userId}`);
  } else {
    console.error("Socket.io not initialized!");
  }}
module.exports = { initSocket, emitNotification };