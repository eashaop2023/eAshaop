// services/socketService.js
const { Server } = require("socket.io");
const Appointment = require("../models/Appointment");
const Category=require("../models/categoryModel")
const Doctor=require("../models/doctorModel")

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
      methods: ["GET", "POST","PUT","DELETE", "OPTIONS","PATCH"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("joinDoctorRoom", (doctorId) => {
      socket.join(doctorId);
      console.log(`Doctor ${doctorId} joined room`);
    });

    socket.on("joinCategoryRoom", (categoryUUID) => {
      socket.join(categoryUUID);
      console.log(`User joined category room: ${categoryUUID}`);
    });


    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  setupAppointmentChangeStream();
  // setupDoctorChangeStream();
  setupCategoryChangeStream(); 
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


// function setUpDoctorChangeStream(){
//   const mongoose=require("mongoose");
//   mongoose.connection.once("open",()=>{
//     console.log("Mongodb connected setting up doctor change stream");
//     const changeStream=category.watch([], { fullDocument: "updateLookup" });
//     changeStream.on("change",async(change)=>{
//       console.log("Doctor change detected",change.operationType);
//       if(['insert','update','delete','replace'].includes(change.operationType)){
//         let categoryId;
//         if(change.operationType==='delete'){
//           categoryId=change.fullDocumentBeforeChange?.categoryId;
//         }
//         else{
//           categoryId=change.fullDocument.categoryId;
//         }
//       }
//     })
//   })
// }
function setupCategoryChangeStream() {
  const mongoose = require("mongoose");

  mongoose.connection.once("open", () => {
    console.log("✅ MongoDB connected — setting up category change stream");

    // Watch the Category collection
    const changeStream = Doctor.watch([], { fullDocument: "updateLookup" });

    changeStream.on("change", async (change) => {
      console.log("📢 Category change detected:", change.operationType);

      if (["insert", "update", "replace", "delete"].includes(change.operationType)) {
        // You can include more info if needed
        io.emit("categoryDoctorsUpdated", {
          type: change.operationType,
          time: new Date(),
        });

        console.log("🔁 Emitted 'categoryDoctorsUpdated' event to all clients");
      }
    });

    changeStream.on("error", (err) => {
      console.error("❌ Error in Category Change Stream:", err);
    });
  });
}


module.exports = { initSocket };
