const Appointment = require("../models/Appointment");
const Doctor = require("../models/doctorModel");
const User = require("../models/user");
const DoctorAvailability = require("../models/doctorAvailability"); // you already have
const UserNotification = require("../models/userNotification");
const DoctorNotification=require("../models/doctorNotification");
const {sendAppointmentNotifications}=require("../controllers/notificationController")
const Razorpay = require("razorpay");
const crypto = require("crypto");
const cors = require("cors");
const { raw } = require("body-parser");
const { response } = require("express");
const moment = require("moment-timezone");
const { sendEmail } = require("../utils/sendEmailUser");
const Receipt = require("../models/Receipt");

// Helper: Generate Jitsi Meeting Link
// Add URL parameters to allow anyone to start the meeting (first person becomes moderator)
function generateJitsiLink(appointmentId) {
  const baseUrl = `https://meet.jit.si/consult_${appointmentId}_${Date.now()}`;
  // Add config parameters:
  // - Skip welcome page for faster joining
  // - Don't require display name
  // - First person to join automatically becomes moderator
  const configParams = [
    'config.enableWelcomePage=false',
    'config.requireDisplayName=false',
    'config.prejoinPageEnabled=false',
    'config.startWithVideoMuted=false',
    'config.startWithAudioMuted=false'
  ].join('&');
  return `${baseUrl}#${configParams}`;
}

