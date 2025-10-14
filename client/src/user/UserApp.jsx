import React, { useState } from "react";
import ScrollToTop from "./components/commonComponent/ScrollToTop";
import { Routes, Route } from "react-router-dom";
import './UserApp.css';
import './Userindex.css';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Layouts
import Applayout from "./components/Applayout";
import DoctorsMainLayout from "./components/DoctorsMainLayout";
import DoctorsWithSidebarLayout from "./components/DoctorsWithSidebarLayout";

// Dashboard
import DBoard from "./components/Dashboard/DBoard";
import Dashboard from "./components/Doctor Specialist/DashBoard";

// Medications / Reports
import Medication from "./components/Medications/Medication";
import ReportPage from "./components/ReportPage/ReportPage";

// Appointment
import AppointmentPage from "./components/Appointment/AppointmentPage";
import ConfirmAppointment from "./components/Appointment/confirmappointment/ConfirmAppointment";
import Appointments from "./pages/AppointmentPage/Appointments";
import VirtualAppointment from "./pages/AppointmentPage/VirtualAppointment";

// Profile
import Profile from "./pages/ProfilePage/Profile";
import SecurityPanel from "./pages/ProfilePage/SecurityPanel";
import Billing from "./pages/ProfilePage/Billing";
import FamilyPanel from "./pages/ProfilePage/FamilyPanel";
import LegalPanel from "./pages/ProfilePage/LegalPanel";
import ChangePassword from "./pages/ProfilePage/ChangePassword";
import ProfileLayout from "./pages/ProfilePage/ProfileLayout";

// Auth
import LoginPage from "./pages/LoginPage/LoginPage";
import SignUp from "./pages/LoginPage/SignUp";
import Forgotpassword from "./pages/LoginPage/Forgotpassword";
import Createpassword from "./pages/LoginPage/Createpassword";
import OTPVerification from "./pages/LoginPage/OTPVerification";
import ContactForm from "./pages/LoginPage/ContactForm";

// Pharmacy
import HomeSection from "./pages/PharmacyPage/homesec/HomeSection";
import FiltersSidebar from "./pages/PharmacyPage/filters/FilterSidebar";
import PharmacyLayout from "./pages/PharmacyPage/PharmacyLayout";
import MyCart from "./pages/PharmacyPage/mycart/MyCart";
import PharmacyDetails from "./pages/PharmacyPage/pharmacydetails/PharmacyDetails";
import SelectedAddressPage from "./pages/PharmacyPage/selectAddress/SelectAddress";
import OrderPayment from "./pages/PharmacyPage/confirmpayment/OrderPayment";
import OrderTracking from "./pages/PharmacyPage/OrderTracking ";

// Lab
import LabSectionLayout from "./components/LabPage/LabSectionLayout";
import LabTopbarOnlyLayout from "./components/LabPage/LabTopbarLayout";
import LabCardsComponent from "./components/LabPage/LabFirstPage";
import FullPanel from "./components/LabPage/HairFallPanel/FullPanel";
// import BookSlot from "./components/LabPage/Bookslot/BookSlot";

// Doctor Specialists
import GeneralHealthcare from "./components/Doctor Specialist/GeneralHealthCare/MainContent";
import CardiologistMainContent from "./components/Doctor Specialist/cardiologist/MainContent";
import ChildHealth from "./components/Doctor Specialist/ChildHealth/MainContent";
import Dental from "./components/Doctor Specialist/Dental/MainContent";
import ENT from "./components/Doctor Specialist/ENT/MainContent";
import MentalHealth from "./components/Doctor Specialist/MentalHealth/MainContent";
import Neurologist from "./components/Doctor Specialist/Neurologist/MainContent";
import Ophthalmology from "./components/Doctor Specialist/Ophthalmology/MainContent";
import Orthopedic from "./components/Doctor Specialist/Orthopedic/MainContent";
import WomenHealth from "./components/Doctor Specialist/WomenHealth/MainContent";
import SkinBeauty from "./components/Doctor Specialist/SkinBeauty/MainContent";
import DynamicDoctorCategory from "./components/Doctor Specialist/DynamicLoader";

// Utility to clear filters
const clearAllFilters = (setSelectedFilters) => {
  setSelectedFilters({
    locations: [],
    fee: [],
    gender: [],
    language: [],
    rating: [],
    general: [],
  });
};

