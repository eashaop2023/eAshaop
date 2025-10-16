// // // import React, { useState, useEffect } from "react";
// // // import axios from "axios";
// // // import { API_BASE_URL } from "../../../api-config";

// // // const PAGE_SIZE = 10; // 10 records per page

// // // const Appointments = () => {
// // //   const [upcomingAppointments, setUpcomingAppointments] = useState([]);
// // //   const [pastAppointments, setPastAppointments] = useState([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [searchTerm, setSearchTerm] = useState("");
// // //   const [filterDate, setFilterDate] = useState("");
// // //   const [cancellingIds, setCancellingIds] = useState([]);
// // //   const [upcomingPage, setUpcomingPage] = useState(1);
// // //   const [pastPage, setPastPage] = useState(1);

// // //   const doctorId = localStorage.getItem("doctorId");

// // //   useEffect(() => {
// // //     const fetchAppointments = async () => {
// // //       try {
// // //         const response = await axios.get(
// // //           `${API_BASE_URL}/api/appointments/doctor/${doctorId}`
// // //         );
// // //         console.log("Fetched appointments:", response.data);
// // //         setUpcomingAppointments(response.data.upcoming || []);
// // //         setPastAppointments(response.data.past || []);
// // //       } catch (error) {
// // //         console.error("Error fetching appointments:", error);
// // //       } finally {
// // //         setLoading(false);
// // //       }
// // //     };

// // //     fetchAppointments();
// // //   }, [doctorId]);

// // //   const handleCancel = async (appointmentId) => {
// // //     try {
// // //       setCancellingIds((prev) => [...prev, appointmentId]);
// // //       console.log("Cancelling appointment ID:", appointmentId);
// // //       const res = await axios.patch(
// // //         `${API_BASE_URL}/api/appointments/${appointmentId}/cancel`
// // //       );
// // //       console.log("Cancel response:", res.data);

// // //       setUpcomingAppointments((prev) =>
// // //         prev.map((appt) =>
// // //           appt._id === appointmentId ? { ...appt, status: "cancelled" } : appt
// // //         )
// // //       );
// // //     } catch (error) {
// // //       console.error("Error canceling appointment:", error);
// // //       alert("Failed to cancel appointment. Please try again.");
// // //     } finally {
// // //       setCancellingIds((prev) => prev.filter((id) => id !== appointmentId));
// // //     }
// // //   };

// // //   const filterData = (appointments) =>
// // //     appointments.filter((appointment) => {
// // //       const user = appointment.userId || {};

// // //       const matchesSearch =
// // //         user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // //         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // //         user.phone_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // //         appointment._id?.toLowerCase().includes(searchTerm.toLowerCase());

// // //       const matchesDate = filterDate ? appointment.date === filterDate : true;

// // //       return matchesSearch && matchesDate;
// // //     });

// // //   // Paginate data slice
// // //   const paginateData = (data, page) => {
// // //     const startIndex = (page - 1) * PAGE_SIZE;
// // //     return data.slice(startIndex, startIndex + PAGE_SIZE);
// // //   };

// // //   const renderTable = (appointments, showCancel = false) => (
// // //     <table className="appointments-table">
// // //       <thead>
// // //         <tr>
// // //           <th>Full Name</th>
// // //           {/* <th>Email</th> */}
// // //           <th>Phone</th>
// // //           <th>Date</th>
// // //           <th>Time</th>
// // //           <th>Type</th>
// // //           <th>Amount</th>
// // //           {showCancel && <th>Action</th>}
// // //         </tr>
// // //       </thead>
// // //       <tbody>
// // //         {appointments.length > 0 ? (
// // //           appointments.map((appt, index) => {
// // //             const user = appt.userId || {};
// // //             const isCancelling = cancellingIds.includes(appt._id);
// // //             return (
// // //               <tr key={appt._id || index}>
// // //                 <td>{user.full_name || "N/A"}</td>
// // //                 {/* <td>{user.email || "N/A"}</td> */}
// // //                 <td>{user.phone_number || "N/A"}</td>
// // //                 <td>{appt.date || "—"}</td>
// // //                 <td>{appt.time || "—"}</td>
// // //                 <td className="capitalize">{appt.type || "—"}</td>
// // //                 <td>₹{appt.amount || 0}</td>
// // //                 {showCancel && (
// // //                   <td>
// // //                     <button
// // //                       disabled={isCancelling || appt.status === "cancelled"}
// // //                       onClick={() => handleCancel(appt._id)}
// // //                       style={{
// // //                         padding: "6px 12px",
// // //                         backgroundColor:
// // //                           appt.status === "cancelled" ? "#6c757d" : "#dc3545",
// // //                         color: "white",
// // //                         border: "none",
// // //                         textAlign: "center",
// // //                         width: "90px",
// // //                         borderRadius: "4px",
// // //                         cursor:
// // //                           isCancelling || appt.status === "cancelled"
// // //                             ? "not-allowed"
// // //                             : "pointer",
// // //                       }}
// // //                     >
// // //                       {appt.status === "cancelled"
// // //                         ? "Cancelled"
// // //                         : isCancelling
// // //                         ? "Cancelling..."
// // //                         : "Cancel"}
// // //                     </button>
// // //                   </td>
// // //                 )}
// // //               </tr>
// // //             );
// // //           })
// // //         ) : (
// // //           <tr>
// // //             <td colSpan={showCancel ? 7 : 6} className="no-data">
// // //               No appointments found.
// // //             </td>
// // //           </tr>
// // //         )}
// // //       </tbody>
// // //     </table>
// // //   );

