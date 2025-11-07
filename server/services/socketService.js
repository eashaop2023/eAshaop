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
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("joinDoctorRoom", (doctorId) => {
      socket.join(doctorId);
      console.log(`Doctor ${doctorId} joined room`);
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

module.exports = { initSocket };
