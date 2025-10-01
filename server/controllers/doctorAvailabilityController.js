const DoctorAvailability = require("../models/doctorAvailability");
const Booking = require("../models/bookingModel");
const mongoose = require("mongoose");


// Add availability
const addAvailability = async (req, res) => {
  try {
    const { date, startTime, endTime, slotDuration } = req.body;

    // Normalize date to midnight
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);

    const availability = new DoctorAvailability({
      doctor: req.params.doctorId,
      date  : normalizedDate,
      startTime,
      endTime,
      slotDuration,
    });

    await availability.save();
    res.status(201).json({ message: "Availability added", availability });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Generate slots
const getSlots = async (req, res) => {
  try {
    const { doctorId, date } = req.params;

if (!mongoose.Types.ObjectId.isValid(doctorId)) {
  return res.status(400).json({ message: "Invalid doctor ID" });
}

const startOfDay = new Date(date);
startOfDay.setHours(0, 0, 0, 0);

const endOfDay = new Date(date);
endOfDay.setHours(23, 59, 59, 999);

const availability = await DoctorAvailability.findOne({
  doctor: doctorId,
  date: { $gte: startOfDay, $lte: endOfDay },
});
    const { startTime, endTime, slotDuration } = availability;

    const slots = [];
    let [startHour, startMinute] = startTime.split(":").map(Number);
    let [endHour, endMinute] = endTime.split(":").map(Number);

    let start = new Date(date);
    start.setHours(startHour, startMinute, 0, 0);

    let end = new Date(date);
    end.setHours(endHour, endMinute, 0, 0);

    while (start < end) {
      let slotStart = new Date(start);
      start.setMinutes(start.getMinutes() + slotDuration);
      let slotEnd = new Date(start);

      if (slotEnd <= end) {
        slots.push({
          start: slotStart.toTimeString().slice(0, 5),
          end: slotEnd.toTimeString().slice(0, 5),
        });
      }
    }

    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);

    const booked = await Booking.find({
      doctor: doctorId,
      date: { $gte: new Date(date), $lt: nextDay },
      status: "booked",
    });

    const bookedSlots = booked.map((b) => `${b.slot.start}-${b.slot.end}`);

    // Remove booked slots
    const availableSlots = slots.filter(
      (s) => !bookedSlots.includes(`${s.start}-${s.end}`)
    );

    res.json({ doctorId, date, slots: availableSlots });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Book a slot
const bookSlot = async (req, res) => {
  try {
    const { doctorId, patientId, date, slot } = req.body;

    const exists = await Booking.findOne({
      doctor: doctorId,
      date: new Date(date),
      "slot.start": slot.start,
      "slot.end": slot.end,
      status: "booked",
    });

    if (exists) {
      return res.status(400).json({ message: "Slot already booked" });
    }

    const booking = new Booking({
      doctor: doctorId,
      patient: patientId,
      date: new Date(date),
      slot,
    });

    await booking.save();

    res.status(201).json({ message: "Slot booked", booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addAvailability, getSlots, bookSlot };