// // //   // Filtered datasets
// // //   const filteredUpcoming = filterData(upcomingAppointments);
// // //   const filteredPast = filterData(pastAppointments);

// // //   // Paginated slices
// // //   const paginatedUpcoming = paginateData(filteredUpcoming, upcomingPage);
// // //   const paginatedPast = paginateData(filteredPast, pastPage);

// // //   // Pagination controls
// // //   const renderPagination = (currentPage, setPage, totalItems) => {
// // //     const totalPages = Math.ceil(totalItems / PAGE_SIZE);
// // //     return (
// // //       <div style={{ marginTop: "10px", display: "flex", gap: 10, justifyContent: "center" }}>
// // //         <button
// // //           onClick={() => setPage(currentPage - 1)}
// // //           disabled={currentPage === 1}
// // //           style={{
// // //             padding: "6px 12px",
// // //             backgroundColor: currentPage === 1 ? "#ccc" : "#007bff",
// // //             color: "white",
// // //             border: "none",
// // //             borderRadius: "4px",
// // //             cursor: currentPage === 1 ? "not-allowed" : "pointer",
// // //           }}
// // //         >
// // //           Previous
// // //         </button>
// // //         <span style={{ alignSelf: "center" }}>
// // //           Page {currentPage} of {totalPages || 1}
// // //         </span>
// // //         <button
// // //           onClick={() => setPage(currentPage + 1)}
// // //           disabled={currentPage === totalPages || totalPages === 0}
// // //           style={{
// // //             padding: "6px 12px",
// // //             backgroundColor:
// // //               currentPage === totalPages || totalPages === 0 ? "#ccc" : "#007bff",
// // //             color: "white",
// // //             border: "none",
// // //             borderRadius: "4px",
// // //             cursor:
// // //               currentPage === totalPages || totalPages === 0 ? "not-allowed" : "pointer",
// // //           }}
// // //         >
// // //           Next
// // //         </button>
// // //       </div>
// // //     );
// // //   };

// // //   // Reset pagination if filters change
// // //   useEffect(() => {
// // //     setUpcomingPage(1);
// // //     setPastPage(1);
// // //   }, [searchTerm, filterDate]);

// // //   return (
// // //     <>
// // //       <style>{`
// // //         .appointments-container {
// // //           max-width: 1100px;
// // //           margin: 50px auto;
// // //           font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
// // //           padding: 0 20px;
// // //           color: #333;
// // //         }
// // //         .title {
// // //           font-size: 2rem;
// // //           font-weight: 700;
// // //           margin-bottom: 25px;
// // //           color: #1a1a1a;
// // //         }
// // //         .search-container {
// // //           margin-bottom: 30px;
// // //           max-width: 400px;
// // //           display: flex;
// // //           gap: 10px;
// // //           align-items: center;
// // //         }
// // //         .search-input {
// // //           padding: 10px 14px;
// // //           font-size: 1rem;
// // //           border: 1.5px solid #ccc;
// // //           border-radius: 6px;
// // //           transition: border-color 0.3s ease;
// // //         }
// // //         .search-input:focus {
// // //           outline: none;
// // //           border-color: #007bff;
// // //           box-shadow: 0 0 6px rgba(0, 123, 255, 0.4);
// // //         }
// // //         .search-input[type="text"] {
// // //           flex: 1;
// // //           min-width: 0;
// // //         }
// // //         .search-input[type="date"] {
// // //           max-width: 180px;
// // //         }
// // //         .appointment-section {
// // //           margin-bottom: 50px;
// // //         }
// // //         .section-title {
// // //           font-size: 1.3rem;
// // //           font-weight: 600;
// // //           margin-bottom: 15px;
// // //           color: #222;
// // //           border-bottom: 2px solid #007bff;
// // //           padding-bottom: 6px;
// // //           max-width: fit-content;
// // //         }
// // //         .table-wrapper {
// // //           overflow-x: auto;
// // //           box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
// // //           border-radius: 8px;
// // //         }
// // //         .appointments-table {
// // //           width: 100%;
// // //           border-collapse: collapse;
// // //           font-size: 1rem;
// // //           min-width: 400px;
// // //           background-color: #fff;
// // //         }
// // //         .appointments-table thead tr {
// // //           background-color: #f9fafb;
// // //           color: #444;
// // //           text-align: left;
// // //           font-weight: 600;
// // //           border-bottom: 2px solid #e5e7eb;
// // //         }
// // //         .appointments-table th,
// // //         .appointments-table td {
// // //           padding: 12px 15px;
// // //           border-bottom: 1px solid #e5e7eb;
// // //         }
// // //         .appointments-table tbody tr:hover {
// // //           background-color: #e2e8f0;
// // //           cursor: pointer;
// // //         }
// // //         .appointments-table tbody tr:nth-child(odd) {
// // //           background-color: #ffffff;
// // //         }
// // //         .appointments-table tbody tr:nth-child(even) {
// // //           background-color: #f9fafb;
// // //         }
// // //         .no-data {
// // //           text-align: center;
// // //           padding: 20px 0;
// // //           color: #777;
// // //           font-style: italic;
// // //         }
// // //         @media (max-width: 600px) {
// // //           .appointments-table {
// // //             font-size: 0.85rem;
// // //             min-width: 600px;
// // //           }
// // //           .appointments-table thead th {
// // //             white-space: nowrap;
// // //           }
// // //           .table-wrapper {
// // //             padding-bottom: 10px;
// // //           }
// // //         }
// // //       `}</style>

