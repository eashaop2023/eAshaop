import React, { useState, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import dashboard from "../../assets/icons/dashboard.svg";
import doctor from "../../assets/icons/doctor.svg";
import appointments from "../../assets/icons/appointments.svg";
import medications from "../../assets/icons/medications.svg";
import lab from "../../assets/icons/lab.svg";
import reports from "../../assets/icons/reports.svg";
import pharmacy from "../../assets/icons/pharmacy.svg";
import close from "../../assets/icons/close.svg";
import open from "../../assets/icons/open.svg";
import { useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 992);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const [selected, setSelected] = useState(null);

  const navigate = useNavigate();
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
    // setIsOpen(!mobile);
    setTimeout(() => {
      setIsOpen(false);
    }, 3000);
    console.log('open');
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
    setTimeout(() => {
      setIsOpen(false);
    }, 5000);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div
          style={{
            position: "fixed",
            top: "76px",
            width: "100%",
            height: "100vh",
            backgroundColor: "#fff",
            opacity: 0.98,
            zIndex: 998,
          }}
        />
      )}

      {/* Sidebar */}
      {!isMobile &&
        <div
          className="sidebarwidth"
          style={{
            position: "fixed",
            top: isMobile ? (isOpen ? "100px" : "0px") : "77px",
            left: isMobile ? (isOpen ? "0" : "-260px") : "0px",
            width: sidebarWidth,
            height: "calc(100vh - 78px)",
            backgroundColor: "#fff",
            borderRight: "1px solid #eee",
            padding: isMobile ? (isOpen ? "25px" : "20px") : "40px 0px 0px 57px",
            transition: "left 0.4s ease, width 0.4s ease",
            overflowX: "hidden",
            zIndex: 999,
          }}
        >
          <ol className="list-unstyled m-0 mt-5">
            {menuItems.map((item, index) => {
              const isSelected = selected === item.label;

              return (
                <li
                  key={index}
                  onClick={() => {
                    navigate(item.path);
                    setTimeout(() => {
                      setIsOpen(false)
                    }, 5000);
                    if (isMobile) setIsOpen(false); // ✅ Auto-close on mobile
                  }}
                  className={`d-flex align-items-center mb-4 sidebar-item ${isSelected ? "sidebar-active" : ""
                    }`}
                  style={{
                    marginLeft: "8px",
                    position: "relative",
                    cursor: "pointer",
                  }}
                >
                  {/* Active vertical line */}
                  {isSelected && (
                    <div
                      style={{
                        position: "absolute",
                        left: activeLineLeft,
                        top: "-7px",
                        width: "4px",
                        height: "32px",
                        borderRadius: "2px",
                        backgroundColor: "#00A99D",
                      }}
                    />
                  )}

                  <img src={item.icon} alt={item.label} className="sidebar-icon" />

                  <span
                    className="sidebar-label"
                    style={{
                      marginLeft: "12px",
                      whiteSpace: "nowrap",
                      opacity: isOpen ? 1 : 0,
                      width: isOpen ? "auto" : 0,
                      overflow: "hidden",
                      transition: "opacity 0.4s ease, width 0.4s ease",
                    }}
                  >
                    {item.label}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      }

      {/* Toggle button */}
      <button
        onClick={toggleSidebar}
        className="toggle-icon-btn"
        title={isOpen ? "Collapse" : "Expand"}
        style={{
          position: "fixed",
          top: "100px",
          left: isMobile ? "29px" : "60px",
          background: "transparent",
          border: "none",
          padding: isMobile ? "11px 0px 0px 4px" : "0px",
          transition: "left 0.4s ease",
          zIndex: 2000,
        }}
      >
        {isMobile ? (
          <></>
          // isOpen ? (
          //   <FiX size={24} color="#333" />
          // ) : (
          //   <FiMenu size={24} color="#333" />
          // )
        ) : (
          <img
            src={isOpen ? close : open}
            alt="Toggle Sidebar"
            style={{ width: "40px", height: "40px" }}
          />
        )}
      </button>

      {/* Styles */}
      <style>{`
        .sidebar-item {
          cursor: pointer;
          font-size: 16px;
          font-weight: 400;
          color: #252525;
          transition: color 0.3s ease;
        }

        .sidebar-item:hover {
          color: #00A99D;
        }

        .sidebar-active {
          color: #00A99D !important;
          font-weight: 500;
        }

        .sidebar-icon {
          width: 24px;
          height: 24px;
          flex-shrink: 0;
          transition: filter 0.3s ease;
        }

        .sidebar-item:hover .sidebar-icon {
          filter: brightness(0) saturate(100%) invert(53%) sepia(72%) saturate(455%) hue-rotate(126deg) brightness(95%) contrast(96%);
        }

        .sidebar-active .sidebar-icon {
          filter: brightness(0) saturate(100%) invert(53%) sepia(72%) saturate(455%) hue-rotate(126deg) brightness(95%) contrast(96%) !important;
        }
      `}</style>
    </>
  );
};

export default Sidebar;