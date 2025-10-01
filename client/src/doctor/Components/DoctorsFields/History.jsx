import React, { useState } from "react";
import { Link } from "react-router-dom";

const bookings = [
  { id: "EE01", name: "Ravi", condition: "Fever", date: "23-05-2025", visit: "Emergency", status: "Pending" },
  { id: "EE02", name: "Murani", condition: "Fever", date: "23-05-2025", visit: "Emergency", status: "Cancelled" },
  { id: "EE03", name: "Priyanka", condition: "Fever", date: "23-05-2025", visit: "Emergency", status: "Paid" },
  { id: "EE04", name: "Anil", condition: "Fever", date: "23-05-2025", visit: "Emergency", status: "Completed" },
];

const getStatusColor = (status) => {
  switch (status) {
    case "Pending": return "bg-blue-500";
    case "Cancelled": return "bg-red-500";
    case "Paid": return "bg-emerald-500";
    case "Completed": return "bg-green-600";
    default: return "bg-gray-400";
  }
};

const BookingHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  // Filter bookings based on search and status
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.date.includes(searchTerm) ||
      b.visit.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All Status" || b.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="ml-0 md:pl-[80px] lg:pl-[327px] mt-[75px] md:mt-[85px] lg:mt-[80px] font-urbanist px-4 sm:px-6">
      {/* Title */}
      <h2 className="text-xl sm:text-2xl font-semibold mb-6">Booking History</h2>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-6">
        <input
          type="text"
          placeholder="Search Patients"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 sm:px-4 py-2 w-full sm:w-56 focus:outline-none"
        />
        <input
          type="text"
          placeholder="Select date range"
          className="border border-gray-300 rounded-lg px-3 sm:px-4 py-2 w-full sm:w-56 focus:outline-none"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 sm:px-4 py-2 w-full sm:w-40 focus:outline-none"
        >
          <option>All Status</option>
          <option>Pending</option>
          <option>Cancelled</option>
          <option>Paid</option>
          <option>Completed</option>
        </select>
        <button className="bg-teal-600 text-white px-4 sm:px-5 py-2 rounded-lg border-none w-full sm:w-auto">
          Export to CSV
        </button>
      </div>

      {/* Table */}
      <h3 className="text-lg font-medium mb-3">Past Bookings</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm sm:text-base">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-left">
              <th className="px-3 sm:px-4 py-2">Booking ID</th>
              <th className="px-3 sm:px-4 py-2">Patient Name</th>
              <th className="px-3 sm:px-4 py-2">Health Condition</th>
              <th className="px-3 sm:px-4 py-2">Date</th>
              <th className="px-3 sm:px-4 py-2">Type of Visit</th>
              <th className="px-3 sm:px-4 py-2">Prescription</th>
              <th className="px-3 sm:px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length > 0 ? (
              filteredBookings.map((b, idx) => (
                <tr key={idx} className="border-b text-gray-700 border-none">
                  <td className="px-3 sm:px-4 py-2">{b.id}</td>
                  <td className="px-3 sm:px-4 py-2">{b.name}</td>
                  <td className="px-3 sm:px-4 py-2">{b.condition}</td>
                  <td className="px-3 sm:px-4 py-2">{b.date}</td>
                  <td className="px-3 sm:px-4 py-2">{b.visit}</td>
                  <td className="px-3 sm:px-4 py-2 text-teal-600 cursor-pointer">
                    <Link to="/prescriptions" className="no-underline text-teal-600">
                      View details
                    </Link>
                  </td>
                  <td className="px-3 sm:px-4 py-2">
                    <span
                      className={`${getStatusColor(b.status)} text-white px-3 py-1 rounded-full text-xs sm:text-sm w-24 inline-block text-center`}
                    >
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center text-gray-500 py-4">
                  No bookings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingHistory;