// // //       <div className="appointments-container">
// // //         <h3 className="text-gray">Appointments</h3>
// // //         <div className="search-container">
// // //           <input
// // //             type="text"
// // //             placeholder="Search by name, email or phone"
// // //             value={searchTerm}
// // //             onChange={(e) => setSearchTerm(e.target.value)}
// // //             className="search-input"
// // //           />
// // //           <input
// // //             type="date"
// // //             value={filterDate}
// // //             onChange={(e) => setFilterDate(e.target.value)}
// // //             className="search-input"
// // //           />
// // //           {filterDate && (
// // //             <button
// // //               onClick={() => setFilterDate("")}
// // //               style={{
// // //                 padding: "6px 12px",
// // //                 backgroundColor: "#dc3545",
// // //                 color: "white",
// // //                 border: "none",
// // //                 borderRadius: "4px",
// // //                 cursor: "pointer",
// // //               }}
// // //               title="Clear Date Filter"
// // //             >
// // //               Clear
// // //             </button>
// // //           )}
// // //         </div>

// // //         <section className="appointment-section">
// // //           <h3 className="section-title">Ongoing</h3>
// // //           <div className="table-wrapper">
// // //             {loading ? (
// // //               <p className="loading-text">Loading...</p>
// // //             ) : (
// // //               renderTable([]) // no ongoing data provided in your code
// // //             )}
// // //           </div>
// // //         </section>

// // //         <section className="appointment-section">
// // //           <h3 className="section-title">Upcoming</h3>
// // //           <div className="table-wrapper">
// // //             {loading ? (
// // //               <p className="loading-text">Loading...</p>
// // //             ) : (
// // //               <>
// // //                 {renderTable(paginatedUpcoming, true)}
// // //                 {renderPagination(upcomingPage, setUpcomingPage, filteredUpcoming.length)}
// // //               </>
// // //             )}
// // //           </div>
// // //         </section>
// // //       </div>
// // //     </>
// // //   );
// // // };

// // // export default Appointments;


// // import React, { useState, useEffect } from "react";
// // import axios from "axios";
// // import { API_BASE_URL } from "../../../api-config";

// // const PAGE_SIZE = 10;

// // const Appointments = () => {
// //   const [upcomingAppointments, setUpcomingAppointments] = useState([]);
// //   const [pastAppointments, setPastAppointments] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [filterDate, setFilterDate] = useState("");
// //   const [cancellingIds, setCancellingIds] = useState([]);
// //   const [upcomingPage, setUpcomingPage] = useState(1);
// //   const [pastPage, setPastPage] = useState(1);

// //   const doctorId = localStorage.getItem("doctorId");

// //   useEffect(() => {
// //     const fetchAppointments = async () => {
// //       try {
// //         const response = await axios.get(
// //           `${API_BASE_URL}/api/appointments/doctor/${doctorId}`
// //         );
// //         setUpcomingAppointments(response.data.upcoming || []);
// //         setPastAppointments(response.data.past || []);
// //       } catch (error) {
// //         console.error("Error fetching appointments:", error);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchAppointments();
// //   }, [doctorId]);

// //   const handleCancel = async (appointmentId) => {
// //     try {
// //       setCancellingIds((prev) => [...prev, appointmentId]);
// //       const res = await axios.patch(
// //         `${API_BASE_URL}/api/appointments/${appointmentId}/cancel`
// //       );

// //       setUpcomingAppointments((prev) =>
// //         prev.map((appt) =>
// //           appt._id === appointmentId ? { ...appt, status: "cancelled" } : appt
// //         )
// //       );
// //     } catch (error) {
// //       console.error("Error canceling appointment:", error);
// //       alert("Failed to cancel appointment. Please try again.");
// //     } finally {
// //       setCancellingIds((prev) => prev.filter((id) => id !== appointmentId));
// //     }
// //   };

// //   const filterData = (appointments) =>
// //     appointments.filter((appointment) => {
// //       const user = appointment.userId || {};
// //       const matchesSearch =
// //         user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //         user.phone_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //         appointment._id?.toLowerCase().includes(searchTerm.toLowerCase());

// //       const matchesDate = filterDate ? appointment.date === filterDate : true;

// //       return matchesSearch && matchesDate;
// //     });

// //   const paginateData = (data, page) => {
// //     const startIndex = (page - 1) * PAGE_SIZE;
// //     return data.slice(startIndex, startIndex + PAGE_SIZE);
// //   };

