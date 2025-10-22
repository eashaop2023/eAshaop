import React, { useEffect, useState } from 'react';
import logo from '../../assets/eAshalogo.png';
import dp from '../../assets/bookreading.png';
import notification from '../../assets/notification.svg'
import { useNavigate } from 'react-router-dom';
import styles from "../../pages/ProfilePage/Profile.module.css"
import { FiLogOut, FiMenu, FiX } from "react-icons/fi"
import { API_BASE_URL } from '../../../api-config';
import Sidebar from '../../components/categorypage/Sidebar';
import { useLocation } from 'react-router-dom';
import dashboard from "../../assets/icons/dashboard.svg";
import doctor from "../../assets/icons/doctor.svg";
import appointments from "../../assets/icons/appointments.svg";
import medications from "../../assets/icons/medications.svg";
import lab from "../../assets/icons/lab.svg";
import reports from "../../assets/icons/reports.svg";
import pharmacy from "../../assets/icons/pharmacy.svg";
import close from "../../assets/icons/close.svg";
import open from "../../assets/icons/open.svg";

const Topbar = ({ toggleSidebar: propToggleSidebar, isMobile: propIsMobile } = {}) => {
  const [calculatedIsMobile, setCalculatedIsMobile] = useState(window.innerWidth < 992);

  useEffect(() => {
    const handleResize = () => setCalculatedIsMobile(window.innerWidth < 992);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // const toggleSidebar = propToggleSidebar;
  // const isMobile = propIsMobile !== undefined ? propIsMobile : calculatedIsMobile;
  const [profileImage, setProfileImage] = useState(dp);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.profileImage?.cloudinaryUrl) {
      setProfileImage(storedUser.profileImage.cloudinaryUrl);
    }
  }, []);

  const [toggleState, setToggleState] = useState(false);

  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/user/profile')
  }

  const handleLogout = async () => {
    try {
      // ✅ Call backend logout API
      const response = await fetch(`${API_BASE_URL}/api/user/logout`, {
        method: "POST",
        credentials: "include", // if using cookies for session
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ Clear tokens or localStorage if you store them there
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Redirect to login
        navigate("/login");
      } else {
        console.error("Logout failed:", data.message);
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  console.log(toggleState);


  const [isOpen, setIsOpen] = useState(window.innerWidth >= 992);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const [selected, setSelected] = useState(null);

  // const navigate = useNavigate();
  const location = useLocation();
  const isLabCards = location.pathname === "/lab";

  // --- Menu items
  const menuItems = [
    { icon: dashboard, label: "Dashboard", path: "/user/dashboard" },
    { icon: doctor, label: "Doctors", path: "/user/category" },
    { icon: appointments, label: "Appointments", path: "/user/appointment" },
    { icon: medications, label: "Medications", path: "/user/medication" },
    { icon: lab, label: "Lab", path: "/user/lab" },
    { icon: reports, label: "Reports & Scanning's", path: "/user/reportone" },
    { icon: pharmacy, label: "Pharmacy", path: "/user/pharmacy" },
  ];

  // --- Sync selected item with current route
  useEffect(() => {
    const found = menuItems.find((item) => item.path === location.pathname);
    if (found) {
      setSelected(found.label);
    }
  }, [location.pathname]);

  // --- Resize handling
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 992;
      setIsMobile(mobile);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const mobile = window.innerWidth < 992;
    setIsMobile(mobile);
    setIsOpen(!mobile);
  }, []);

  // --- Track viewport width
  const [vw, setVw] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // --- Breakpoints & widths
  const MOBILE_BP = 992;
  const LAPTOP_BP = 1200;
  let sidebarWidth;
  if (!isOpen) {
    sidebarWidth = "110px";
  } else if (isMobile) {
    sidebarWidth = "260px";
  } else if (vw <= LAPTOP_BP) {
    sidebarWidth = isLabCards ? "360px" : "257px";
  } else {
    sidebarWidth = isLabCards ? "360px" : "300px";
  }

  const sidebarWidthNum = parseInt(sidebarWidth || "250", 10) || 250;
  const activeLineLeft = isMobile
    ? "222px"
    : isOpen
      ? `${Math.max(41, sidebarWidthNum - 30)}px`
      : "41px";

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div
      className={` ${styles.topBarContainer}  w-100 d-flex justify-content-between align-items-center px-3 px-lg-4 py-2 border-bottom bg-white`}
      style={{ border: '1px solid #F7F7F7', position: 'fixed', zIndex: 1050 }}
    >
      {/* Left: Logo and Menu Icon */}
      <div
        className="d-flex align-items-center"
        style={{
          marginLeft: isMobile ? '16px' : '25px',
        }}
      >
        {isMobile && (
          <>
            <FiMenu
              size={24}
              style={{ cursor: "pointer", marginRight: '15px' }}
              // onClick={toggleSidebar}
              onClick={() => setToggleState(!toggleState)}
              title="Menu"
            />
           {/* Mobile Sidebar Overlay */}
{isMobile && toggleState && (
  <div
    style={{
      position: "fixed",
      top: "76px",
      left: "0",
      width: "100%",
      height: "100vh",
      backgroundColor: "#fff",
      zIndex: 999,
      padding: "25px 20px",
      overflowY: "auto",
    }}
  >
    <ol className="list-unstyled">
      {menuItems.map((item, index) => (
        <li
          key={index}
          onClick={() => {
            navigate(item.path);
            setToggleState(false); // auto-close after navigation
          }}
          style={{
            display: "flex",
            alignItems: "center",
            padding: "12px 0",
            borderBottom: "1px solid #eee",
            cursor: "pointer",
            fontSize: "16px",
            color: "#333",
          }}
        >
          <img
            src={item.icon}
            alt={item.label}
            style={{ width: "24px", height: "24px", marginRight: "12px" }}
          />
          <span>{item.label}</span>
        </li>
      ))}
    </ol>
  </div>
)}

          </>

        )}
        <img
          src={logo}
          alt="Logo"
          className="img-fluid hover:cursor-pointer"
          style={{
            width: '72px',
            height: '60px',
            marginRight: '40px',
          }}
          onClick={() => { navigate('/') }}
        />
      </div>

      {/* Right: Notification + Bell + Profile Pic */}
      <div className="d-flex align-items-center ms-auto">

        <FiLogOut
          size={22}
          style={{ cursor: "pointer", color: "#dc3545", marginRight: '15px' }}
          onClick={handleLogout}
          title="Logout"
        />
        <img
          src={notification}
          alt="Notification"
          style={{ width: '22px', height: '22px', marginRight: '15px', cursor: "pointer" }}
        />

        <img
          src={profileImage}
          alt="User"
          className="rounded-circle hover:cursor-pointer"
          style={{ width: '48px', height: '48px', objectFit: 'cover' }}
          onClick={handleClick}
        />


      </div>
    </div>
  );
};

export default Topbar;
