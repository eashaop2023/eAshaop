const DoctorAvailability = require("../models/doctorAvailability");
const Booking = require("../models/bookingModel");
const mongoose = require("mongoose");


// Add availability
const addAvailability = async (req, res) => {
  try {
    const { date, startTime, endTime, slotDuration } = req.body;

    // Convert date to YYYY-MM-DD format (schema expects String)
    const dateObj = new Date(date);
    dateObj.setHours(0, 0, 0, 0);
    const dateStr = dateObj.toISOString().split('T')[0]; // Format: YYYY-MM-DD

    const availability = new DoctorAvailability({
      doctor: req.params.doctorId,
      date: dateStr, // Store as String in YYYY-MM-DD format
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

    console.log(`[getSlots] Request received - doctorId: ${doctorId}, date: ${date}`);

    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      console.error(`[getSlots] Invalid doctor ID: ${doctorId}`);
      return res.status(400).json({ message: "Invalid doctor ID" });
    }

    // Parse date string more explicitly to avoid timezone issues
    // Expected format: YYYY-MM-DD
    let dateStr = date;
    if (date.includes('T') || date.includes(' ')) {
      // If date includes time, extract just the date part
      dateStr = date.split('T')[0].split(' ')[0];
    }
    
    // Validate date format (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      console.error(`[getSlots] Invalid date format: ${date}, parsed as: ${dateStr}`);
      return res.status(400).json({ message: "Invalid date format. Expected YYYY-MM-DD" });
    }

    console.log(`[getSlots] Parsed date string: ${dateStr}`);

    const availability = await DoctorAvailability.findOne({
      doctor: doctorId,
      date: dateStr, // Match exact date string
    });

    console.log(`[getSlots] Availability found: ${availability ? 'Yes' : 'No'}`);

    // If no availability found, generate all default slots (6:00 AM to 10:30 PM, 30 min intervals)
    if (!availability) {
      const defaultSlots = [];
      for (let hour = 6; hour <= 22; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const startHour = hour.toString().padStart(2, '0');
          const startMinute = minute.toString().padStart(2, '0');
          const startTime = `${startHour}:${startMinute}`;
          
          // Calculate end time (30 minutes later)
          let endHour = hour;
          let endMinute = minute + 30;
          if (endMinute >= 60) {
            endHour += 1;
            endMinute = 0;
          }
          // Stop if we exceed 22:30 (10:30 PM)
          if (endHour > 22 || (endHour === 22 && endMinute > 30)) {
            break;
          }
          
          const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
          defaultSlots.push({
            start: startTime,
            end: endTime
          });
        }
      }
      
      // Check for booked slots and filter them out
      // Parse date string to create date objects in local timezone
      const [yearDefault, monthDefault, dayDefault] = dateStr.split('-').map(Number);
      const startOfDay = new Date(yearDefault, monthDefault - 1, dayDefault, 0, 0, 0, 0);
      const endOfDay = new Date(yearDefault, monthDefault - 1, dayDefault, 23, 59, 59, 999);
      
      const booked = await Booking.find({
        doctor: doctorId,
        date: { $gte: startOfDay, $lte: endOfDay },
        status: "booked",
      });
      
      console.log(`[getSlots] Found ${booked.length} booked slots`);
      
      const bookedSlots = booked.map((b) => `${b.slot.start}-${b.slot.end}`);
      
      const availableSlots = defaultSlots.filter(
        (s) => !bookedSlots.includes(`${s.start}-${s.end}`)
      );
      
      console.log(`[getSlots] Returning ${availableSlots.length} available slots`);
      
      // Apply pagination
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 50;
      const skip = (page - 1) * limit;
      const totalSlots = availableSlots.length;
      const paginatedSlots = availableSlots.slice(skip, skip + limit);
      
      return res.json({ 
        doctorId, 
        date: dateStr, 
        totalSlots,
        page,
        limit,
        totalPages: Math.ceil(totalSlots / limit),
        slots: paginatedSlots 
      });
    }

    const { startTime, endTime, slotDuration } = availability;

    console.log(`[getSlots] Using availability - startTime: ${startTime}, endTime: ${endTime}, slotDuration: ${slotDuration}`);

    const slots = [];
    let [startHour, startMinute] = startTime.split(":").map(Number);
    let [endHour, endMinute] = endTime.split(":").map(Number);

    // Create date objects using the date string and local time
    // Parse date as YYYY-MM-DD and create date in local timezone
    const [year, month, day] = dateStr.split('-').map(Number);
    const start = new Date(year, month - 1, day, startHour, startMinute, 0, 0);
    const end = new Date(year, month - 1, day, endHour, endMinute, 0, 0);

    // Handle case where endTime is next day (e.g., 23:00 to 01:00)
    if (end <= start) {
      end.setDate(end.getDate() + 1);
    }

    let currentTime = new Date(start);
    while (currentTime < end) {
      let slotStart = new Date(currentTime);
      currentTime.setMinutes(currentTime.getMinutes() + slotDuration);
      let slotEnd = new Date(currentTime);

      if (slotEnd <= end) {
        // Format time as HH:mm (local time)
        const startHours = slotStart.getHours().toString().padStart(2, '0');
        const startMins = slotStart.getMinutes().toString().padStart(2, '0');
        const endHours = slotEnd.getHours().toString().padStart(2, '0');
        const endMins = slotEnd.getMinutes().toString().padStart(2, '0');
        
        slots.push({
          start: `${startHours}:${startMins}`,
          end: `${endHours}:${endMins}`,
        });
      }
    }

    // Check for booked slots - reuse date variables from above
    const startOfDay = new Date(year, month - 1, day, 0, 0, 0, 0);
    const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999);

    const booked = await Booking.find({
      doctor: doctorId,
      date: { $gte: startOfDay, $lte: endOfDay },
      status: "booked",
    });

    console.log(`[getSlots] Found ${booked.length} booked slots`);

    const bookedSlots = booked.map((b) => `${b.slot.start}-${b.slot.end}`);

    // Remove booked slots
    const availableSlots = slots.filter(
      (s) => !bookedSlots.includes(`${s.start}-${s.end}`)
    );

    console.log(`[getSlots] Returning ${availableSlots.length} available slots`);

    // Apply pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;
    const totalSlots = availableSlots.length;
    const paginatedSlots = availableSlots.slice(skip, skip + limit);

    res.json({ 
      doctorId, 
      date: dateStr, 
      totalSlots,
      page,
      limit,
      totalPages: Math.ceil(totalSlots / limit),
      slots: paginatedSlots 
    });
  } catch (error) {
    console.error(`[getSlots] Error:`, error);
    console.error(`[getSlots] Error stack:`, error.stack);
    res.status(500).json({ 
      message: error.message,
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
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