// //   const renderTable = (appointments, showCancel = false) => (
// //     <table className="appointments-table">
// //       <thead>
// //         <tr>
// //           <th>Full Name</th>
// //           <th>Phone</th>
// //           <th>Date</th>
// //           <th>Time</th>
// //           <th>Type</th>
// //           <th>Amount</th>
// //           {showCancel && <th>Action</th>}
// //         </tr>
// //       </thead>
// //       <tbody>
// //         {appointments.length > 0 ? (
// //           appointments.map((appt, index) => {
// //             const user = appt.userId || {};
// //             const isCancelling = cancellingIds.includes(appt._id);
// //             return (
// //               <tr key={appt._id || index}>
// //                 <td>{user.full_name || "N/A"}</td>
// //                 <td>{user.phone_number || "N/A"}</td>
// //                 <td>{appt.date || "—"}</td>
// //                 <td>{appt.time || "—"}</td>
// //                 <td className="capitalize">{appt.type || "—"}</td>
// //                 <td>₹{appt.amount || 0}</td>
// //                 {showCancel && (
// //                   <td>
// //                     <button
// //                       disabled={isCancelling || appt.status === "cancelled"}
// //                       onClick={() => handleCancel(appt._id)}
// //                       style={{
// //                         padding: "6px 12px",
// //                         backgroundColor:
// //                           appt.status === "cancelled" ? "#6c757d" : "#dc3545",
// //                         color: "white",
// //                         border: "none",
// //                         textAlign: "center",
// //                         width: "90px",
// //                         borderRadius: "4px",
// //                         cursor:
// //                           isCancelling || appt.status === "cancelled"
// //                             ? "not-allowed"
// //                             : "pointer",
// //                       }}
// //                     >
// //                       {appt.status === "cancelled"
// //                         ? "Cancelled"
// //                         : isCancelling
// //                         ? "Cancelling..."
// //                         : "Cancel"}
// //                     </button>
// //                   </td>
// //                 )}
// //               </tr>
// //             );
// //           })
// //         ) : (
// //           <tr>
// //             <td colSpan={showCancel ? 7 : 6} className="no-data">
// //               No appointments found.
// //             </td>
// //           </tr>
// //         )}
// //       </tbody>
// //     </table>
// //   );

// //   const filteredUpcoming = filterData(upcomingAppointments);
// //   const filteredPast = filterData(pastAppointments);

// //   const paginatedUpcoming = paginateData(filteredUpcoming, upcomingPage);
// //   const paginatedPast = paginateData(filteredPast, pastPage);

// //   const renderPagination = (currentPage, setPage, totalItems) => {
// //     const totalPages = Math.ceil(totalItems / PAGE_SIZE);
// //     return (
// //       <div className="pagination-controls">
// //         <button
// //           onClick={() => setPage(currentPage - 1)}
// //           disabled={currentPage === 1}
// //           style={{
// //             padding: "6px 12px",
// //             backgroundColor: currentPage === 1 ? "#ccc" : "#007bff",
// //             color: "white",
// //             border: "none",
// //             borderRadius: "4px",
// //             cursor: currentPage === 1 ? "not-allowed" : "pointer",
// //           }}
// //         >
// //           Previous
// //         </button>
// //         <span style={{ alignSelf: "center" }}>
// //           Page {currentPage} of {totalPages || 1}
// //         </span>
// //         <button
// //           onClick={() => setPage(currentPage + 1)}
// //           disabled={currentPage === totalPages || totalPages === 0}
// //           style={{
// //             padding: "6px 12px",
// //             backgroundColor:
// //               currentPage === totalPages || totalPages === 0 ? "#ccc" : "#007bff",
// //             color: "white",
// //             border: "none",
// //             borderRadius: "4px",
// //             cursor:
// //               currentPage === totalPages || totalPages === 0
// //                 ? "not-allowed"
// //                 : "pointer",
// //           }}
// //         >
// //           Next
// //         </button>
// //       </div>
// //     );
// //   };

// //   useEffect(() => {
// //     setUpcomingPage(1);
// //     setPastPage(1);
// //   }, [searchTerm, filterDate]);

// //   return (
// //     <>
// //       <style>{`
// //         .appointments-container {
// //           max-width: 1100px;
// //           margin: 50px auto;
// //           font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
// //           padding: 0 20px;
// //           color: #333;
// //         }
// //         .title {
// //           font-size: 2rem;
// //           font-weight: 700;
// //           margin-bottom: 25px;
// //           color: #1a1a1a;
// //         }
// //         .search-container {
// //           margin-bottom: 30px;
// //           max-width: 400px;
// //           display: flex;
// //           gap: 10px;
// //           align-items: center;
// //         }
// //         .search-input {
// //           padding: 10px 14px;
// //           font-size: 1rem;
// //           border: 1.5px solid #ccc;
// //           border-radius: 6px;
// //           transition: border-color 0.3s ease;
// //         }
// //         .search-input:focus {
// //           outline: none;
// //           border-color: #007bff;
// //           box-shadow: 0 0 6px rgba(0, 123, 255, 0.4);
// //         }
// //         .search-input[type="text"] {
// //           flex: 1;
// //           min-width: 0;
// //         }
// //         .search-input[type="date"] {
// //           max-width: 180px;
// //         }
// //         .appointment-section {
// //           margin-bottom: 50px;
// //         }
// //         .section-title {
// //           font-size: 1.3rem;
// //           font-weight: 600;
// //           margin-bottom: 15px;
// //           color: #222;
// //           border-bottom: 2px solid #007bff;
// //           padding-bottom: 6px;
// //           max-width: fit-content;
// //         }
// //         .table-wrapper {
// //           overflow-x: auto;
// //           box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
// //           border-radius: 8px;
// //         }
// //         .appointments-table {
// //           width: 100%;
// //           border-collapse: collapse;
// //           font-size: 1rem;
// //           min-width: 400px;
// //           background-color: #fff;
// //         }
// //         .appointments-table thead tr {
// //           background-color: #f9fafb;
// //           color: #444;
// //           text-align: left;
// //           font-weight: 600;
// //           border-bottom: 2px solid #e5e7eb;
// //         }
// //         .appointments-table th,
// //         .appointments-table td {
// //           padding: 12px 15px;
// //           border-bottom: 1px solid #e5e7eb;
// //         }
// //         .appointments-table tbody tr:hover {
// //           background-color: #e2e8f0;
// //           cursor: pointer;
// //         }
// //         .appointments-table tbody tr:nth-child(odd) {
// //           background-color: #ffffff;
// //         }
// //         .appointments-table tbody tr:nth-child(even) {
// //           background-color: #f9fafb;
// //         }
// //         .no-data {
// //           text-align: center;
// //           padding: 20px 0;
// //           color: #777;
// //           font-style: italic;
// //         }
// //         .pagination-controls {
// //           margin-top: 10px;
// //           display: flex;
// //           gap: 10px;
// //           justify-content: center;
// //           flex-wrap: wrap;
// //         }
// //         @media (max-width: 600px) {
// //           .appointments-table {
// //             font-size: 0.85rem;
// //             min-width: 600px;
// //           }
// //           .appointments-table thead th {
// //             white-space: nowrap;
// //           }
// //           .table-wrapper {
// //             padding-bottom: 10px;
// //           }
// //           .pagination-controls {
// //             flex-direction: column;
// //             align-items: center;
// //           }
// //           .pagination-controls button {
// //             width: 100%;
// //             max-width: 200px;
// //           }
// //         }
// //       `}</style>

