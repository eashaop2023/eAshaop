import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaClock,
  FaHistory,
  FaPrescriptionBottleAlt,
  FaStar,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  const menuItems = [
    { name: "Dashboard", icon: <FaTachometerAlt />, path: "/doctor/dashboard" },
    { name: "Set Availability", icon: <FaClock />, path: "/doctor/availability" },
    { name: "Booking History", icon: <FaHistory />, path: "/doctor/bookings" },
    {
      name: "Prescription",
      icon: <FaPrescriptionBottleAlt />,
      path: "/doctor/prescriptions",
    },
    { name: "Reviews and Ratings", icon: <FaStar />, path: "/doctor/reviews" },
  ];

  const activeItem = menuItems.find((item) => location.pathname === item.path);

const handleLogout = async () => {
  try {
    const token = localStorage.getItem("authToken");
    if (token) {
      await fetch("http://localhost:5000/api/doctors/logout", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
    }
  } catch (err) {
    console.error("Logout API failed:", err);
  } finally {
    localStorage.removeItem("authToken");
    navigate("/login");
  }
};

  return (
    <>
      {/* Top Bar (Mobile Only) */}
      <div className="lg:hidden fixed top-[58px] md:top-[64px] left-0 right-0 flex items-center justify-start gap-3 bg-white px-3 py-1 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md text-black bg-transparent border-none"
        >
          {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
        {activeItem && (
          <span className="text-sm font-medium text-black">
            {activeItem.name}
          </span>
        )}
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white flex flex-col transform transition-transform duration-300 z-40
          lg:w-60 lg:translate-x-0
          ${isOpen ? "translate-x-0 w-[72%] md:w-[35%] mt-[60px]" : "-translate-x-full w-[70%] md:w-[35%] mt-[40px] lg:mt-0"}
        `}
      >
        {/* Menu Items */}
        <div className="flex-1 space-y-1 mt-[50px] lg:mt-[90px]">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={index}
                to={item.path}
                className={`relative flex items-center gap-3 w-full text-left px-3 py-3 rounded-md transition-colors duration-200 ${
                  isActive
                    ? "font-semibold bg-green-100"
                    : "text-black hover:text-[#00A99D]"
                }`}
                style={{
                  textDecoration: "none",
                  color: isActive ? "#00A99D" : undefined,
                }}
                onClick={() => setIsOpen(false)}
              >
                {isActive && (
                  <span className="absolute right-0 top-0 h-full w-1 bg-[#00A99D] rounded-l-md"></span>
                )}
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          })}

          {/* Logout - shown in menu only for mobile */}
          <button
            onClick={() => {
              setIsOpen(false);
              setShowLogoutPopup(true);
            }}
            className="lg:hidden relative flex items-center gap-3 w-full text-left px-3 py-3 rounded-md text-red-500 hover:bg-red-100 transition-colors duration-200"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>

        {/* Logout Button (Desktop only, at bottom) */}
        <div className="hidden lg:block p-3 mt-auto">
          <button
            onClick={() => setShowLogoutPopup(true)}
            className="w-full flex items-center gap-2 px-3 py-2 bg-red-400 text-white rounded-md hover:bg-red-500 border-none"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </div>

      {/* Overlay for Mobile Sidebar */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Custom Logout Popup */}
      {showLogoutPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-sm p-6 text-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Confirm Logout
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to logout?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowLogoutPopup(false)}
                className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
