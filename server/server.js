const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer=require("multer");
const http = require("http");

dotenv.config();
console.log("Loaded CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME);

const connectDB = require("./config/db");
connectDB();

const doctorRoutes = require("./routes/doctorRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const prescriptionRoutes = require("./routes/prescriptionRoutes");
const patientRoutes = require("./routes/patientRoutes");
const contactRoutes = require("./routes/contactRoutes");
const apiRoutes = require("./routes/api/index");
const appointmentRoutes = require("./routes/appointmentRoutes");
const reviewRoutes = require("./routes/reviewAndRatingRoutes/reviewRoutes");

const User = require("./models/user");
const Doctor = require("./models/doctorModel");
const Appointment = require("./models/Appointment");

const app = express();
const server = http.createServer(app);
const {initSocket}=require("./services/socketService");
const io = initSocket(server);
app.set("io", io);

// -------------------- MIDDLEWARES --------------------
// CORS: allow your frontend URL
app.use(
  cors({
    origin: ["https://eashaop.com","https://www.eashaop.com", "http://localhost:5500", "http://127.0.0.1:5500", "http://127.0.0.1:5173", "http://localhost:5173"], // frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS","PATCH"],
    credentials: true,
  })
);

// app.use("*", cors())

app.use(
  "/api/appointments/razorpay/webhook",
  express.raw({ type: "application/json" })
);
// JSON Body parser
app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

// Razorpay webhook requires raw body, so we need it later in appointmentRoutes
// app.use("/api/appointments/razorpay/webhook", express.raw({ type: "*/*" }));

// -------------------- ROUTES --------------------
app.get("/", (req, res) => {
  res.json({ servicename: "first app module" });
});

app.use("/api/doctors", doctorRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api", apiRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use('/api', reviewRoutes)

// -------------------- CRON JOB --------------------
const cron = require("node-cron");

cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();
    const fiveMinsLater = new Date(now.getTime() + 5 * 60 * 1000);

    // Find all video appointments without jitsiLink and booked
    const appointments = await Appointment.find({
      type: "video",
      jitsiLink: null,
      status: "booked",
    });

    for (let appt of appointments) {
      // Combine date + time fields into a Date object for comparison
      const [hourStr, minuteStr] = appt.time.split(":");
      const apptDateTime = new Date(appt.date);
      apptDateTime.setHours(parseInt(hourStr), parseInt(minuteStr), 0, 0);

      // If the appointment starts within the next 5 minutes
      if (apptDateTime - now <= 5 * 60 * 1000 && apptDateTime > now) {
        const jitsiLink = `https://meet.jit.si/EashaOP-${appt._id}-${Date.now()}`;
        appt.jitsiLink = jitsiLink;
        await appt.save();

        await User.updateOne(
          { _id: appt.userId },
          { $set: { "appointments.$[elem].jitsiLink": jitsiLink } },
          { arrayFilters: [{ "elem.appointmentId": appt._id }] }
        );

        await Doctor.updateOne(
          { _id: appt.doctorId },
          { $set: { "appointments.$[elem].jitsiLink": jitsiLink } },
          { arrayFilters: [{ "elem.appointmentId": appt._id }] }
        );

        console.log("Generated Jitsi link for appointment:", appt._id);
      }
    }
  } catch (err) {
    console.error("Error generating Jitsi links:", err);
  }
});

// -------------------- SERVER --------------------
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(
    "Vonage API Key loaded:",
    process.env.VONAGE_API_KEY ? "Yes" : "No"
  );
});

// -------------------- ERROR HANDLER --------------------
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  } else if (err && err.message.includes("Invalid file type")) {
    return res.status(400).json({ error: err.message });
  } else if (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
  next();
});

