// // // import React, { useState } from "react";
// // // import { Link } from "react-router-dom";

// // // const bookings = [
// // //   { id: "EE01", name: "Ravi", condition: "Fever", date: "23-05-2025", visit: "Emergency", status: "Pending" },
// // //   { id: "EE02", name: "Murani", condition: "Fever", date: "23-05-2025", visit: "Emergency", status: "Cancelled" },
// // //   { id: "EE03", name: "Priyanka", condition: "Fever", date: "23-05-2025", visit: "Emergency", status: "Paid" },
// // //   { id: "EE04", name: "Anil", condition: "Fever", date: "23-05-2025", visit: "Emergency", status: "Completed" },
// // // ];

// // // const getStatusColor = (status) => {
// // //   switch (status) {
// // //     case "Pending": return "bg-blue-500";
// // //     case "Cancelled": return "bg-red-500";
// // //     case "Paid": return "bg-emerald-500";
// // //     case "Completed": return "bg-green-600";
// // //     default: return "bg-gray-400";
// // //   }
// // // };
// // //   const [upcomingPage, setUpcomingPage] = useState(1);
// // //   const [pastPage, setPastPage] = useState(1);
// // //   const [pastAppointments, setPastAppointments] = useState([]);

// // //   const doctorId = localStorage.getItem("doctorId");

// // //   useEffect(() => {
// // //     const fetchAppointments = async () => {
// // //       try {
// // //         const response = await axios.get(
// // //           `${API_BASE_URL}/api/appointments/doctor/${doctorId}`
// // //         );
// // //         console.log("Fetched appointments:", response.data);
// // //         setPastAppointments(response.data.past || []);

// // //       } catch (error) {
// // //         console.error("Error fetching appointments:", error);
// // //       } finally {
// // //         setLoading(false);
// // //       }
// // //     };

// // //     fetchAppointments();
// // //   }, [doctorId]);
// // // const BookingHistory = () => {
// // //   const [searchTerm, setSearchTerm] = useState("");
// // //   const [statusFilter, setStatusFilter] = useState("All Status");

// // //   // Filter bookings based on search and status
// // //   const filteredBookings = bookings.filter((b) => {
// // //     const matchesSearch =
// // //       b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // //       b.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // //       b.date.includes(searchTerm) ||
// // //       b.visit.toLowerCase().includes(searchTerm.toLowerCase());

// // //     const matchesStatus =
// // //       statusFilter === "All Status" || b.status === statusFilter;

// // //     return matchesSearch && matchesStatus;
// // //   });

// // //   return (
// // //     <div className="ml-0 md:pl-[80px] lg:pl-[327px] mt-[75px] md:mt-[85px] lg:mt-[80px] font-urbanist px-4 sm:px-6">
// // //       {/* Title */}
// // //       <h2 className="text-xl sm:text-2xl font-semibold mb-6">Booking History</h2>

// // //       {/* Filters */}
// // //       <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-6">
// // //         <input
// // //           type="text"
// // //           placeholder="Search Patients"
// // //           value={searchTerm}
// // //           onChange={(e) => setSearchTerm(e.target.value)}
// // //           className="border border-gray-300 rounded-lg px-3 sm:px-4 py-2 w-full sm:w-56 focus:outline-none"
// // //         />
// // //         <input
// // //           type="text"
// // //           placeholder="Select date range"
// // //           className="border border-gray-300 rounded-lg px-3 sm:px-4 py-2 w-full sm:w-56 focus:outline-none"
// // //         />
// // //         <select
// // //           value={statusFilter}
// // //           onChange={(e) => setStatusFilter(e.target.value)}
// // //           className="border border-gray-300 rounded-lg px-3 sm:px-4 py-2 w-full sm:w-40 focus:outline-none"
// // //         >
// // //           <option>All Status</option>
// // //           <option>Pending</option>
// // //           <option>Cancelled</option>
// // //           <option>Paid</option>
// // //           <option>Completed</option>
// // //         </select>
// // //         <button className="bg-teal-600 text-white px-4 sm:px-5 py-2 rounded-lg border-none w-full sm:w-auto">
// // //           Export to CSV
// // //         </button>
// // //       </div>

