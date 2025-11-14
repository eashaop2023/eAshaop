// services/socketService.js
const { Server } = require("socket.io");
const Appointment = require("../models/Appointment");
const Category=require("../models/categoryModel")
const Doctor=require("../models/doctorModel")
const User = require("../models/user"); 
const { default: mongoose } = require("mongoose");

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
// <<<<<<< HEAD
      methods: ["GET", "POST","PUT","DELETE", "OPTIONS","PATCH"],
// =======
      methods: ["GET", "POST"],
      credentials: true,
// >>>>>>> 70494b2c659823a4e959a7996e6f861a63dc7eb5
    },
    pingInterval:10000,
    pingTimeout:20000,
  });
  const activeUserStreams = {};
  const activeDoctorStreams = {};
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("joinDoctorRoom", (doctorId) => {
      socket.join(doctorId);
      console.log(`Doctor ${doctorId} joined room`);
    });

// <<<<<<< HEAD
    socket.on("joinCategoryRoom", (categoryUUID) => {
      socket.join(categoryUUID);
      console.log(`User joined category room: ${categoryUUID}`);
    });

     socket.on("joinUserRoom", (userId) => {
      socket.join(userId);
      console.log(`👤 User ${userId} joined their personal room`);
    });

    
    socket.on("joinDoctorProfileRoom", (doctorId) => {
      socket.join(doctorId);
      console.log(`Doctor ${doctorId} joined room`);
      if (!activeDoctorStreams[doctorId]) {
      activeDoctorStreams[doctorId] = setupDoctorChangeStream(doctorId);
    }
    });
    
// =======
     socket.on("joinUser", (userId) => {
    if (userId) {
      socket.join(userId.toString());
      console.log(`User ${userId} joined their room`);
    }
  });

// >>>>>>> 70494b2c659823a4e959a7996e6f861a63dc7eb5
    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  setupAppointmentChangeStream();
  // setupDoctorChangeStream();
  setupCategoryChangeStream(); 
  setupUserChangeStream(); 
 // setupDoctorChangeStream();
 
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


// <<<<<<< HEAD
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
   // console.log("MongoDB connected — setting up category change stream");

    // Watch the Category collection
    const changeStream = Doctor.watch([], { fullDocument: "updateLookup" });

    changeStream.on("change", async (change) => {
     // console.log(" Category change detected:", change.operationType);

      if (["insert", "update", "replace", "delete"].includes(change.operationType)) {
        // You can include more info if needed
        io.emit("categoryDoctorsUpdated", {
          type: change.operationType,
          time: new Date(),
        });

       // console.log(" Emitted 'categoryDoctorsUpdated' event to all clients");
      }
    });

    changeStream.on("error", (err) => {
      console.error(" Error in Category Change Stream:", err);
    });
  });
}


function setupUserChangeStream() {
  const mongoose = require("mongoose");

  mongoose.connection.once("open", () => {
    console.log(" MongoDB connected — setting up user change stream");

    const changeStream = User.watch([], { fullDocument: "updateLookup" });

    changeStream.on("change", async (change) => {
      console.log(" User change detected:", change.operationType);

      if (change.operationType === "update" || change.operationType === "replace") {
        const updatedUser = change.fullDocument;

        // Only emit if profile image changed
        if (change.updateDescription?.updatedFields?.profileImage) {
          console.log(" Profile image updated for user:", updatedUser._id);

          io.to(updatedUser._id.toString()).emit("UserprofileImageUpdated", {
            userId: updatedUser._id,
            profileImage: updatedUser.profileImage,
          });

          console.log(" Emitted 'UserprofileImageUpdated' event to user room");
        }
      }
    });

    changeStream.on("error", (err) => {
      console.error("Error in User Change Stream:", err);
    });
  });
}

function setupDoctorChangeStream(doctorId) {
  const mongoose = require("mongoose");
  const objectId = new mongoose.Types.ObjectId(doctorId);

  console.log(`Setting up doctor-specific change stream for ID: ${doctorId}`);

  const pipeline = [
    {
      $match: {
        "documentKey._id": objectId,
        operationType: { $in: ["update", "replace"] },
      },
    },
  ];

  const changeStream = Doctor.watch(pipeline, { fullDocument: "updateLookup" });

  changeStream.on("change", (change) => {
    const updatedDoctor = change.fullDocument;
    const updatedFields = change.updateDescription?.updatedFields || {};

    if (updatedFields.profileImage) {
      console.log(`🩺 Profile image updated for Doctor ${doctorId}`);

      io.to(doctorId.toString()).emit("DoctorprofileImageUpdated", {
        DoctorId: doctorId,
        profileImage: updatedDoctor.profileImage,
      });
    }
  });

  changeStream.on("error", (err) => {
    console.error("Error in Doctor Change Stream:", err);
  });

  return changeStream;
}

// function setupDoctorChangeStream() {
//   const mongoose = require("mongoose");

//   mongoose.connection.once("open", () => {
//     console.log(" MongoDB connected — setting up user change stream");

//      const pipeline = [
//       {
//         $match: {
//           "documentKey._id": objectId, // only this doctor's document
//           operationType: { $in: ["update", "replace"] },
//         },
//       },
//     ];

//     const changeStream = Doctor.watch(pipeline, { fullDocument: "updateLookup" });

//     // const changeStream = Doctor.watch([], { fullDocument: "updateLookup" });

//     changeStream.on("change", async (change) => {
//       console.log(" Doctor change detected:", change.operationType);

//       if (change.operationType === "update" || change.operationType === "replace") {
//         const updatedDoctor = change.fullDocument;

//         // Only emit if profile image changed
//         if (change.updateDescription?.updatedFields?.profileImage) {
//           console.log(" Profile image updated for user:", updatedDoctor._id);

//           io.to(updatedDoctor._id.toString()).emit("DoctorprofileImageUpdated", {
//             DoctorId: updatedDoctor._id,
//             profileImage: updatedDoctor.profileImage,
//           });
         
//           console.log(" Emitted 'DoctorprofileImageUpdated' event to doctor room");
//         }
//       }
//     });

//     changeStream.on("error", (err) => {
//       console.error("Error in User Change Stream:", err);
//     });
//   });
// }



module.exports = { initSocket };
// =======
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
// >>>>>>> 70494b2c659823a4e959a7996e6f861a63dc7eb5