// //       <div className="appointments-container">
// //         <h3 className="text-gray">Appointments</h3>
// //         <div className="search-container">
// //           <input
// //             type="text"
// //             placeholder="Search by name, email or phone"
// //             value={searchTerm}
// //             onChange={(e) => setSearchTerm(e.target.value)}
// //             className="search-input"
// //           />
// //           <input
// //             type="date"
// //             value={filterDate}
// //             onChange={(e) => setFilterDate(e.target.value)}
// //             className="search-input"
// //           />
// //           {filterDate && (
// //             <button
// //               onClick={() => setFilterDate("")}
// //               style={{
// //                 padding: "6px 12px",
// //                 backgroundColor: "#dc3545",
// //                 color: "white",
// //                 border: "none",
// //                 borderRadius: "4px",
// //                 cursor: "pointer",
// //               }}
// //               title="Clear Date Filter"
// //             >
// //               Clear
// //             </button>
// //           )}
// //         </div>

// //         <section className="appointment-section">
// //           <h3 className="section-title">Ongoing</h3>
// //           <div className="table-wrapper">
// //             {loading ? (
// //               <p className="loading-text">Loading...</p>
// //             ) : (
// //               renderTable([]) // No ongoing data
// //             )}
// //           </div>
// //         </section>

// //         <section className="appointment-section">
// //           <h3 className="section-title">Upcoming</h3>
// //           <div className="table-wrapper">
// //             {loading ? (
// //               <p className="loading-text">Loading...</p>
// //             ) : (
// //               <>
// //                 {renderTable(paginatedUpcoming, true)}
// //                 {renderPagination(upcomingPage, setUpcomingPage, filteredUpcoming.length)}
// //               </>
// //             )}
// //           </div>
// //         </section>
// //       </div>
// //     </>
// //   );
// // };

// // export default Appointments;
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { API_BASE_URL } from "../../../api-config";

// const PAGE_SIZE = 10;

// const Appointments = () => {
//   const [upcomingAppointments, setUpcomingAppointments] = useState([]);
//   const [pastAppointments, setPastAppointments] = useState([]); // Kept for potential future use
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterDate, setFilterDate] = useState("");
//   const [cancellingIds, setCancellingIds] = useState([]);
//   const [upcomingPage, setUpcomingPage] = useState(1);
//   const [pastPage, setPastPage] = useState(1);

//   const doctorId = localStorage.getItem("doctorId");

//   useEffect(() => {
//     const fetchAppointments = async () => {
//       try {
//         const response = await axios.get(
//           `${API_BASE_URL}/api/appointments/doctor/${doctorId}`
//         );
//         setUpcomingAppointments(response.data.upcoming || []);
//         setPastAppointments(response.data.past || []);
//       } catch (error) {
//         console.error("Error fetching appointments:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (doctorId) {
//       fetchAppointments();
//     }
//   }, [doctorId]);

//   const handleCancel = async (appointmentId) => {
//     try {
//       setCancellingIds((prev) => [...prev, appointmentId]);
//       await axios.patch(
//         `${API_BASE_URL}/api/appointments/${appointmentId}/cancel`
//       );

//       setUpcomingAppointments((prev) =>
//         prev.map((appt) =>
//           appt._id === appointmentId ? { ...appt, status: "cancelled" } : appt
//         )
//       );
//     } catch (error) {
//       console.error("Error canceling appointment:", error);
//       alert("Failed to cancel appointment. Please try again.");
//     } finally {
//       setCancellingIds((prev) => prev.filter((id) => id !== appointmentId));
//     }
//   };

//   const filterData = (appointments) =>
//     appointments.filter((appointment) => {
//       const user = appointment.userId || {};
//       const matchesSearch =
//         user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         user.phone_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         appointment._id?.toLowerCase().includes(searchTerm.toLowerCase());

//       const matchesDate = filterDate ? appointment.date === filterDate : true;

//       return matchesSearch && matchesDate;
//     });

//   const paginateData = (data, page) => {
//     const startIndex = (page - 1) * PAGE_SIZE;
//     return data.slice(startIndex, startIndex + PAGE_SIZE);
//   };