// // //       {/* Table */}
// // //       <h3 className="text-lg font-medium mb-3">Past Bookings</h3>
// // //       <div className="overflow-x-auto">
// // //         <table className="w-full border-collapse text-sm sm:text-base">
// // //           <thead>
// // //             <tr className="bg-gray-100 text-gray-700 text-left">
// // //               <th className="px-3 sm:px-4 py-2">Booking ID</th>
// // //               <th className="px-3 sm:px-4 py-2">Patient Name</th>
// // //               <th className="px-3 sm:px-4 py-2">Health Condition</th>
// // //               <th className="px-3 sm:px-4 py-2">Date</th>
// // //               <th className="px-3 sm:px-4 py-2">Type of Visit</th>
// // //               <th className="px-3 sm:px-4 py-2">Prescription</th>
// // //               <th className="px-3 sm:px-4 py-2">Status</th>
// // //             </tr>
// // //           </thead>
// // //           <tbody>
// // //             {filteredBookings.length > 0 ? (
// // //               filteredBookings.map((b, idx) => (
// // //                 <tr key={idx} className="border-b text-gray-700 border-none">
// // //                   <td className="px-3 sm:px-4 py-2">{b.id}</td>
// // //                   <td className="px-3 sm:px-4 py-2">{b.name}</td>
// // //                   <td className="px-3 sm:px-4 py-2">{b.condition}</td>
// // //                   <td className="px-3 sm:px-4 py-2">{b.date}</td>
// // //                   <td className="px-3 sm:px-4 py-2">{b.visit}</td>
// // //                   <td className="px-3 sm:px-4 py-2 text-teal-600 cursor-pointer">
// // //                     <Link to="/prescriptions" className="no-underline text-teal-600">
// // //                       View details
// // //                     </Link>
// // //                   </td>
// // //                   <td className="px-3 sm:px-4 py-2">
// // //                     <span
// // //                       className={`${getStatusColor(b.status)} text-white px-3 py-1 rounded-full text-xs sm:text-sm w-24 inline-block text-center`}
// // //                     >
// // //                       {b.status}
// // //                     </span>
// // //                   </td>
// // //                 </tr>
// // //               ))
// // //             ) : (
// // //               <tr>
// // //                 <td colSpan="7" className="text-center text-gray-500 py-4">
// // //                   No bookings found
// // //                 </td>
// // //               </tr>
// // //             )}
// // //           </tbody>
// // //         </table>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default BookingHistory;


// // import React, { useState, useEffect } from "react";
// // import { Link } from "react-router-dom";
// // import axios from "axios";
// // import { API_BASE_URL } from "../../../api-config"; // Adjust path if needed

// // const getStatusColor = (status) => {
// //   if (status === "booked") return "bg-green-600";       // Treated as Completed
// //   if (status === "cancelled") return "bg-red-500";
// //   switch (status) {
// //     case "Pending": return "bg-blue-500";
// //     case "Paid": return "bg-emerald-500";
// //     // case "Completed": return "bg-green-600";
// //     default: return "bg-gray-400";
// //   }
// // };


// // const BookingHistory = () => {
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [statusFilter, setStatusFilter] = useState("All Status");
// //   const [pastAppointments, setPastAppointments] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [showCancel, setShowCancel] = useState(false); // Set to true if you want to show Action column

// //   const doctorId = localStorage.getItem("doctorId");

// //   useEffect(() => {
// //     const fetchAppointments = async () => {
// //       setLoading(true);
// //       try {
// //         const response = await axios.get(
// //           `${API_BASE_URL}/api/appointments/doctor/${doctorId}`
// //         );
// //         setPastAppointments(response.data.past || []);
// //       } catch (error) {
// //         console.error("Error fetching appointments:", error);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchAppointments();
// //   }, [doctorId]);

