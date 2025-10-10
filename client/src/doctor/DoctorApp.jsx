import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";


import LoginPage from "./Components/LoginPage/LoginPage";

// import DoctorsLayout from "./DoctorsLayout";
import DoctorsLayout from "./Components/DoctorsFields/DoctorsLayout";
import Dashboard from "./Components/DoctorsFields/Dashboard";
import CalendarAndSlots from "./Components/DoctorsFields/SetAvailability";
import BookingHistory from "./Components/DoctorsFields/History";
import Prescription from "./Components/DoctorsFields/Prescription";
import Ratings from "./Components/DoctorsFields/Ratings";
import DoctorProfilePage from "./Components/DoctorsFields/DoctorProfile";
import Appointments from "./Components/DoctorsFields/Appointments";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("authToken");
  return token ? children : <Navigate to="/login" replace />;
};

const DoctorApp = () => {
  return (
    <>
      <Routes>
        {/* Redirect /doctor to dashboard */}
        <Route path="/" element={<Navigate to="dashboard" replace />} />

        <Route path="/login" element={<LoginPage />} />

        {/* Layout route */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DoctorsLayout />
            </ProtectedRoute>
          }
        >
          {/* Nested routes rendered inside <Outlet /> of DoctorsLayout */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="availability" element={<CalendarAndSlots />} />
          <Route path="bookings" element={<BookingHistory />} />
          <Route path="prescriptions" element={<Prescription />} />
          <Route path="reviews" element={<Ratings />} />
          <Route path="doctorprofile" element={<DoctorProfilePage />} />
          <Route path="appointments" element={<Appointments />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>

      <ToastContainer position="top-center" autoClose={2000} />
    </>
  );
};

export default DoctorApp;
