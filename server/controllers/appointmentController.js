const Appointment = require("../models/Appointment");
const Doctor = require("../models/doctorModel");
const User = require("../models/user");
const DoctorAvailability = require("../models/doctorAvailability"); // you already have
const Razorpay = require("razorpay");
const crypto = require("crypto");
const cors = require("cors");
const { raw } = require("body-parser");
const { response } = require("express");
const moment = require("moment-timezone");

// Helper: Generate Jitsi Meeting Link
function generateJitsiLink(appointmentId) {
  return `https://meet.jit.si/consult_${appointmentId}_${Date.now()}`;
}

// Book Appointment
// exports.bookAppointment = async (req, res) => {
//   try {
//     const { userId, doctorId, date, time, type, dependent } = req.body;

//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const doctor = await Doctor.findById(doctorId);
//     if (!doctor) return res.status(404).json({ message: "Doctor not found" });

//     const requestedDateStart = new Date(date);
//     requestedDateStart.setHours(0, 0, 0, 0);

//     const requestedDateEnd = new Date(requestedDateStart);
//     requestedDateEnd.setHours(23, 59, 59, 999);

//     const availability = await DoctorAvailability.findOne({
//       doctor: doctorId,
//       date: { $gte: requestedDateStart, $lte: requestedDateEnd },
//     });

//     if (!availability) {
//       return res
//         .status(400)
//         .json({ message: "Doctor is not available on this date" });
//     }

//     const [reqHour, reqMinute] = time.split(":").map(Number);
//     const requestedMinutes = reqHour * 60 + reqMinute;

//     const [startHour, startMinute] = availability.startTime
//       .split(":")
//       .map(Number);
//     const [endHour, endMinute] = availability.endTime.split(":").map(Number);

//     const startMinutes = startHour * 60 + startMinute;
//     const endMinutes = endHour * 60 + endMinute;

//     const now = new Date();
//     if (
//       requestedDateStart.toDateString() === now.toDateString() &&
//       requestedMinutes <= now.getHours() * 60 + now.getMinutes()
//     ) {
//       return res
//         .status(400)
//         .json({ message: "Cannot book an appointment in the past" });
//     }

//     if (requestedMinutes < startMinutes || requestedMinutes > endMinutes) {
//       return res
//         .status(400)
//         .json({ message: "Doctor is not available for this slot" });
//     }

//     const newAppointment = new Appointment({
//       userId,
//       doctorId,
//       type,
//       date: requestedDateStart,
//       time,
//       dependent: dependent || null,
//       status: "booked",
//       jitsiLink: null,
//     });

//     const savedAppointment = await newAppointment.save();

//     const appointmentSubDoc = {
//       appointmentId: savedAppointment._id,
//       userId,
//       doctorId,
//       type,
//       date: savedAppointment.date,
//       time,
//       dependent: savedAppointment.dependent,
//       status: savedAppointment.status,
//       jitsiLink: savedAppointment.jitsiLink,
//     };

//     await User.findByIdAndUpdate(userId, {
//       $push: { appointments: appointmentSubDoc },
//     });
//     await Doctor.findByIdAndUpdate(doctorId, {
//       $push: { appointments: appointmentSubDoc },
//     });

//     res.status(201).json({
//       message: "Appointment booked successfully",
//       appointment: savedAppointment,
//     });
//   } catch (error) {
//     console.error("Book Appointment Error:", error);
//     res.status(500).json({ message: "Server Error", error: error.message });
//   }
// };