//   const renderTable = (appointments, showCancel = false) => (
//     <div className="table-wrapper">
//       <table className="appointments-table">
//         <thead>
//           <tr>
//             <th>Full Name</th>
//             <th>Phone</th>
//             <th>Date</th>
//             <th>Time</th>
//             <th>Type</th>
//             <th>Amount</th>
//             {showCancel && <th>Action</th>}
//           </tr>
//         </thead>
//         <tbody>
//           {appointments.length > 0 ? (
//             appointments.map((appt) => {
//               const user = appt.userId || {};
//               const isCancelling = cancellingIds.includes(appt._id);
//               return (
//                 <tr key={appt._id}>
//                   <td>{user.full_name || "N/A"}</td>
//                   <td>{user.phone_number || "N/A"}</td>
//                   <td>{appt.date || "—"}</td>
//                   <td>{appt.time || "—"}</td>
//                   <td className="capitalize">{appt.type || "—"}</td>
//                   <td>₹{appt.amount || 0}</td>
//                   {showCancel && (
//                     <td>
//                       <button
//                         className={`btn ${
//                           appt.status === "cancelled"
//                             ? "btn-secondary"
//                             : "btn-danger"
//                         }`}
//                         disabled={isCancelling || appt.status === "cancelled"}
//                         onClick={() => handleCancel(appt._id)}
//                       >
//                         {appt.status === "cancelled"
//                           ? "Cancelled"
//                           : isCancelling
//                           ? "Cancelling..."
//                           : "Cancel"}
//                       </button>
//                     </td>
//                   )}
//                 </tr>
//               );
//             })
//           ) : (
//             <tr>
//               <td colSpan={showCancel ? 7 : 6} className="no-data">
//                 No appointments found.
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );

//   const renderPagination = (currentPage, setPage, totalItems) => {
//     const totalPages = Math.ceil(totalItems / PAGE_SIZE);
//     if (totalPages <= 1) return null; // Don't show pagination if there's only one page

//     return (
//       <div className="pagination-controls">
//         <button
//           className="btn btn-primary"
//           onClick={() => setPage(currentPage - 1)}
//           disabled={currentPage === 1}
//         >
//           Previous
//         </button>
//         <span>
//           Page {currentPage} of {totalPages}
//         </span>
//         <button
//           className="btn btn-primary"
//           onClick={() => setPage(currentPage + 1)}
//           disabled={currentPage === totalPages}
//         >
//           Next
//         </button>
//       </div>
//     );
//   };

//   useEffect(() => {
//     setUpcomingPage(1);
//     setPastPage(1);
//   }, [searchTerm, filterDate]);

//   const filteredUpcoming = filterData(upcomingAppointments);
//   const paginatedUpcoming = paginateData(filteredUpcoming, upcomingPage);

//   return (
//     <>
//       <style>{`
//         /* --- General Layout & Typography --- */
//         .appointments-container {
//           max-width: 1100px;
//           margin: 40px auto;
//           font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
//           padding: 20px;
//           color: #333;
//         }
//         .section-title {
//           font-size: 1.5rem;
//           font-weight: 600;
//           margin-bottom: 20px;
//           color: #222;
//           border-bottom: 2px solid #007bff;
//           padding-bottom: 8px;
//           display: inline-block;
//         }
//         .appointment-section {
//           margin-bottom: 40px;
//         }

//         /* --- Search and Filter --- */
//         .controls-container {
//           display: flex;
//           gap: 15px;
//           margin-bottom: 30px;
//           align-items: center;
//         }
//         .search-input {
//           padding: 10px 14px;
//           font-size: 1rem;
//           border: 1.5px solid #ccc;
//           border-radius: 6px;
//           transition: border-color 0.3s ease;
//         }
//         .search-input:focus {
//           outline: none;
//           border-color: #007bff;
//           box-shadow: 0 0 6px rgba(0, 123, 255, 0.4);
//         }
//         .search-input[type="text"] {
//           flex-grow: 1; /* Allows it to take available space */
//         }
        
//         /* --- Buttons --- */
//         .btn {
//           padding: 8px 16px;
//           color: white;
//           border: none;
//           border-radius: 4px;
//           cursor: pointer;
//           font-size: 0.9rem;
//           text-align: center;
//           transition: background-color 0.2s;
//         }
//         .btn-primary { background-color: #007bff; }
//         .btn-primary:hover { background-color: #0056b3; }
//         .btn-danger { background-color: #dc3545; }
//         .btn-danger:hover { background-color: #c82333; }
//         .btn-secondary { background-color: #6c757d; }
//         .btn:disabled {
//           background-color: #ccc;
//           cursor: not-allowed;
//           opacity: 0.7;
//         }

//         /* --- Table Styling --- */
//         .table-wrapper {
//           overflow-x: auto;
//           box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
//           border-radius: 8px;
//         }
//         .appointments-table {
//           width: 100%;
//           border-collapse: collapse;
//           font-size: 1rem;
//           min-width: 700px; /* Ensures table doesn't get too squished before scrolling */
//           background-color: #fff;
//         }
//         .appointments-table thead tr {
//           background-color: #f9fafb;
//           text-align: left;
//           font-weight: 600;
//         }
//         .appointments-table th,
//         .appointments-table td {
//           padding: 14px 16px;
//           border-bottom: 1px solid #e5e7eb;
//           white-space: nowrap; /* Prevents text wrapping */
//         }
//         .appointments-table tbody tr:last-child td {
//           border-bottom: none;
//         }
//         .appointments-table tbody tr:hover {
//           background-color: #f0f4f8;
//         }
//         .no-data {
//           text-align: center;
//           padding: 30px 0;
//           color: #777;
//         }
//         .capitalize { text-transform: capitalize; }

//         /* --- Pagination --- */
//         .pagination-controls {
//           margin-top: 20px;
//           display: flex;
//           gap: 15px;
//           justify-content: center;
//           align-items: center;
//         }