// //   // Filter past appointments
// //   const filteredBookings = pastAppointments.filter((b) => {
// //     const user = b.userId || {};

// //     const matchesSearch =
// //       user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       user.phone?.includes(searchTerm) ||
// //       b.date?.includes(searchTerm) ||
// //       b.time?.includes(searchTerm) ||
// //       b.type?.toLowerCase().includes(searchTerm.toLowerCase());

// //     const matchesStatus =
// //   statusFilter === "All Status" ||
// //   (statusFilter === "Completed" && b.status === "booked") ||
// //   b.status === statusFilter;


// //     return matchesSearch && matchesStatus;
// //   });

// //   return (
// //     <div className="ml-0 md:pl-[80px] lg:pl-[327px] mt-[75px] md:mt-[85px] lg:mt-[80px] font-urbanist px-4 sm:px-6">
// //       <h2 className="text-xl sm:text-2xl font-semibold mb-6">Booking History</h2>

// //       {/* Filters */}
// //       <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-6">
// //         <input
// //           type="text"
// //           placeholder="Search Patients"
// //           value={searchTerm}
// //           onChange={(e) => setSearchTerm(e.target.value)}
// //           className="border border-gray-300 rounded-lg px-3 sm:px-4 py-2 w-full sm:w-56 focus:outline-none"
// //         />
// //         <input
// //           type="text"
// //           placeholder="Select date range"
// //           className="border border-gray-300 rounded-lg px-3 sm:px-4 py-2 w-full sm:w-56 focus:outline-none"
// //         />
// //         <select
// //           value={statusFilter}
// //           onChange={(e) => setStatusFilter(e.target.value)}
// //           className="border border-gray-300 rounded-lg px-3 sm:px-4 py-2 w-full sm:w-40 focus:outline-none"
// //         >
// //           <option>All Status</option>
// //           <option>cancelled</option>
// //           <option>Completed</option>
// //         </select>
// //         <button className="bg-teal-600 text-white px-4 sm:px-5 py-2 rounded-lg border-none w-full sm:w-auto">
// //           Export to CSV
// //         </button>
// //       </div>