// Get User Appointments
exports.getUserAppointments = async (req, res) => {
  try {
    const { userId } = req.params;

    const appointments = await Appointment.find({ userId })
      .populate({
        path: "doctorId",
        select: "name speciality email mobile",
      })
      .populate({
        path: "userId",
        select: "full_name email phone_number",
      });

    if (!appointments || appointments.length === 0) {
      return res
        .status(404)
        .json({ message: "No appointments found for this user" });
    }

    res.status(200).json({ appointments });
  } catch (error) {
    console.error("Get User Appointments Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Cancel Appointment (Doctor only)
exports.cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);

    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });
    if (appointment.status === "cancelled")
      return res
        .status(400)
        .json({ message: "Appointment is already cancelled" });

    appointment.status = "cancelled";
    await appointment.save();

    // Free Doctor Slot
    const availability = await DoctorAvailability.findOne({
      doctorId: appointment.doctorId,
      date: appointment.date,
    });

    if (availability) {
      const slot = availability.slots.find((s) => s.time === appointment.time);
      if (slot) {
        slot.isBooked = false;
        await availability.save();
      }
    }

    await User.updateOne(
      { _id: appointment.userId },
      { $set: { "appointments.$[elem].status": "cancelled" } },
      { arrayFilters: [{ "elem.appointmentId": appointment._id }] }
    );

    await Doctor.updateOne(
      { _id: appointment.doctorId },
      { $set: { "appointments.$[elem].status": "cancelled" } },
      { arrayFilters: [{ "elem.appointmentId": appointment._id }] }
    );

    res.status(200).json({ message: "Appointment cancelled successfully" });
  } catch (error) {
    console.error("Cancel Appointment Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/appointments
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("doctorId", "name speciality email mobile")
      .populate("userId", "full_name email phone_number");

    res.status(200).json({
      totalAppointments: appointments.length,
      appointments,
    });
  } catch (error) {
    console.error("Get All Appointments Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// GET /api/appointments/user/:userId

exports.getUserAppointments = async (req, res) => {
  try {
    const { userId } = req.params;
    const appointments = await Appointment.find({ userId })
      .populate(
        "doctorId",
        "name education speciality hospitalName hospitalLocation consultationMode email mobile profileImage"
      )
      .lean();

    const now = moment().tz("Asia/Kolkata"); // Current IST time

    const formatAppointment = (appt) => ({
      appointmentId: appt._id,
      type: appt.type,
      date: appt.date,
      time: appt.time,
      status: appt.status,
      amount: appt.amount,
      doctor: appt.doctorId
        ? {
            name: appt.doctorId.name,
            speciality: appt.doctorId.speciality,
            education: appt.doctorId.education,
            consultationMode: appt.doctorId.consultationMode,
            hospitalName: appt.doctorId.hospitalName,
            hospitalLocation: appt.doctorId.hospitalLocation,
            email: appt.doctorId.email,
            mobile: appt.doctorId.mobile,
            profileImage: appt.doctorId.profileImage,
          }
        : null,
      dependent: appt.dependent || null,
      jitsiLink: appt.jitsiLink || null,
    });

    const upcoming = [];
    const past = [];

    appointments.forEach((appt) => {
      // Combine date + time into full datetime
      const apptDateTime = moment.tz(
        `${moment(appt.date).format("YYYY-MM-DD")} ${appt.time}`,
        "YYYY-MM-DD hh:mm A",
        "Asia/Kolkata"
      );

      if (apptDateTime.isSameOrAfter(now)) {
        upcoming.push(formatAppointment(appt));
      } else {
        past.push(formatAppointment(appt));
      }
    });

    res.status(200).json({
      totalUpcoming: upcoming.length,
      totalPast: past.length,
      upcoming,
      past,
    });
  } catch (error) {
    console.error("Get User Appointments Error:", error);
    res.status(500).json({ message: error.message });
  }
};
// GET /api/appointments/doctor/:doctorId
exports.getDoctorAppointments = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const now = new Date();

    const upcoming = await Appointment.find({
      doctorId: doctorId, // make sure field matches schema
      date: { $gte: now }, // 'date' is the correct field
    }).populate("userId", "full_name email phone_number");

    const past = await Appointment.find({
      doctorId: doctorId,
      date: { $lt: now },
    }).populate("userId", "full_name email phone_number");

    res.status(200).json({
      totalAppointments: past.length,

      past,
    });
  } catch (error) {
    console.error("Get Doctor Appointments Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// // Razorpay instance
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// // ------------------------ Book Appointment ------------------------
// exports.bookAppointment = async (req, res) => {
//   try {
//     const { userId, doctorId, date, time, type, dependent, amount } = req.body;

//     //Validate input
//     if (!userId || !doctorId || !date || !time || !type || !amount)
//       return res.status(400).json({ message: "All fields are required" });

//     if (typeof amount !== "number" || amount <= 0)
//       return res
//         .status(400)
//         .json({ message: "Amount must be a positive number" });

//     // Check user & doctor existence
//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const doctor = await Doctor.findById(doctorId);
//     if (!doctor) return res.status(404).json({ message: "Doctor not found" });

//     // Check doctor availability for the requested date
//     const requestedDateStart = new Date(date);
//     requestedDateStart.setHours(0, 0, 0, 0); // start of day

//     const requestedDateEnd = new Date(date);
//     requestedDateEnd.setHours(23, 59, 59, 999); // end of day

//     const availability = await DoctorAvailability.findOne({
//       doctor: doctorId,
//       date: { $gte: requestedDateStart, $lte: requestedDateEnd },
//     });

//     if (!availability)
//       return res
//         .status(400)
//         .json({ message: "Doctor is not available on this date" });

//     // Check requested time is within slot
//     const [reqHour, reqMinute] = time.split(":").map(Number);
//     const requestedTime = new Date(requestedDateStart);
//     requestedTime.setHours(reqHour, reqMinute, 0, 0);

//     const [startHour, startMinute] = availability.startTime
//       .split(":")
//       .map(Number);
//     const [endHour, endMinute] = availability.endTime.split(":").map(Number);
//     const startTime = new Date(requestedDateStart);
//     startTime.setHours(startHour, startMinute, 0, 0);
//     const endTime = new Date(requestedDateStart);
//     endTime.setHours(endHour, endMinute, 0, 0);

//     const now = new Date();
//     if (requestedTime < now)
//       return res
//         .status(400)
//         .json({ message: "Cannot book an appointment in the past" });
//     if (requestedTime < startTime || requestedTime > endTime)
//       return res
//         .status(400)
//         .json({ message: "Doctor is not available for this slot" });

//     // Create Razorpay order
//     const order = await razorpay.orders.create({
//       amount: amount * 100, // INR to paise
//       currency: "INR",
//       receipt: `receipt_${Date.now()}`,
//     });

//     //Save appointment (status pending)
//     const appointment = await Appointment.create({
//       userId,
//       doctorId,
//       type,
//       date: requestedDateStart,
//       time,
//       dependent: dependent || null,
//       status: "pending",
//       amount,
//       razorpayOrderId: order.id,
//     });

//     res.status(201).json({
//       message:
//         "Razorpay order created. Complete payment to confirm appointment",
//       order,
//       appointmentId: appointment._id,
//     });
//   } catch (error) {
//     console.error("Book Appointment Error:", error);
//     res.status(500).json({ message: "Server Error", error: error.message });
//   }
// };


// // ------------------------ Confirm Payment ------------------------
// exports.confirmPayment = async (req, res) => {
//   try {
//     const {
//       appointmentId,
//       razorpayPaymentId,
//       razorpayOrderId,
//       razorpaySignature,
//     } = req.body;

//     if (
//       !appointmentId ||
//       !razorpayPaymentId ||
//       !razorpayOrderId ||
//       !razorpaySignature
//     )
//       return res
//         .status(400)
//         .json({ message: "All payment fields are required" });

//     // Verify signature
//     const generatedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(`${razorpayOrderId}|${razorpayPaymentId}`)
//       .digest("hex");

//     if (generatedSignature !== razorpaySignature)
//       return res.status(400).json({ message: "Payment verification failed" });

//     // Update appointment
//     const appointment = await Appointment.findById(appointmentId);
//     if (!appointment)
//       return res.status(404).json({ message: "Appointment not found" });

//     if (appointment.status === "booked")
//       return res.status(400).json({ message: "Appointment already booked" });

//     appointment.status = "booked";
//     appointment.razorpayPaymentId = razorpayPaymentId;
//     await appointment.save();

//     // Add appointment ref to user & doctor
//     const subDoc = {
//       appointmentId: appointment._id,
//       userId: appointment.userId,
//       doctorId: appointment.doctorId,
//       type: appointment.type,
//       date: appointment.date,
//       time: appointment.time,
//       dependent: appointment.dependent,
//       status: appointment.status,
//       jitsiLink: appointment.jitsiLink || null,
//     };

//     await User.findByIdAndUpdate(appointment.userId, {
//       $push: { appointments: subDoc },
//     });
//     await Doctor.findByIdAndUpdate(appointment.doctorId, {
//       $push: { appointments: subDoc },
//     });

//     res.status(200).json({
//       message: "Appointment booked successfully after payment",
//       appointment,  
//     });
//   } catch (err) {
//     console.error("Confirm Payment Error:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };


// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ------------------------ Book Appointment ------------------------
exports.bookAppointment = async (req, res) => {
  try {
    const { userId, doctorId, date, time, type, dependent, amount } = req.body;

    const requestedDateIST1 = moment.utc(new Date(date)).tz("Asia/Kolkata").toDate();
    console.log("Appointment saved with date:", requestedDateIST1);

    if (!userId || !doctorId || !date || !time || !type || !amount)
      return res.status(400).json({ message: "All fields are required" });

    if (typeof amount !== "number" || amount <= 0)
      return res
        .status(400)
        .json({ message: "Amount must be a positive number" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    // ✅ Convert date & time to IST
    const requestedDateIST = moment.tz(requestedDateIST1, "YYYY-MM-DD", "Asia/Kolkata");
    const requestedTimeIST = moment.tz(`${requestedDateIST1} ${time}`, "YYYY-MM-DD HH:mm", "Asia/Kolkata");

    // Start and end of requested date in IST
    const requestedDateStart = requestedDateIST.startOf("day").toDate();
    const requestedDateEnd = requestedDateIST.endOf("day").toDate();

    // Check doctor availability
    const availability = await DoctorAvailability.findOne({
      doctor: doctorId,
      date: { $gte: requestedDateStart, $lte: requestedDateEnd },
    });

    if (!availability)
      return res
        .status(400)
        .json({ message: "Doctor is not available on this date" });

    // Check time within doctor's slot
    const [startHour, startMinute] = availability.startTime.split(":").map(Number);
    const [endHour, endMinute] = availability.endTime.split(":").map(Number);

    const startTime = moment(requestedDateIST).hour(startHour).minute(startMinute).toDate();
    const endTime = moment(requestedDateIST).hour(endHour).minute(endMinute).toDate();

    const now = moment().tz("Asia/Kolkata").toDate();

    if (requestedTimeIST.toDate() < now)
      return res.status(400).json({ message: "Cannot book an appointment in the past" });

    if (requestedTimeIST.toDate() < startTime || requestedTimeIST.toDate() > endTime)
      return res.status(400).json({ message: "Doctor is not available for this slot" });

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amount * 100, // INR to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    // Save appointment
    const appointment = await Appointment.create({
      userId,
      doctorId,
      type,
      date: requestedDateIST.format("YYYY-MM-DD"), // store date string
      time, // store time as string (24-hour)
      dependent: dependent || null,
      status: "pending",
      amount,
      razorpayOrderId: order.id,
    });

    res.status(201).json({
      message: "Razorpay order created. Complete payment to confirm appointment",
      order,
      appointmentId: appointment._id,
    });
  } catch (error) {
    console.error("Book Appointment Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ------------------------ Confirm Payment (manual) ------------------------
exports.confirmPayment = async (req, res) => {
  try {
    const {
      appointmentId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
    } = req.body;

    if (
      !appointmentId ||
      !razorpayPaymentId ||
      !razorpayOrderId ||
      !razorpaySignature
    )
      return res
        .status(400)
        .json({ message: "All payment fields are required" });

    // Verify signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (generatedSignature !== razorpaySignature)
      return res.status(400).json({ message: "Payment verification failed" });

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    if (appointment.status === "booked")
      return res.status(400).json({ message: "Appointment already booked" });

    appointment.status = "booked";
    appointment.razorpayPaymentId = razorpayPaymentId;
    await appointment.save();

    const subDoc = {
      appointmentId: appointment._id,
      userId: appointment.userId,
      doctorId: appointment.doctorId,
      type: appointment.type,
      date: appointment.date,
      time: appointment.time,
      dependent: appointment.dependent,
      status: appointment.status,
      jitsiLink: appointment.jitsiLink || null,
    };

    await User.findByIdAndUpdate(appointment.userId, {
      $push: { appointments: subDoc },
    });
    await Doctor.findByIdAndUpdate(appointment.doctorId, {
      $push: { appointments: subDoc },
    });

    res.status(200).json({
      message: "Appointment booked successfully after payment",
      appointment,
    });
  } catch (err) {
    console.error("Confirm Payment Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ------------------------ Razorpay Webhook ------------------------
// ------------------------ Razorpay Webhook ------------------------
exports.razorpayWebhook = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // Express.raw parser ensures req.body is a Buffer
    const rawBody = req.body;

    // Verify signature
    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(rawBody);
    console.log("shasum", shasum)

    const digest = shasum.digest("hex");

    const razorpaySignature = req.headers["x-razorpay-signature"];

    if (digest !== razorpaySignature) {
      console.log("Invalid webhook signature");
      return res.status(400).json({ message: "Invalid signature" });
    }

    // Parse JSON AFTER verifying signature
    const webhookData = JSON.parse(rawBody);
    const event = webhookData.event;
    console.log("🔔 Webhook Event:", event);

    // Only handle payment.captured to confirm appointments
    if (event === "payment.captured") {
      const paymentEntity = webhookData.payload.payment.entity;

      const appointment = await Appointment.findOne({
        razorpayOrderId: paymentEntity.order_id,
      });

      if (!appointment) {
        console.log("⚠️ Appointment not found for order:", paymentEntity.order_id);
        return res.json({ status: "ok" }); // still return 200 to Razorpay
      }

      if (appointment.status === "booked") {
        console.log("⚠️ Appointment already booked:", appointment._id);
        return res.send(req).json({ status: "ok" }); // avoid duplicate processing
      }

      // Update appointment
      appointment.status = "booked";
      appointment.razorpayPaymentId = paymentEntity.id;
      await appointment.save();

      // Subdocument to push to User & Doctor
      const subDoc = {
        appointmentId: appointment._id,
        userId: appointment.userId,
        doctorId: appointment.doctorId,
        type: appointment.type,
        date: appointment.date,
        time: appointment.time,
        dependent: appointment.dependent,
        status: appointment.status,
        jitsiLink: appointment.jitsiLink || null,
      };

      await User.findByIdAndUpdate(appointment.userId, {
        $push: { appointments: subDoc },
      });

      await Doctor.findByIdAndUpdate(appointment.doctorId, {
        $push: { appointments: subDoc },
      });

      console.log("Appointment confirmed via Webhook:", appointment._id);
    }

    // Respond quickly to Razorpay (must be within 5 seconds)
    res.json({ status: "ok" });
  } catch (err) {
    console.error("Webhook Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
