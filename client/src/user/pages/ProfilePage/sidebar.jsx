import React, { useState, useEffect } from "react";
import { ListGroup } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Sidebar.css";

import User from "../../assets/icons/profile.png";
import Security from "../../assets/icons/pharmacy.svg";
import Legal from "../../assets/icons/home-hashtag.png";
import Payment from "../../assets/icons/Money Bag.png";
import Family from "../../assets/icons/people.png";
import dashboard from "../../assets/icons/dashboard.svg"

const sidebarOptions = [
  {label:"Dashboard",icon:dashboard, path: "/user/dashboard"},
  { label: "User details", icon: User, path: "/user/profile" }, 
  { label: "Security and Login", icon: Security, path: "/user/profile/security-and-login" },
  { label: "Payment and Billing", icon: Payment, path: "/user/profile/payment-and-billing" },
  { label: "Family Members", icon: Family, path: "/user/profile/family-members" },
  { label: "Legal", icon: Legal, path: "/user/profile/legal" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  // breakpoint: widths < 992px considered mobile/tablet
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  // desktop starts open; mobile starts closed (feel free to invert)
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 992);
  const [currPath, setCurrPath] = useState(location.pathname);

  useEffect(() => setCurrPath(location.pathname), [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 992;
      setIsMobile(mobile);

      // Always open on desktop
      if (!mobile) setIsOpen(true);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Only allow toggle on mobile/tablet
  const toggleSidebar = () => {
    if (!isMobile) return; // NO toggle on desktop
    setIsOpen((v) => !v);
  };

  const handleNavigate = (path) => {
    navigate(path);
    // only auto-close when on mobile/tablet
    if (isMobile) setIsOpen(false);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div className="sb-overlay" onClick={() => setIsOpen(false)} aria-hidden="true" />
      )}

      {/* Sidebar */}
      <div
        className={`sb-container ${isOpen ? "open" : "closed"} ${isMobile ? "mobile" : "desktop"}`}
        style={{ top: isMobile ? (isOpen ? "100px" : "0px") : "77px" }}
      >
        <ListGroup variant="flush" className="w-100">
          {sidebarOptions.map((item) => {
            const isSelected = currPath === item.path;
            return (
              <ListGroup.Item
                key={item.label}
                onClick={() => handleNavigate(item.path)}
                className={`sb-item d-flex align-items-center gap-2 py-3 px-3 ${isSelected ? "active" : ""}`}
              style={{backgroundColor: isSelected ? "transparent" : "transparent",
}}
              >
                <img
                  src={item.icon}
                  alt={item.label}
                  className="sb-icon"
                  style={{
                    filter: isSelected
                      ? "invert(41%) sepia(98%) saturate(452%) hue-rotate(132deg) brightness(91%) contrast(91%)"
                      : "grayscale(100%)",
                  }}
                />
                <span
                  className="sb-label"
                  style={{
                    opacity: isOpen ? 1 : 0,
                    width: isOpen ? "auto" : 0,
                  }}
                >
                  {item.label}
                </span>

                {isSelected && <div className="sb-active-bar" />}
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      </div>

      {/* Toggle button — render only for mobile/tablet */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="sb-toggle-btn"
          title={isOpen ? "Collapse" : "Expand"}
          aria-label="Toggle sidebar"
        >
          {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      )}
    </>
  );
}