//         /* --- Responsive Design --- */
//         @media (max-width: 768px) {
//           .appointments-container {
//             padding: 15px;
//             margin-top: 20px;
//           }
//           .controls-container {
//             flex-direction: column;
//             align-items: stretch; /* Makes inputs full width */
//           }
//           .search-input, .btn {
//             width: 100%;
//           }
//         }
//       `}</style>

//       <div className="appointments-container">
//         <h3>Appointments</h3>

//         <div className="controls-container">
//           <input
//             type="text"
//             placeholder="Search by name, email or phone..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="search-input"
//           />
//           <input
//             type="date"
//             value={filterDate}
//             onChange={(e) => setFilterDate(e.target.value)}
//             className="search-input"
//           />
//           {filterDate && (
//             <button
//               onClick={() => setFilterDate("")}
//               className="btn btn-danger"
//               title="Clear Date Filter"
//             >
//               Clear Date
//             </button>
//           )}
//         </div>

//         <section className="appointment-section">
//           <h3 className="section-title">Ongoing</h3>
//           {loading ? <p>Loading...</p> : renderTable([])}
//         </section>

//         <section className="appointment-section">
//           <h3 className="section-title">Upcoming</h3>
//           {loading ? (
//             <p>Loading...</p>
//           ) : (
//             <>
//               {renderTable(paginatedUpcoming, true)}
//               {renderPagination(
//                 upcomingPage,
//                 setUpcomingPage,
//                 filteredUpcoming.length
//               )}
//             </>
//           )}
//         </section>
//       </div>
//     </>
//   );
// };

// export default Appointments;


import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../api-config";

const PAGE_SIZE = 10;