// //       {/* Table */}
// //       <h3 className="text-lg font-medium mb-3">Past Bookings</h3>
// //       <div className="overflow-x-auto">
// //         <table className="w-full border-collapse text-sm sm:text-base">
// //           <thead>
// //             <tr className="bg-gray-100 text-gray-700 text-left">
// //               <th className="px-3 sm:px-4 py-2">Patient Name</th>
// //               <th className="px-3 sm:px-4 py-2">Phone</th>
// //               <th className="px-3 sm:px-4 py-2">Date</th>
// //               <th className="px-3 sm:px-4 py-2">Time</th>
// //               <th className="px-3 sm:px-4 py-2">Type</th>
// //               <th className="px-3 sm:px-4 py-2">Amount</th>
// //               <th className="px-3 sm:px-4 py-2">Status</th>
// //               {showCancel && <th className="px-3 sm:px-4 py-2">Action</th>}
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {loading ? (
// //               <tr>
// //                 <td colSpan={showCancel ? "8" : "7"} className="text-center text-gray-500 py-4">
// //                   Loading...
// //                 </td>
// //               </tr>
// //             ) : filteredBookings.length > 0 ? (
// //               filteredBookings.map((b, idx) => {
// //                 const user = b.userId || {};
// //                 return (
// //                   <tr key={b._id || idx} className="border-b text-gray-700 border-none">
// //                     <td className="px-3 sm:px-4 py-2">{user.full_name || "N/A"}</td>
// //                     <td className="px-3 sm:px-4 py-2">{user.phone_number || "—"}</td>
// //                     <td className="px-3 sm:px-4 py-2">{b.date || "—"}</td>
// //                     <td className="px-3 sm:px-4 py-2">{b.time || "—"}</td>
// //                     <td className="px-3 sm:px-4 py-2 capitalize">{b.type || "—"}</td>
// //                     <td className="px-3 sm:px-4 py-2">{b.amount || "—"}</td>
// //                     <td className="px-3 sm:px-4 py-2">
// //   <span
// //     className={`${getStatusColor(b.status)} text-white px-3 py-1 rounded-full text-xs sm:text-sm w-24 inline-block text-center`}
// //   >
// //     {b.status === "booked" ? "Completed" : b.status}
// //   </span>
// // </td>

// //                     {showCancel && (
// //                       <td className="px-3 sm:px-4 py-2">
// //                         <button className="text-red-600 hover:underline">Cancel</button>
// //                       </td>
// //                     )}
// //                   </tr>
// //                 );
// //               })
// //             ) : (
// //               <tr>
// //                 <td colSpan={showCancel ? "8" : "7"} className="text-center text-gray-500 py-4">
// //                   No bookings found
// //                 </td>
// //               </tr>
// //             )}
// //           </tbody>
// //         </table>
// //       </div>
// //     </div>
// //   );
// // };

// // export default BookingHistory;


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { API_BASE_URL } from "../../../api-config";

// const PAGE_SIZE = 10;

// const getStatusColor = (status) => {
//   if (status === "booked") return "bg-green-600";       // Treated as Completed
//   if (status === "Cancelled") return "bg-red-500";
//   switch (status) {
//     case "Pending": return "bg-blue-500";
//     case "Paid": return "bg-emerald-500";
//     default: return "bg-gray-400";
//   }
// };

// const BookingHistory = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("All Status");
//   const [pastAppointments, setPastAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showCancel, setShowCancel] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1); // Pagination state

//   const doctorId = localStorage.getItem("doctorId");

//   useEffect(() => {
//     const fetchAppointments = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get(
//           `${API_BASE_URL}/api/appointments/doctor/${doctorId}`
//         );
//         setPastAppointments(response.data.past || []);
//       } catch (error) {
//         console.error("Error fetching appointments:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAppointments();
//   }, [doctorId]);

//   // Filter past appointments
//   const filteredBookings = pastAppointments.filter((b) => {
//     const user = b.userId || {};
//     const matchesSearch =
//       user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.phone?.includes(searchTerm) ||
//       b.date?.includes(searchTerm) ||
//       b.time?.includes(searchTerm) ||
//       b.type?.toLowerCase().includes(searchTerm.toLowerCase());

//     const matchesStatus =
//       statusFilter === "All Status" ||
//       (statusFilter === "Completed" && b.status === "booked") ||  (statusFilter === "Cancelled" && b.status === "cancelled") ||
//       b.status === statusFilter;

//     return matchesSearch && matchesStatus;
//   });

//   // Pagination logic
//   const totalPages = Math.ceil(filteredBookings.length / PAGE_SIZE);
//   const paginatedBookings = filteredBookings.slice(
//     (currentPage - 1) * PAGE_SIZE,
//     currentPage * PAGE_SIZE
//   );

//   // Reset to page 1 if search or filter changes
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchTerm, statusFilter]);

//   return (
//     <div className="ml-0 md:pl-[80px] lg:pl-[327px] mt-[75px] md:mt-[85px] lg:mt-[80px] font-urbanist px-4 sm:px-6">
//       <h2 className="text-xl sm:text-2xl font-semibold mb-6">Booking History</h2>

//       {/* Filters */}
//       <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-6">
//         <input
//           type="text"
//           placeholder="Search Patients"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="border border-gray-300 rounded-lg px-3 sm:px-4 py-2 w-full sm:w-56 focus:outline-none"
//         />
//         <input
//           type="text"
//           placeholder="Select date range"
//           className="border border-gray-300 rounded-lg px-3 sm:px-4 py-2 w-full sm:w-56 focus:outline-none"
//         />
//         <select
//           value={statusFilter}
//           onChange={(e) => setStatusFilter(e.target.value)}
//           className="border border-gray-300 rounded-lg px-3 sm:px-4 py-2 w-full sm:w-40 focus:outline-none"
//         >
//           <option>All Status</option>
//           <option>Cancelled</option>
//           <option>Completed</option>
//         </select>
//       </div>