function UserApp() {
  const [selectedFilters, setSelectedFilters] = useState({
    locations: [],
    fee: [],
    gender: [],
    language: [],
    rating: [],
    general: [],
  });

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* ---------- Default Layout ---------- */}
        <Route path="/" element={<Applayout />}>
          {/* <Route index element={<DBoard />} /> */}
          <Route path="dashboard" element={<DBoard />} />

          <Route path="category" element={<Dashboard />} />
          <Route path="appointment" element={<Appointments />} />
          <Route path="medication" element={<Medication />} />
          <Route path="reportone" element={<ReportPage />} />
        </Route>

        {/* ---------- Pharmacy Nested ---------- */}
        <Route path="pharmacy/*" element={<PharmacyLayout />}>
          <Route index element={<HomeSection />} /> {/* ✅ Fix double-click */}
          <Route path="filter" element={<FiltersSidebar />} />
          <Route path="details" element={<PharmacyDetails />} />
          <Route path="mycart" element={<MyCart />} />
          <Route path="address" element={<SelectedAddressPage />} />
          <Route path="payment" element={<OrderPayment />} />
        </Route>

        {/* ---------- Order Tracking ---------- */}
        <Route path="ordertracking" element={<OrderTracking />} />

        {/* ---------- Lab Routes ---------- */}
        <Route path="lab/*" element={<LabSectionLayout />}>
          <Route index element={<LabCardsComponent />} /> 
          <Route path="panel" element={<FullPanel />} />
        </Route>

        {/* <Route path="lab/*" element={<LabTopbarOnlyLayout />}>
          <Route path="bookslot" element={<BookSlot />} />
          <Route path="confirm-bookslot" element={<LabConfirmAppointment />} />
        </Route> */}

        {/* ---------- Auth Routes ---------- */}
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="forgot-password" element={<Forgotpassword />} />
        <Route path="create-password" element={<Createpassword />} />
        <Route path="otp-verification" element={<OTPVerification />} />
        <Route path="contact" element={<ContactForm />} />

        {/* ---------- Doctor Specialist Routes ---------- */}
        <Route path="category" element={<DoctorsMainLayout />}>
          <Route element={<DoctorsWithSidebarLayout />}>
            <Route
              path=":uuid"
              element={
                <DynamicDoctorCategory
                  selectedFilters={selectedFilters}
                  setSelectedFilters={setSelectedFilters}
                  clearAllFilters={() => clearAllFilters(setSelectedFilters)}
                />
              }
            />
            </Route>
            {/* <Route
              path=":uuid"
              element={
                <CardiologistMainContent
                  selectedFilters={selectedFilters}
                  setSelectedFilters={setSelectedFilters}
                  clearAllFilters={() => clearAllFilters(setSelectedFilters)}
                />
              }
            />
            <Route
              path="child-health"
              element={
                <ChildHealth
                  selectedFilters={selectedFilters}
                  setSelectedFilters={setSelectedFilters}
                  clearAllFilters={() => clearAllFilters(setSelectedFilters)}
                />
              }
            />
            <Route
              path="dental"
              element={
                <Dental
                  selectedFilters={selectedFilters}
                  setSelectedFilters={setSelectedFilters}
                  clearAllFilters={() => clearAllFilters(setSelectedFilters)}
                />
              }
            />
            <Route
              path="ent"
              element={
                <ENT
                  selectedFilters={selectedFilters}
                  setSelectedFilters={setSelectedFilters}
                  clearAllFilters={() => clearAllFilters(setSelectedFilters)}
                />
              }
            />
            <Route
              path="mental-health"
              element={
                <MentalHealth
                  selectedFilters={selectedFilters}
                  setSelectedFilters={setSelectedFilters}
                  clearAllFilters={() => clearAllFilters(setSelectedFilters)}
                />
              }
            />
           <Route
  path=":uuid"
  element={
    <Neurologist
      selectedFilters={selectedFilters}
      setSelectedFilters={setSelectedFilters}
      clearAllFilters={() => clearAllFilters(setSelectedFilters)}
    />
  }
/>
            <Route
              path="ophthalmology"
              element={
                <Ophthalmology
                  selectedFilters={selectedFilters}
                  setSelectedFilters={setSelectedFilters}
                  clearAllFilters={() => clearAllFilters(setSelectedFilters)}
                />
              }
            />
            <Route
              path="orthopedic"
              element={
                <Orthopedic
                  selectedFilters={selectedFilters}
                  setSelectedFilters={setSelectedFilters}
                  clearAllFilters={() => clearAllFilters(setSelectedFilters)}
                />
              }
            />
            <Route
              path="women-health"
              element={
                <WomenHealth
                  selectedFilters={selectedFilters}
                  setSelectedFilters={setSelectedFilters}
                  clearAllFilters={() => clearAllFilters(setSelectedFilters)}
                />
              }
            />
            <Route
              path="skin-&-beauty"
              element={
                <SkinBeauty
                  selectedFilters={selectedFilters}
                  setSelectedFilters={setSelectedFilters}
                  clearAllFilters={() => clearAllFilters(setSelectedFilters)}
                />
              }
            />
          </Route> */}

          {/* Appointment pages (without sidebar) */}
          <Route path="bookappointment" element={<AppointmentPage />} />
          <Route path="confirmappointment" element={<ConfirmAppointment />} />
        </Route>

        {/* ---------- Other Routes ---------- */}
        <Route path="change-password" element={<ChangePassword />} />
        <Route path="virtual-appointment" element={<VirtualAppointment />} />

        {/* ---------- Profile Routes ---------- */}
        <Route path="/profile" element={<ProfileLayout />}>
          <Route index element={<Profile />} />
          <Route path="payment-and-billing" element={<Billing />} />
          <Route path="family-members" element={<FamilyPanel />} />
          <Route path="security-and-login" element={<SecurityPanel />} />
          <Route path="legal" element={<LegalPanel />} />
          <Route path="appointment" element={<Appointments />} />
        </Route>
      </Routes>
      {/* <ToastContainer
        position="top-right"
        autoClose={3000} // closes in 3 sec
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored" // "light", "dark", "colored"
      /> */}
  
    </>
  );
}

export default UserApp;
