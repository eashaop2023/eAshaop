import React, { useState } from "react";
// import { FaTrash, FaPlus } from "react-icons/fa";

const CalendarAndSlots = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [slot, setSlot] = useState([{ start: "", end: "" }]);
  // const [newSlot, setNewSlot] = useState({ start: "", end: "" });

  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();


  const month = selectedDate.toLocaleString("default", { month: "long" });
  const year = selectedDate.getFullYear();
  const numDays = daysInMonth(selectedDate.getMonth(), year);
  const firstDayOfMonth = new Date(year, selectedDate.getMonth(), 1).getDay();


    const handleSave = async() => {
    if (!slot.start || !slot.end) {
      alert("Please enter start, end times, and select a slot duration.");
      return;
    }
      const doctorId = localStorage.getItem("doctorId"); // 👈 Get doctorId from localStorage
  if (!doctorId) {
    alert("Doctor ID not found. Please log in again.");
    return;
  }

const payload = {
      date: selectedDate,
      startTime: slot.start,
      endTime: slot.end,
      slotDuration: parseInt(slot.duration),
    };

    try {
      // Replace doctorId dynamically or from context
      const response = await fetch(
        `http://localhost:5000/api/doctors/${doctorId}/availability`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert(`Availability saved for ${selectedDate.toDateString()}`);
      } else {
        alert(data.message || "Error saving availability");
      }
    } catch (error) {
      alert("Failed to save availability");
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
          <span className="font-medium">{month} {year}</span>
          <div className="flex gap-2">
            <button
              onClick={() =>
                setSelectedDate(new Date(year, selectedDate.getMonth() - 1, 1))
              }
              className="px-2 py-1 rounded hover:bg-gray-100"
            >
              &lt;
            </button>
            <button
              onClick={() =>
                setSelectedDate(new Date(year, selectedDate.getMonth() + 1, 1))
              }
              className="px-2 py-1 rounded hover:bg-gray-100"
            >
              &gt;
            </button>
          </div>
        </div>

        {/* Weekdays */}
        <div className="grid grid-cols-7 gap-1 text-center text-gray-500 mb-2">
          {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
            <div key={d} className="font-medium">{d}</div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1 text-center ">
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="p-2"></div>
          ))}
          {Array.from({ length: numDays }, (_, i) => i + 1).map((day) => {
            const isSelected = day === selectedDate.getDate();
            return (
              <button
                key={day}
                onClick={() =>
                  setSelectedDate(new Date(year, selectedDate.getMonth(), day))
                }
                className={`py-2 rounded w-full border-none ${
                  isSelected
                    ? "bg-teal-500 text-white"
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
        <p className="text-gray-500 mb-4">
          Set your availability block and slot duration
        </p>

        {/* <div className="space-y-2 mb-4">
          {slots.map((slot, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 border"
              style={{ borderColor: "#F7F7F7" }}
            >
              <span>{slot.start} - {slot.end}</span>
              <button
                onClick={() => handleRemoveSlot(index)}
                className="text-teal-500 hover:text-teal-700 border-none"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div> */}

        <div className="flex flex-col sm:flex-row items-center gap-2 mb-4 mt-4 lg:mt-[157px]">
          <input
            type="text"
            placeholder="Start (e.g., 8:00)"
            value={slot.start}
            onChange={(e) => setSlot({ ...slot, start: e.target.value })}
            className="border rounded p-2 flex-1 w-full"
          />
          <input
            type="text"
            placeholder="End (e.g., 12:00)"
            value={slot.end}
            onChange={(e) => setSlot({ ...slot, end: e.target.value })}
            className="border rounded p-2 flex-1 w-full"
          />

          <select
            value={slot.duration}
            onChange={(e) => setSlot({ ...slot, duration: e.target.value })}
            className="border rounded p-2 flex-1 w-full"
          >
            <option value="">Duration</option>
            <option value="30">30:00</option>
            <option value="60">60:00</option>
          </select>
        </div>

        <button onClick={handleSave}

         className="w-full bg-teal-600 text-white py-3 rounded hover:bg-teal-700 border-none">
          Save Availability
        </button>
      </div>
    </div>
  );
};

export default CalendarAndSlots;