//       {/* Table */}
//       <h3 className="text-lg font-medium mb-3">Past Bookings</h3>
//       <div className="overflow-x-auto">
//         <table className="w-full border-collapse text-sm sm:text-base">
//           <thead>
//             <tr className="bg-gray-100 text-gray-700 text-left">
//               <th className="px-3 sm:px-4 py-2">Patient Name</th>
//               <th className="px-3 sm:px-4 py-2">Phone</th>
//               <th className="px-3 sm:px-4 py-2">Date</th>
//               <th className="px-3 sm:px-4 py-2">Time</th>
//               <th className="px-3 sm:px-4 py-2">Type</th>
//               <th className="px-3 sm:px-4 py-2">Amount</th>
//               <th className="px-3 sm:px-4 py-2">Status</th>
//               {showCancel && <th className="px-3 sm:px-4 py-2">Action</th>}
//             </tr>
//           </thead>
//           <tbody>
//             {loading ? (
//               <tr>
//                 <td colSpan={showCancel ? "8" : "7"} className="text-center text-gray-500 py-4">
//                   Loading...
//                 </td>
//               </tr>
//             ) : paginatedBookings.length > 0 ? (
//               paginatedBookings.map((b, idx) => {
//                 const user = b.userId || {};
//                 return (
//                   <tr key={b._id || idx} className="border-b text-gray-700 border-none">
//                     <td className="px-3 sm:px-4 py-2">{user.full_name || "N/A"}</td>
//                     <td className="px-3 sm:px-4 py-2">{user.phone_number || "—"}</td>
//                     <td className="px-3 sm:px-4 py-2">{b.date || "—"}</td>
//                     <td className="px-3 sm:px-4 py-2">{b.time || "—"}</td>
//                     <td className="px-3 sm:px-4 py-2 capitalize">{b.type || "—"}</td>
//                     <td className="px-3 sm:px-4 py-2">{b.amount || "—"}</td>
//                     <td className="px-3 sm:px-4 py-2">
//                       <span
//                         className={`${getStatusColor(b.status)} text-white px-3 py-1 rounded-full text-xs sm:text-sm w-24 inline-block text-center`}
//                       >
//                         {b.status === "booked" ? "Completed" : b.status}
//                       </span>
//                     </td>
//                     {showCancel && (
//                       <td className="px-3 sm:px-4 py-2">
//                         <button className="text-red-600 hover:underline">Cancel</button>
//                       </td>
//                     )}
//                   </tr>
//                 );
//               })
//             ) : (
//               <tr>
//                 <td colSpan={showCancel ? "8" : "7"} className="text-center text-gray-500 py-4">
//                   No bookings found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination Controls */}
//       {!loading && totalPages > 1 && (
//         <div className="flex justify-center items-center gap-4 mt-6">
//           <button
//             onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//             disabled={currentPage === 1}
//             className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
//           >
//             Previous
//           </button>
//           <span className="text-sm">
//             Page {currentPage} of {totalPages}
//           </span>
//           <button
//             onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//             disabled={currentPage === totalPages}
//             className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
//           >
//             Next
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BookingHistory;


import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../api-config";

const PAGE_SIZE = 10;

const getStatusColor = (status) => {
  if (status === "booked") return "bg-green-600"; // Treated as Completed
  if (status === "Cancelled") return "bg-red-500";
  switch (status) {
    case "Pending":
      return "bg-blue-500";
    case "Paid":
      return "bg-emerald-500";
    default:
      return "bg-gray-400";
  }
};

const BookingHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [dateFilter, setDateFilter] = useState("");
  const [pastAppointments, setPastAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCancel, setShowCancel] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Pagination state

  const doctorId = localStorage.getItem("doctorId");

  // Get today's date as YYYY-MM-DD to restrict date picker max value
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/appointments/doctor/${doctorId}`
        );
        setPastAppointments(response.data.past || []);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [doctorId]);

  // Filter past appointments based on search, status, and date filters
  const filteredBookings = pastAppointments.filter((b) => {
    const user = b.userId || {};

    const matchesSearch =
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone_number?.includes(searchTerm) ||
      b.date?.includes(searchTerm) ||
      b.time?.includes(searchTerm) ||
      b.type?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All Status" ||
      (statusFilter === "Completed" && b.status === "booked") ||
      (statusFilter === "Cancelled" && b.status === "cancelled") ||
      b.status === statusFilter;

    // If dateFilter is set, check if appointment date matches
    const matchesDate = dateFilter ? b.date === dateFilter : true;

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredBookings.length / PAGE_SIZE);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Reset page to 1 if search, status, or date filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, dateFilter]);


  const clearFilters=()=>{
    setSearchTerm("");
    setStatusFilter("All Status");
    setDateFilter("");
  }
  return (
    <div className="ml-0 md:pl-[80px] lg:pl-[327px] mt-[75px] md:mt-[85px] lg:mt-[80px] font-urbanist px-4 sm:px-6">
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
          type="date"
          value={dateFilter}
          max={today} // disable future dates
          onChange={(e) => setDateFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 sm:px-4 py-2 w-full sm:w-56 focus:outline-none"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 sm:px-4 py-2 w-full sm:w-40 focus:outline-none"
        >
          <option>All Status</option>
          <option>Cancelled</option>
          <option>Completed</option>
        </select>
          <button
          onClick={clearFilters}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
        >
          Remove Filters
        </button>
      </div>

      {/* Table */}
      <h3 className="text-lg font-medium mb-3">Past Bookings</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm sm:text-base">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-left">
              <th className="px-3 sm:px-4 py-2">Patient Name</th>
              <th className="px-3 sm:px-4 py-2">Phone</th>
              <th className="px-3 sm:px-4 py-2">Date</th>
              <th className="px-3 sm:px-4 py-2">Time</th>
              <th className="px-3 sm:px-4 py-2">Type</th>
              <th className="px-3 sm:px-4 py-2">Amount</th>
              <th className="px-3 sm:px-4 py-2">Status</th>
              {showCancel && <th className="px-3 sm:px-4 py-2">Action</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={showCancel ? "8" : "7"}
                  className="text-center text-gray-500 py-4"
                >
                  Loading...
                </td>
              </tr>
            ) : paginatedBookings.length > 0 ? (
              paginatedBookings.map((b, idx) => {
                const user = b.userId || {};
                return (
                  <tr
                    key={b._id || idx}
                    className="border-b text-gray-700 border-none"
                  >
                    <td className="px-3 sm:px-4 py-2">{user.full_name || "N/A"}</td>
                    <td className="px-3 sm:px-4 py-2">{user.phone_number || "—"}</td>
                    <td className="px-3 sm:px-4 py-2">{b.date || "—"}</td>
                    <td className="px-3 sm:px-4 py-2">{b.time || "—"}</td>
                    <td className="px-3 sm:px-4 py-2 capitalize">{b.type || "—"}</td>
                    <td className="px-3 sm:px-4 py-2">{b.amount || "—"}</td>
                    <td className="px-3 sm:px-4 py-2">
                      <span
                        className={`${getStatusColor(
                          b.status
                        )} text-white px-3 py-1 rounded-full text-xs sm:text-sm w-24 inline-block text-center`}
                      >
                        {b.status === "booked" ? "Completed" : b.status}
                      </span>
                    </td>
                    {showCancel && (
                      <td className="px-3 sm:px-4 py-2">
                        <button className="text-red-600 hover:underline">
                          Cancel
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={showCancel ? "8" : "7"}
                  className="text-center text-gray-500 py-4"
                >
                  No bookings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
          >
            Previous
          </button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default BookingHistory;
