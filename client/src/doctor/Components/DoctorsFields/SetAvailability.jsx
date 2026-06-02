import React, { useState } from "react";
import { API_BASE_URL } from "../../../api-config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CalendarAndSlots = () => {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });

  const [slot, setSlot] = useState({ start: "", end: "", duration: "" });

  const today = new Date();
  today.setHours(0, 0, 0, 0); // for date comparison

  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const month = selectedDate.toLocaleString("default", { month: "long" });
  const year = selectedDate.getFullYear();
  const numDays = daysInMonth(selectedDate.getMonth(), year);
  const firstDayOfMonth = new Date(year, selectedDate.getMonth(), 1).getDay();

  const generateTimeOptions = () => {
    const times = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        const hour = h.toString().padStart(2, "0");
        const min = m.toString().padStart(2, "0");
        times.push(`${hour}:${min}`);
      }
    }
    return times;
  };

  const allTimes = generateTimeOptions();

  const handleSave = async () => {
    if (!slot.start || !slot.end || !slot.duration) {
      toast.warning("Please select a start time, end time, and duration.");
      return;
    }

    if (slot.start >= slot.end) {
      toast.error("Start time must be earlier than End time.");
      return;
    }

    const doctorId = localStorage.getItem("doctorId");
    if (!doctorId) {
      toast.error("Doctor ID not found. Please log in again.");
      return;
    }

    const dateOnlyUTC = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate()
    ); 

    dateOnlyUTC.setMinutes(dateOnlyUTC.getMinutes() + 330);
    const dateOnly = dateOnlyUTC.toISOString().split('T')[0];

    const payload = {
      date: dateOnly,
      startTime: slot.start,
      endTime: slot.end,
      slotDuration: parseInt(slot.duration, 10),
    };

    try {
      console.log(payload)
      const response = await fetch(
        `${API_BASE_URL}/api/doctors/${doctorId}/availability`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      if (response.ok) {
        let newDate = new Date();
        newDate.setHours(0, 0, 0, 0);
        setSelectedDate(newDate)
        setSlot({start:"",end:"",duration:""});
        
        toast.success("Availability saved for " + selectedDate.toDateString());
      } else {
        toast.error(data.message || "Error saving availability");
      }
    } catch (error) {
      toast.error("Failed to save availability");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-28 p-4 lg:p-8 md:pl-[80px] lg:pl-[327px] mt-[48px] md:mt-[58px] lg:mt-[60px] font-urbanist">
      {/* Left Side: Calendar */}
      <div className="w-full lg:w-1/3">
        <h2 className="hidden lg:block text-xl lg:text-2xl font-semibold mb-4 lg:mb-6">
          Select a Date
        </h2>

        <p className="text-gray-500 mb-4">
          Choose a date to manage your available time slots
        </p>

        <div className="flex items-center justify-between mb-4">
          <span className="font-medium">
            {month} {year}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() =>
                setSelectedDate(
                  new Date(year, selectedDate.getMonth() - 1, 1)
                )
              }
              className="px-2 py-1 rounded hover:bg-gray-100"
            >
              &lt;
            </button>
            <button
              onClick={() =>
                setSelectedDate(
                  new Date(year, selectedDate.getMonth() + 1, 1)
                )
              }
              className="px-2 py-1 rounded hover:bg-gray-100"
            >
              &gt;
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-gray-500 mb-2">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, index) => (
            <div key={index} className="font-medium">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="p-2"></div>
          ))}

          {Array.from({ length: numDays }, (_, i) => i + 1).map((day) => {
            const currentDate = new Date(year, selectedDate.getMonth(), day);
            currentDate.setHours(0, 0, 0, 0);
            const isSelected = day === selectedDate.getDate();
            const isPast = currentDate < today;

            return (
              <button
                key={day}
                onClick={() => !isPast && setSelectedDate(currentDate)}
                disabled={isPast}
                className={`py-2 rounded w-full border-none ${
                  isSelected
                    ? "bg-teal-500 text-white"
                    : isPast
                    ? "text-gray-300 cursor-not-allowed"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Side: Manage Slots */}
      <div className="w-full lg:w-[529px]">
        <h2 className="text-xl lg:text-2xl font-semibold mb-2">
          Manage time slots for {selectedDate.toDateString()}
        </h2>
        <p className="text-gray-500 mb-6">
          Set your availability block and slot duration
        </p>

        {/* --- NEW TIME SLOT UI STARTS HERE --- */}
        <div className="space-y-6">
          {/* 1. Slot Duration Selection */}
          <div>
            <h3 className="font-semibold mb-2 text-gray-700">Slot Duration</h3>
            <div className="flex gap-2">
              {["30", "60"].map((duration) => (
                <button
                  key={duration}
                  onClick={() => setSlot({ ...slot, duration })}
                  className={`px-4 py-2 rounded-lg border-2 font-medium transition-colors ${
                    slot.duration === duration
                      ? "bg-teal-500 text-white border-teal-500"
                      : "bg-white text-gray-600 border-gray-300 hover:border-teal-400"
                  }`}
                >
                  {duration} mins
                </button>
              ))}
            </div>
          </div>

          {/* 2. Time Range Selection */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-gray-700">Select Time Range (Start & End)</h3>
              {slot.start && (
                <button
                  onClick={() => setSlot({ ...slot, start: "", end: "" })}
                  className="text-sm font-semibold text-teal-600 hover:text-teal-800"
                >
                  Clear
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 max-h-[300px] overflow-y-auto p-2 border rounded-lg">
              {allTimes.map((time) => {
                const isSelectedStart = slot.start === time;
                const isSelectedEnd = slot.end === time;
                const isInRange = slot.start && slot.end && time > slot.start && time < slot.end;
                const isDisabled = slot.start && !slot.end && time < slot.start;

                const handleTimeClick = () => {
                  if (isDisabled) return;
                  if (!slot.start) {
                    setSlot({ ...slot, start: time, end: "" });
                  } else if (slot.start && !slot.end) {
                    setSlot({ ...slot, end: time });
                  } else {
                    setSlot({ ...slot, start: time, end: "" });
                  }
                };

                return (
                  <button
                    key={time}
                    onClick={handleTimeClick}
                    disabled={isDisabled}
                    className={`p-2 text-sm rounded-md transition-all font-semibold border
                      ${
                        isSelectedStart || isSelectedEnd
                          ? 'bg-teal-600 text-white border-teal-600 ring-2 ring-teal-300'
                          : isInRange
                          ? 'bg-teal-100 text-teal-800 border-teal-200'
                          : isDisabled
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-teal-400'
                      }
                    `}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        {/* --- NEW TIME SLOT UI ENDS HERE --- */}

        <button
          onClick={handleSave}
          className="w-full bg-teal-600 text-white py-3 rounded hover:bg-teal-700 border-none mt-6"
        >
          Save Availability
        </button>
      </div>
    </div>
  );
};

export default CalendarAndSlots;