const Appointments = () => {
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [cancellingIds, setCancellingIds] = useState([]);
  const [upcomingPage, setUpcomingPage] = useState(1);
  const [pastPage, setPastPage] = useState(1);

  const doctorId = localStorage.getItem("doctorId");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/appointments/doctor/${doctorId}`
        );
        setUpcomingAppointments(response.data.upcoming || []);
        setPastAppointments(response.data.past || []);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    if (doctorId) {
      fetchAppointments();
    }
  }, [doctorId]);

  const handleCancel = async (appointmentId) => {
    try {
      setCancellingIds((prev) => [...prev, appointmentId]);
      await axios.patch(
        `${API_BASE_URL}/api/appointments/${appointmentId}/cancel`
      );

      setUpcomingAppointments((prev) =>
        prev.map((appt) =>
          appt._id === appointmentId ? { ...appt, status: "cancelled" } : appt
        )
      );
    } catch (error) {
      console.error("Error canceling appointment:", error);
      alert("Failed to cancel appointment. Please try again.");
    } finally {
      setCancellingIds((prev) => prev.filter((id) => id !== appointmentId));
    }
  };

  const filterData = (appointments) =>
    appointments.filter((appointment) => {
      const user = appointment.userId || {};
      const matchesSearch =
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment._id?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDate = filterDate ? appointment.date === filterDate : true;

      return matchesSearch && matchesDate;
    });

  const paginateData = (data, page) => {
    const startIndex = (page - 1) * PAGE_SIZE;
    return data.slice(startIndex, startIndex + PAGE_SIZE);
  };

  const renderTable = (appointments, showCancel = false) => (
    <table className="appointments-table">
      <thead>
        <tr>
          <th>Full Name</th>
          <th>Phone</th>
          <th>Date</th>
          <th>Time</th>
          <th>Type</th>
          <th>Amount</th>
          {showCancel && <th>Action</th>}
        </tr>
      </thead>
      <tbody>
        {appointments.length > 0 ? (
          appointments.map((appt) => {
            const user = appt.userId || {};
            const isCancelling = cancellingIds.includes(appt._id);
            return (
              <tr key={appt._id}>
                <td>{user.full_name || "N/A"}</td>
                <td>{user.phone_number || "N/A"}</td>
                <td>{appt.date || "—"}</td>
                <td>{appt.time || "—"}</td>
                <td className="capitalize">{appt.type || "—"}</td>
                <td>₹{appt.amount || 0}</td>
                {showCancel && (
                  <td>
                    <button
                      className={`btn ${
                        appt.status === "cancelled"
                          ? "btn-secondary"
                          : "btn-danger"
                      }`}
                      disabled={isCancelling || appt.status === "cancelled"}
                      onClick={() => handleCancel(appt._id)}
                    >
                      {appt.status === "cancelled"
                        ? "Cancelled"
                        : isCancelling
                        ? "Cancelling..."
                        : "Cancel"}
                    </button>
                  </td>
                )}
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan={showCancel ? 7 : 6} className="no-data">
              No appointments found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );

  const renderPagination = (currentPage, setPage, totalItems) => {
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);

  // Detect if screen is mobile width
  const isMobile =
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 768px)").matches;

  // Button and label widths depending on screen size
  const buttonMinWidth = isMobile ? 60 : 80;
  const labelMinWidth = isMobile ? 80 : 100;

  return (
    <div
      style={{
        marginTop: 20,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        maxWidth: "100%",
        flexWrap: "wrap",
        padding: "10px 0",
        textAlign: "center",
      }}
    >
      <button
        className="btn btn-primary"
        onClick={() => setPage(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          flexShrink: 0,
          minWidth: buttonMinWidth,
          padding: isMobile ? "6px 10px" : "8px 16px",
          fontSize: isMobile ? "0.85rem" : "0.9rem",
        }}
      >
        Prev
      </button>

      <span
        style={{
          flexShrink: 0,
          minWidth: labelMinWidth,
          fontSize: isMobile ? "0.85rem" : "1rem",
        }}
      >
        {isMobile
          ? `${currentPage} of ${totalPages || 1}`
          : `Page ${currentPage} of ${totalPages || 1}`}
      </span>

      <button
        className="btn btn-primary"
        onClick={() => setPage(currentPage + 1)}
        disabled={currentPage === totalPages || totalPages === 0}
        style={{
          flexShrink: 0,
          minWidth: buttonMinWidth,
          padding: isMobile ? "6px 10px" : "8px 16px",
          fontSize: isMobile ? "0.85rem" : "0.9rem",
        }}
      >
        Next
      </button>
    </div>
  );
};

  // const renderPagination = (currentPage, setPage, totalItems) => {
  //   const totalPages = Math.ceil(totalItems / PAGE_SIZE);

  //   // This component now renders even for a single page to provide consistent UI.
  //   return (
  //     <div className="pagination-controls">
  //       <button
  //         className="btn btn-primary"
  //         onClick={() => setPage(currentPage - 1)}
  //         disabled={currentPage === 1}
  //       >
  //         Previous
  //       </button>
  //       <span>
  //         Page {currentPage} of {totalPages || 1}
  //       </span>
  //       <button
  //         className="btn btn-primary"
  //         onClick={() => setPage(currentPage + 1)}
  //         disabled={currentPage === totalPages || totalPages === 0}
  //       >
  //         Next
  //       </button>
  //     </div>
  //   );
  // };

  useEffect(() => {
    setUpcomingPage(1);
    setPastPage(1);
  }, [searchTerm, filterDate]);

  const filteredUpcoming = filterData(upcomingAppointments);
  const paginatedUpcoming = paginateData(filteredUpcoming, upcomingPage);

  return (
    <>
      <style>{`
        /* --- General Layout & Typography --- */
        .appointments-container {
          max-width: 1100px;
          margin: 40px auto;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          padding: 20px;
          color: #333;
        }
        .section-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 20px;
          color: #222;
          border-bottom: 2px solid #007bff;
          padding-bottom: 8px;
          display: inline-block;
        }
        .appointment-section {
          margin-bottom: 40px;
        }

        /* --- Search and Filter --- */
        .controls-container {
          display: flex;
          gap: 15px;
          margin-bottom: 30px;
          align-items: center;
        }
        .search-input {
          padding: 10px 14px;
          font-size: 1rem;
          border: 1.5px solid #ccc;
          border-radius: 6px;
          transition: border-color 0.3s ease;
        }
        .search-input:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 6px rgba(0, 123, 255, 0.4);
        }
        .search-input[type="text"] {
          flex-grow: 1;
        }
        
        /* --- Buttons --- */
        .btn {
          padding: 8px 16px;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
          text-align: center;
          transition: background-color 0.2s;
        }
        .btn-primary { background-color: #007bff; }
        .btn-primary:hover { background-color: #0056b3; }
        .btn-danger { background-color: #dc3545; }
        .btn-danger:hover { background-color: #c82333; }
        .btn-secondary { background-color: #6c757d; }
        .btn:disabled {
          background-color: #ccc;
          cursor: not-allowed;
          opacity: 0.7;
        }

        /* --- Table Styling --- */
        .table-wrapper {
          overflow-x: auto;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
          border-radius: 8px;
        }
        .appointments-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 1rem;
          min-width: 700px;
          background-color: #fff;
        }
        .appointments-table thead tr {
          background-color: #f9fafb;
          text-align: left;
          font-weight: 600;
        }
        .appointments-table th,
        .appointments-table td {
          padding: 14px 16px;
          border-bottom: 1px solid #e5e7eb;
          white-space: nowrap;
        }
        .appointments-table tbody tr:last-child td {
          border-bottom: none;
        }
        .appointments-table tbody tr:hover {
          background-color: #f0f4f8;
        }
        .no-data {
          text-align: center;
          padding: 30px 0;
          color: #777;
        }
        .capitalize { text-transform: capitalize; }

        /* --- Pagination --- */
        .pagination-controls {
          margin-top: 20px;
          display: flex;
          gap: 15px;
          justify-content: center;
          align-items: center;
        }

        /* --- Responsive Design --- */
        @media (max-width: 768px) {
          .appointments-container {
            padding: 15px;
            margin-top: 20px;
          }
          .controls-container {
            flex-direction: column;
            align-items: stretch;
          }
          .search-input, .btn {
            width: 100%;
          }
        }
      `}</style>

      <div className="appointments-container">
        <h3>Appointments</h3>

        <div className="controls-container">
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="search-input"
          />
          {filterDate && (
            <button
              onClick={() => setFilterDate("")}
              className="btn btn-danger"
              title="Clear Date Filter"
            >
              Clear Date
            </button>
          )}
        </div>

        <section className="appointment-section">
          <h3 className="section-title">Ongoing</h3>
          <div className="table-wrapper">
             {loading ? <p>Loading...</p> : renderTable([])}
          </div>
        </section>

        <section className="appointment-section">
          <h3 className="section-title">Upcoming</h3>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <div className="table-wrapper">
                {renderTable(paginatedUpcoming, true)}
              </div>
              {renderPagination(
                upcomingPage,
                setUpcomingPage,
                filteredUpcoming.length
              )}
            </>
          )}
        </section>
      </div>
    </>
  );
};

export default Appointments;