// Helper: Generate Unique Appointment Number (EOP + Year + Sequential Number)
async function generateAppointmentNumber() {
  const year = new Date().getFullYear();
  const prefix = `EOP${year}`;
  
  // Find the last appointment number for this year
  const lastAppointment = await Appointment.findOne({
    appointmentNumber: { $regex: `^${prefix}` }
  })
    .sort({ appointmentNumber: -1 })
    .select('appointmentNumber')
    .lean();

  let sequenceNumber = 1;
  
  if (lastAppointment && lastAppointment.appointmentNumber) {
    // Extract the sequence number from the last appointment number
    // Format: EOP2025001 -> extract 001
    const lastSequence = parseInt(lastAppointment.appointmentNumber.replace(prefix, ''), 10);
    if (!isNaN(lastSequence) && lastSequence > 0) {
      sequenceNumber = lastSequence + 1;
    }
  }

  // Format: EOP2025001, EOP2025002, etc. (3-digit padding)
  let appointmentNumber = `${prefix}${String(sequenceNumber).padStart(3, '0')}`;
  
  // Retry logic in case of race condition (though unlikely with proper indexing)
  let attempts = 0;
  const maxAttempts = 5;
  
  while (attempts < maxAttempts) {
    const existing = await Appointment.findOne({ appointmentNumber });
    if (!existing) {
      return appointmentNumber;
    }
    // If duplicate found, increment and try again
    sequenceNumber++;
    appointmentNumber = `${prefix}${String(sequenceNumber).padStart(3, '0')}`;
    attempts++;
  }
  
  // Fallback: add timestamp to ensure uniqueness if all attempts fail
  return `${prefix}${String(sequenceNumber).padStart(3, '0')}${Date.now().toString().slice(-4)}`;
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const appointments = await Appointment.find({ userId })
      .populate(
        "doctorId",
        "name education speciality hospitalName hospitalLocation consultationMode email mobile profileImage"
      )
      .lean()
      .sort({ date: -1 });

    const now = moment().tz("Asia/Kolkata");

    const doctorIds = [...new Set(appointments.map(a => a.doctorId?._id))];
    const doctorAvailability = await DoctorAvailability.find({
      doctor: { $in: doctorIds },
       date: { $in: appointments.map(a => new Date(a.date)) },
    }).lean();

    const slotMap = {};
    // doctorAvailability.forEach(doc => {
    //   slotMap[doc.doctor] = doc.slotDuration;
    // });
    doctorAvailability.forEach(doc => {
  const dateKey = moment(doc.date).format("YYYY-MM-DD");
  slotMap[`${doc.doctor}_${dateKey}`] = doc.slotDuration;
});

    const onGoing = [];
    const upcoming = [];
    const past = [];


    const formatAppointment = (appt, startTime, endTime) => ({
      appointmentId: appt._id,
      type: appt.type,
      date: appt.date,
      time: appt.time,
      status: appt.status,
      startTime,
      endTime,
      amount: appt.amount,
      doctor: appt.doctorId || null,
      dependent: appt.dependent || null,
      jitsiLink: appt.jitsiLink || null,
    });

    appointments.forEach((appt) => {
            const dateKey = moment(appt.date).format("YYYY-MM-DD");

      
      const slotDuration = slotMap[`${appt.doctorId?._id}_${dateKey}`] || 30;

  const timeFormat = appt.time.includes("AM") || appt.time.includes("PM")
    ? "YYYY-MM-DD hh:mm A"
    : "YYYY-MM-DD HH:mm";
      const startMoment = moment.tz(
        `${moment(appt.date).format("YYYY-MM-DD")} ${appt.time}`,
        // "YYYY-MM-DD hh:mm A",
        timeFormat,
        "Asia/Kolkata"
      );

      const endMoment = moment(startMoment).add(slotDuration, "minutes");

      if (now.isBetween(startMoment, endMoment)) {
        onGoing.push(formatAppointment(appt, startMoment.format("hh:mm A"), endMoment.format("hh:mm A")));
      } else if (startMoment.isAfter(now)) {
        upcoming.push(formatAppointment(appt, startMoment.format("hh:mm A"), endMoment.format("hh:mm A")));
      } else {
        past.push(formatAppointment(appt, startMoment.format("hh:mm A"), endMoment.format("hh:mm A")));
      }
    });

    // Apply pagination to each category
    const paginatedOnGoing = onGoing.slice(skip, skip + limit);
    const paginatedUpcoming = upcoming.slice(skip, skip + limit);
    const paginatedPast = past.slice(skip, skip + limit);

    res.status(200).json({
      totalOngoing: onGoing.length,
      totalUpcoming: upcoming.length,
      totalPast: past.length,
      page,
      limit,
      totalPages: {
        onGoing: Math.ceil(onGoing.length / limit),
        upcoming: Math.ceil(upcoming.length / limit),
        past: Math.ceil(past.length / limit)
      },
      onGoing: paginatedOnGoing,
      upcoming: paginatedUpcoming,
      past: paginatedPast,
    });

  } catch (error) {
    console.error("Get User Appointments Error:", error);
    res.status(500).json({ message: error.message });
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalAppointments = await Appointment.countDocuments();
    const appointments = await Appointment.find()
      .populate("doctorId", "name speciality email mobile")
      .populate("userId", "full_name email phone_number")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      totalAppointments,
      page,
      limit,
      totalPages: Math.ceil(totalAppointments / limit),
      appointments,
    });
  } catch (error) {
    console.error("Get All Appointments Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// GET /api/appointments/user/:userId

// exports.getUserAppointments = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const appointments = await Appointment.find({ userId })
//       .populate(
//         "doctorId",
//         "name education speciality hospitalName hospitalLocation consultationMode email mobile profileImage"
//       )
//       .lean();

//     const now = moment().tz("Asia/Kolkata"); // Current IST time

//     const formatAppointment = (appt) => ({
//       appointmentId: appt._id,
//       type: appt.type,
//       date: appt.date,
//       time: appt.time,
//       status: appt.status,
//       amount: appt.amount,
//       doctor: appt.doctorId
//         ? {
//           name: appt.doctorId.name,
//           speciality: appt.doctorId.speciality,
//           education: appt.doctorId.education,
//           consultationMode: appt.doctorId.consultationMode,
//           hospitalName: appt.doctorId.hospitalName,
//           hospitalLocation: appt.doctorId.hospitalLocation,
//           email: appt.doctorId.email,
//           mobile: appt.doctorId.mobile,
//           profileImage: appt.doctorId.profileImage,
//         }
//         : null,
//       dependent: appt.dependent || null,
//       jitsiLink: appt.jitsiLink || null,
//     });

//     const upcoming = [];
//     const past = [];

//     appointments.forEach((appt) => {
//       // Combine date + time into full datetime
//       const apptDateTime = moment.tz(
//         `${moment(appt.date).format("YYYY-MM-DD")} ${appt.time}`,
//         "YYYY-MM-DD hh:mm A",
//         "Asia/Kolkata"
//       );

//       if (apptDateTime.isSameOrAfter(now)) {
//         upcoming.push(formatAppointment(appt));
//       } else {
//         past.push(formatAppointment(appt));
//       }
//     });

//     res.status(200).json({
//       totalUpcoming: upcoming.length,
//       totalPast: past.length,
//       upcoming,
//       past,
//     });
//   } catch (error) {
//     console.error("Get User Appointments Error:", error);
//     res.status(500).json({ message: error.message });
//   }
// };
// GET /api/appointments/doctor/:doctorId
exports.getDoctorAppointments = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const now = new Date();

    const userIds = await Appointment.distinct('userId', { doctorId, status: 'booked' });


    let users = await User.find({ _id: { $in: userIds } }).select('-appointments');



    const userAppointments = await Appointment.find({ doctorId, userId: { $in: userIds }, status: 'booked' });

    const doctorAvailability = await DoctorAvailability.findOne({ doctor: doctorId });

    if (!doctorAvailability) {
      return res.status(404).json({ message: "Doctor availability not found" });
    }

    const slotDuration = doctorAvailability.slotDuration;

    users = users.map(user => {
      const appointment = userAppointments.find(app => app.userId.toString() === user._id.toString());
      if (appointment) {
        const start = appointment.time; // assuming time is in "HH:mm" format
        const [hours, minutes] = start.split(":").map(Number);
        const startDate = new Date();
        startDate.setHours(hours, minutes, 0, 0);

        const endDate = new Date(startDate.getTime() + slotDuration * 60000); // add slot duration

        // Format back to "HH:mm"
        const formatTime = date => date.toTimeString().slice(0, 5);

        return {
          _id: user._id,
          profileImage: user.profileImage,
          startTime: formatTime(startDate),
          endTime: formatTime(endDate),
        };
        // return {
        //   ...user.toObject(),
        //   startTime: formatTime(startDate),
        //   endTime: formatTime(endDate),
        // };
      }
      return user;
    });

    const appointmentOngoing = await Appointment.find({
      doctorId,
      date: { $lte: now },
      status: 'booked',
    }).populate("userId", "full_name email phone_number");

    const upcoming = await Appointment.find({
      doctorId: doctorId, // make sure field matches schema
      date: { $gte: now }, // 'date' is the correct field
    }).populate("userId", "full_name email phone_number")
      .sort({ date: 1 })
      .skip(skip)
      .limit(limit);
    const ongoing = appointmentOngoing.filter(app => {
      const startDate = app.date; // assuming app.date is a Date object
      const endDate = new Date(startDate.getTime() + slotDuration * 60000);
      return endDate >= now;
    });

    const [totalPast, totalUpcoming] = await Promise.all([
      Appointment.countDocuments({
        doctorId: doctorId,
        date: { $lt: now },
      }),
      Appointment.countDocuments({ doctorId, date: { $gte: now } })
    ]);
    
    const past = await Appointment.find({
      doctorId: doctorId,
      date: { $lt: now },
    }).populate("userId", "full_name email phone_number")
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);
    const profileImage = await User.findById
    res.status(200).json({
      totalAppointments: totalPast,
      totalUpcoming: totalUpcoming,
      totalOngoing: ongoing.length,
      page,
      limit,
      totalPages: {
        upcoming: Math.ceil(totalUpcoming / limit),
        past: Math.ceil(totalPast / limit)
      },
      upcoming,
      ongoing,
      past,
      users
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



// ✅ Utility: Schedule a notification (for “5 min before appointment”)
const scheduleNotification = (model, data, delayMs) => {
  setTimeout(async () => {
    try {
      await model.create(data);
      console.log("⏰ Scheduled notification sent:", data.message);
    } catch (err) {
      console.error("❌ Error sending scheduled notification:", err);
    }
  }, delayMs);
};


// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ------------------------ Book Appointment ------------------------
// exports.bookAppointment = async (req, res) => {
//   try {
//     const { userId, doctorId, date, time, type, dependent, amount } = req.body;

//     if (!userId || !doctorId || !date || !time || !type || !amount)
//       return res.status(400).json({ message: "All fields are required" });

//     if (typeof amount !== "number" || amount <= 0)
//       return res.status(400).json({ message: "Amount must be a positive number" });

//     const appointmentDate = moment.tz(date, "Asia/Kolkata"); // moment object for date
//     const appointmentDateStr = appointmentDate.format("YYYY-MM-DD"); // "2025-10-09"

//     const appointmentDateTime = moment.tz(`${appointmentDateStr} ${time}`, "YYYY-MM-DD HH:mm", "Asia/Kolkata");

//     // Logging (optional)
//     console.log("Appointment date in IST:", appointmentDateStr);
//     console.log("Appointment time in IST:", appointmentDateTime.format());

//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const doctor = await Doctor.findById(doctorId);
//     if (!doctor) return res.status(404).json({ message: "Doctor not found" });

//     const dayStart = appointmentDate.clone().startOf("day").toDate(); // 00:00 IST as UTC Date
//     const dayEnd = appointmentDate.clone().endOf("day").toDate();     // 23:59:59 IST as UTC Date

//     const availability = await DoctorAvailability.findOne({
//       doctor: doctorId,
//       date: { $gte: dayStart, $lte: dayEnd },
//     });

//     if (!availability)
//       return res.status(400).json({ message: "Doctor is not available on this date" });

//      const availableStart = moment.tz(`${appointmentDateStr} ${availability.startTime}`, "YYYY-MM-DD HH:mm", "Asia/Kolkata").toDate();
//     const availableEnd = moment.tz(`${appointmentDateStr} ${availability.endTime}`, "YYYY-MM-DD HH:mm", "Asia/Kolkata").toDate();

//     const now = moment().tz("Asia/Kolkata").toDate();

//     if (appointmentDateTime.toDate() < now) {
//       return res.status(400).json({ message: "Cannot book an appointment in the past" });
//     }

//     if (
//       appointmentDateTime.toDate() < availableStart ||
//       appointmentDateTime.toDate() > availableEnd
//     ) {
//       return res.status(400).json({ message: "Doctor is not available for this time slot" });
//     }

//     // Create Razorpay order
//     const order = await razorpay.orders.create({
//       amount: amount * 100, // INR to paise
//       currency: "INR",
//       receipt: `receipt_${Date.now()}`,
//     });

//     // Save appointment
//     const appointment = await Appointment.create({
//       userId,
//       doctorId,
//       type,
//       date: appointmentDateStr,
//       time,
//       dependent: dependent || null,
//       status: "pending",
//       amount,
//       razorpayOrderId: order.id,
//     });

//     return res.status(201).json({
//       message: "Razorpay order created. Complete payment to confirm appointment",
//       order,
//       appointmentId: appointment._id,
//     });
//   } catch (error) {
//     console.error("Book Appointment Error:", error);
//     return res.status(500).json({ message: "Server Error", error: error.message });
//   }
// };

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

const appointment = await Appointment.findById(appointmentId)
      .populate("doctorId", "name")
      .populate("userId", "full_name");
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    if (appointment.status === "booked")
      return res.status(400).json({ message: "Appointment already booked" });

    appointment.status = "booked";
    appointment.razorpayPaymentId = razorpayPaymentId;
    
    // Generate unique appointment number if not already set
    if (!appointment.appointmentNumber) {
      appointment.appointmentNumber = await generateAppointmentNumber();
    }
    
    // Generate Jitsi link immediately for video appointments
    if (appointment.type === "video" && !appointment.jitsiLink) {
      appointment.jitsiLink = generateJitsiLink(appointment._id);
    }
    
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

    await sendAppointmentNotifications(appointment)
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
      
      // Generate unique appointment number if not already set
      if (!appointment.appointmentNumber) {
        appointment.appointmentNumber = await generateAppointmentNumber();
      }
      
      // Generate Jitsi link immediately for video appointments
      if (appointment.type === "video" && !appointment.jitsiLink) {
        appointment.jitsiLink = generateJitsiLink(appointment._id);
      }
      
      await appointment.save();

      const { emitNotification } = require("../services/socketService");

      const userNotif = await UserNotification.create({
        userId: appointment.userId,
        message: {
          text: `Payment successful! Your appointment with doctor ${appointment.doctorId} is confirmed.`,
        },
      });

      const doctorNotif = await DoctorNotification.create({
        doctorId: appointment.doctorId,
        message: {
          text: `New confirmed appointment from user ${appointment.userId}.`,
        },
      });

      // Emit real-time notifications
      emitNotification(appointment.userId, {
        message: "You have a new notification! Please check.",
        notification: userNotif,
      });

      emitNotification(appointment.doctorId, {
        message: "You have a new notification! Please check.",
        notification: doctorNotif,
      });



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

exports.bookAppointment = async (req, res) => {
  try {
    const { userId, doctorId, date, time, type, dependent, amount } = req.body;

    if (!userId || !doctorId || !date || !time || !type || !amount)
      return res.status(400).json({ message: "All fields are required" });

    if (typeof amount !== "number" || amount <= 0)
      return res.status(400).json({ message: "Amount must be a positive number" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const requestedDateIST = moment.utc(date).tz("Asia/Kolkata");
    const startOfDay = moment(requestedDateIST).startOf("day").toDate();
    const endOfDay = moment(requestedDateIST).endOf("day").toDate();
    const requestedTimeIST = moment.tz(`${requestedDateIST.format("YYYY-MM-DD")} ${time}`, "YYYY-MM-DD HH:mm", "Asia/Kolkata");
    const now = moment().tz("Asia/Kolkata");

    if (requestedTimeIST.isBefore(now))
      return res.status(400).json({ message: "Cannot book an appointment in the past" });

    const availabilities = await DoctorAvailability.find({
      doctor: doctorId,
      date: { $gte: requestedTimeIST}
    });

    if (!availabilities.length)
      return res.status(400).json({ message: "Doctor is not available on this date" });

    const matchingSlot = availabilities.find((availability) => {
      const [startHour, startMinute] = availability.startTime.split(":");
      const [endHour, endMinute] = availability.endTime.split(":");
      const slotStart = moment(requestedDateIST).hour(startHour).minute(startMinute);
      const slotEnd = moment(requestedDateIST).hour(endHour).minute(endMinute);
      if (slotEnd.isBefore(slotStart)) slotEnd.add(1, "day");
      return requestedTimeIST.isBetween(slotStart, slotEnd, null, "[)");
    });

    if (!matchingSlot)
      return res.status(400).json({ message: "Doctor is not available for this slot" });

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    });

    const appointment = await Appointment.create({
      userId,
      doctorId,
      type,
      date: requestedDateIST.toDate(),
      time,
      dependent: dependent || null,
      status: "pending",
      amount,
      razorpayOrderId: order.id
    });

    res.status(201).json({
      message: "Razorpay order created. Complete payment to confirm appointment",
      order,
      appointmentId: appointment._id
    });
  } catch (error) {
    console.error("Book Appointment Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Book Appointment with Pay at Clinic
exports.bookAppointmentAtClinic = async (req, res) => {
  try {
    const { userId, doctorId, date, time, type, dependent, amount } = req.body;

    if (!userId || !doctorId || !date || !time || !type || !amount)
      return res.status(400).json({ message: "All fields are required" });

    if (typeof amount !== "number" || amount <= 0)
      return res.status(400).json({ message: "Amount must be a positive number" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const requestedDateIST = moment.utc(date).tz("Asia/Kolkata");
    const requestedTimeIST = moment.tz(`${requestedDateIST.format("YYYY-MM-DD")} ${time}`, "YYYY-MM-DD HH:mm", "Asia/Kolkata");
    const now = moment().tz("Asia/Kolkata");

    if (requestedTimeIST.isBefore(now))
      return res.status(400).json({ message: "Cannot book an appointment in the past" });

    // Format date as string for comparison (DoctorAvailability.date is a String)
    const requestedDateStr = requestedDateIST.format("YYYY-MM-DD");
    const startOfDay = moment(requestedDateIST).startOf("day").toDate();
    const endOfDay = moment(requestedDateIST).endOf("day").toDate();

    // Try to find availability - check both string date match and date range
    const availabilities = await DoctorAvailability.find({
      doctor: doctorId,
      $or: [
        { date: requestedDateStr },
        { 
          date: { 
            $gte: moment(startOfDay).format("YYYY-MM-DD"),
            $lte: moment(endOfDay).format("YYYY-MM-DD")
          }
        }
      ]
    });

    // Check if slot is already booked
    const existingAppointment = await Appointment.findOne({
      doctorId,
      date: { 
        $gte: moment(requestedDateIST).startOf("day").toDate(),
        $lte: moment(requestedDateIST).endOf("day").toDate()
      },
      time,
      status: { $in: ["booked", "pending"] }
    });

    if (existingAppointment) {
      return res.status(400).json({ message: "This time slot is already booked. Please select another time." });
    }

    // If availability exists, validate the time slot
    if (availabilities.length > 0) {
      const matchingSlot = availabilities.find((availability) => {
        const [startHour, startMinute] = availability.startTime.split(":");
        const [endHour, endMinute] = availability.endTime.split(":");
        const slotStart = moment(requestedDateIST).hour(startHour).minute(startMinute);
        const slotEnd = moment(requestedDateIST).hour(endHour).minute(endMinute);
        if (slotEnd.isBefore(slotStart)) slotEnd.add(1, "day");
        return requestedTimeIST.isBetween(slotStart, slotEnd, null, "[)");
      });

      if (!matchingSlot) {
        return res.status(400).json({ message: "Doctor is not available for this time slot. Please select a time within their availability window." });
      }
    } else {
      // For doctors without availability set (dummy data or new doctors)
      // Allow booking but validate reasonable time slot (6 AM - 10:30 PM)
      const slotHour = requestedTimeIST.hour();
      if (slotHour < 6 || slotHour > 22 || (slotHour === 22 && requestedTimeIST.minute() > 30)) {
        return res.status(400).json({ message: "Please select a time between 6:00 AM and 10:30 PM" });
      }
    }

    // Generate unique appointment number
    const appointmentNumber = await generateAppointmentNumber();

    // Create appointment with status "booked" (payment at clinic)
    const appointment = await Appointment.create({
      userId,
      doctorId,
      type,
      date: requestedDateIST.toDate(),
      time,
      dependent: dependent || null,
      status: "booked",
      amount,
      appointmentNumber
      // No razorpayOrderId means payment will be at clinic
    });

    // Generate Jitsi link immediately for video appointments
    if (type === "video" && !appointment.jitsiLink) {
      appointment.jitsiLink = generateJitsiLink(appointment._id);
      await appointment.save();
    }

    // Add appointment to user and doctor
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

    await User.findByIdAndUpdate(userId, {
      $push: { appointments: subDoc },
    });
    await Doctor.findByIdAndUpdate(doctorId, {
      $push: { appointments: subDoc },
    });

    // Send notifications
    await sendAppointmentNotifications(appointment);

    // Prepare patient details for receipt
    const patientName = dependent ? (dependent.name || dependent.fullName) : user.full_name;
    const patientAge = dependent ? (dependent.age || dependent.dob) : user.age;
    const patientSex = dependent ? (dependent.sex || dependent.gender) : user.gender;
    const formattedDate = requestedDateIST.format("DD/MM/YYYY");
    const formattedTime = requestedTimeIST.format("hh:mm A");

    // Create and save receipt
    const receipt = await Receipt.create({
      appointmentId: appointment._id,
      userId: appointment.userId,
      doctorId: appointment.doctorId,
      appointmentNumber: appointment.appointmentNumber,
      doctorDetails: {
        name: doctor.name,
        speciality: doctor.speciality,
        email: doctor.email,
        mobile: doctor.mobile,
        hospitalName: doctor.hospitalName,
        hospitalLocation: doctor.hospitalLocation
      },
      patientDetails: {
        name: patientName,
        age: patientAge,
        gender: patientSex,
        email: dependent ? (dependent.email || user.email) : user.email,
        mobile: dependent ? (dependent.mobile || user.phone_number) : user.phone_number,
        address: dependent ? (dependent.address || user.address) : user.address,
        pincode: dependent ? (dependent.pincode || user.pincode) : user.pincode
      },
      appointmentDetails: {
        date: requestedDateIST.toDate(),
        time: formattedTime,
        type: type,
        status: "booked"
      },
      paymentDetails: {
        amount: amount,
        paymentMethod: "Pay at Clinic",
        status: "Pending"
      }
    });

    // Send receipt email to doctor

    const receiptHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #00A99D;">Appointment Receipt - Pay at Clinic</h2>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Appointment Details</h3>
          <p><strong>Appointment Number:</strong> ${appointment.appointmentNumber || appointment._id}</p>
          <p><strong>Date:</strong> ${formattedDate}</p>
          <p><strong>Time:</strong> ${formattedTime}</p>
          <p><strong>Consultation Type:</strong> ${type === "clinic" ? "Clinic Visit" : "Video Consultation"}</p>
        </div>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Patient Details</h3>
          <p><strong>Name:</strong> ${patientName}</p>
          <p><strong>Age:</strong> ${patientAge}</p>
          <p><strong>Sex:</strong> ${patientSex}</p>
        </div>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Payment Details</h3>
          <p><strong>Consultation Fee:</strong> ₹ ${amount}.00</p>
          <p><strong>Payment Method:</strong> Pay at Clinic</p>
          <p><strong>Status:</strong> Payment Pending</p>
        </div>
        <p style="color: #666; font-size: 12px; margin-top: 30px;">
          This is an automated receipt. Please collect payment from the patient at the clinic.
        </p>
      </div>
    `;

    if (doctor.email) {
      try {
        await sendEmail({
          email: doctor.email,
          subject: `New Appointment - Pay at Clinic (${patientName})`,
          message: receiptHtml
        });
        console.log(`Receipt sent to doctor: ${doctor.email}`);
      } catch (emailError) {
        console.error("Failed to send receipt email to doctor:", emailError);
        // Don't fail the appointment creation if email fails
      }
    }

    res.status(201).json({
      message: "Appointment booked successfully. Payment will be collected at clinic.",
      appointmentId: appointment._id,
      appointment,
      receiptId: receipt._id
    });
  } catch (error) {
    console.error("Book Appointment At Clinic Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};



exports.getDoctorAppointmentsForApp = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const now = new Date();

    const userIds = await Appointment.distinct('userId', { doctorId, status: 'booked' });

    let users = await User.find({ _id: { $in: userIds } }).select('-appointments');
    let totalAmount = 0;

    const userAppointments = await Appointment.find({
      doctorId,
      // userId: { $in: userIds },
      status: 'booked'
    });
    for (let i = 0; i < userAppointments.length; i++) {
      totalAmount += Number(userAppointments[i].amount)
    }


    const doctorAvailability = await DoctorAvailability.findOne({ doctor: doctorId });
    if (!doctorAvailability) {
      return res.status(404).json({ message: "Doctor availability not found" });
    }

    const slotDuration = doctorAvailability.slotDuration;
    const formatTime = date => date.toTimeString().slice(0, 5);

    users = users.map(user => {
      const appointment = userAppointments.find(app => app.userId.toString() === user._id.toString());
      if (appointment) {
        const start = appointment.time;
        const [hours, minutes] = start.split(":").map(Number);
        const startDate = new Date();
        startDate.setHours(hours, minutes, 0, 0);
        const endDate = new Date(startDate.getTime() + slotDuration * 60000);
        return {
          _id: user._id,
          profileImage: user.profileImage,
          startTime: formatTime(startDate),
          endTime: formatTime(endDate),
          status: user.status,
          jitsiLink: user.jitsiLink,
          type: user.type,
          gender: user.gender || null,
          lastVisit: formatTime(startDate) || null,
          age: user.dob || null

        };
      }
      return {
        _id: user._id,
        profileImage: user.profileImage,
        startTime: null,
        endTime: null,
        status: user.status,
        jitsiLink: user.jitsiLink,
        type: User.type,
        gender: user.age,
        lastVisit: user.lastVisit,
        age: user.age || null
      };
    });

    const totalUpcomingCount = await Appointment.countDocuments({
      doctorId,
      date: { $gte: now },
    });
    let upcoming = await Appointment.find({
      doctorId,
      date: { $gte: now },
    }).populate("userId", "full_name email phone_number")
      .sort({ date: 1 })
      .skip(skip)
      .limit(limit);

    const totalPastCount = await Appointment.countDocuments({
      doctorId,
      date: { $lt: now },
    });
    let past = await Appointment.find({
      doctorId,
      date: { $lt: now },
    }).populate("userId", "full_name email phone_number")
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await Appointment.countDocuments({ doctorId });
    let total = await Appointment.find({
      doctorId
    }).populate("userId", "full_name email phone_number")
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    const attachUserDetails = (appointments) => {
      return appointments.map(appointment => {
        const obj = appointment.toObject();
        const userId = obj.userId?._id?.toString() || obj.userId?.toString();
        const userMatch = users.find(u => u._id.toString() === userId);

        if (userMatch && typeof obj.userId === 'object') {
          obj.userId.profileImage = userMatch.profileImage || {};
          obj.userId.startTime = userMatch.startTime || null;
          obj.userId.endTime = userMatch.endTime || null;
          obj.userId.status = userMatch.status || null;
          obj.userId.jitsiLink = userMatch.jitsiLink || null;
          obj.userId.type = userMatch.type || null;
          obj.userId.gender = userMatch.gender || null,
            obj.userId.lastVisit = userMatch.startDate || null,
            obj.userId.age = userMatch.age || null

        }
        return obj;
      });
    };

    past = attachUserDetails(past);
    upcoming = attachUserDetails(upcoming);
    total = attachUserDetails(total);


    function isToday(dateString) {
      const date = new Date(dateString);
      const today = new Date();
      return (
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()
      );
    }

    const todayPatient = upcoming.filter(item => isToday(item.date));

    res.status(200).json({
      totalAmount: totalAmount,
      totalUpcoming: totalUpcomingCount,
      totalAppointments: totalCount,
      todayPatient : todayPatient.length,
      rating : "3.5",
      page,
      limit,
      totalPages: {
        upcoming: Math.ceil(totalUpcomingCount / limit),
        past: Math.ceil(totalPastCount / limit),
        total: Math.ceil(totalCount / limit)
      },
      upcoming,
      past,
      total
    });

  } catch (error) {
    console.error("Get Doctor Appointments Error:", error);
    res.status(500).json({ message: error.message });
  }
};
