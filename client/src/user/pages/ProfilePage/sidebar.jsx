// import React, { useState, useEffect } from "react";
// import { ListGroup } from "react-bootstrap";
// import { useNavigate, useLocation } from "react-router-dom";
// import { FiMenu, FiX } from "react-icons/fi";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./sidebar.css";

// import User from "../../assets/icons/profile.png";
// import Security from "../../assets/icons/pharmacy.svg";
// import Legal from "../../assets/icons/home-hashtag.png";
// import Payment from "../../assets/icons/Money Bag.png";
// import Family from "../../assets/icons/people.png";
// import dashboard from "../../assets/icons/dashboard.svg"

// const sidebarOptions = [
//   {label:"Dashboard",icon:dashboard, path: "/user/dashboard"},
//   { label: "User details", icon: User, path: "/user/profile" }, 
//   { label: "Security and Login", icon: Security, path: "/user/profile/security-and-login" },
//   { label: "Payment and Billing", icon: Payment, path: "/user/profile/payment-and-billing" },
//   // { label: "Family Members", icon: Family, path: "/user/profile/family-members" },
//   { label: "Legal", icon: Legal, path: "/user/profile/legal" },
// ];

// export default function Sidebar({ isOpen, setIsOpen }) {
//   const navigate = useNavigate();
//   const location = useLocation();

//   // breakpoint: widths < 992px considered mobile/tablet
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
//   // desktop starts open; mobile starts closed (feel free to invert)
//   const [currPath, setCurrPath] = useState(location.pathname);

//   useEffect(() => setCurrPath(location.pathname), [location.pathname]);

//   useEffect(() => {
//     const handleResize = () => {
//       const mobile = window.innerWidth < 992;
//       setIsMobile(mobile);

//       // Always open on desktop
//       if (!mobile) setIsOpen(true);
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);



//   const handleNavigate = (path) => {
//     navigate(path);
//     // only auto-close when on mobile/tablet
//     if (isMobile) setIsOpen(false);
//   };

//   return (
//     <>
//       {/* Mobile overlay */}
//       {isMobile && isOpen && (
//         <div className="sb-overlay" onClick={() => setIsOpen(false)} aria-hidden="true" />
//       )}

//       {/* Sidebar */}
//       <div
//         className={`sb-container ${isOpen ? "open" : "closed"} ${isMobile ? "mobile" : "desktop"}`}
//         style={{ top: isMobile ? (isOpen ? "100px" : "0px") : "77px" }}
//       >
//         <ListGroup variant="flush" className="w-100">
//           {sidebarOptions.map((item) => {
//             const isSelected = currPath === item.path;
//             return (
//               <ListGroup.Item
//                 key={item.label}
//                 onClick={() => handleNavigate(item.path)}
//                 className={`sb-item d-flex align-items-center gap-2 py-3 px-3 ${isSelected ? "active" : ""}`}
//               style={{backgroundColor: isSelected ? "transparent" : "transparent",
// }}
//               >
//                 <img
//                   src={item.icon}
//                   alt={item.label}
//                   className="sb-icon"
//                   style={{
//                     filter: isSelected
//                       ? "invert(41%) sepia(98%) saturate(452%) hue-rotate(132deg) brightness(91%) contrast(91%)"
//                       : "grayscale(100%)",
//                   }}
//                 />
//                 <span
//                   className="sb-label"
//                   style={{
//                     opacity: isOpen ? 1 : 0,
//                     width: isOpen ? "auto" : 0,
//                   }}
//                 >
//                   {item.label}
//                 </span>

//                 {isSelected && <div className="sb-active-bar" />}
//               </ListGroup.Item>
//             );
//           })}
//         </ListGroup>
//       </div>


//     </>
//   );
// }
import React, { useState, useEffect } from "react";
import { ListGroup } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import "bootstrap/dist/css/bootstrap.min.css";
import { ImCross } from "react-icons/im";
import User from "../../assets/icons/profile.png";
import Security from "../../assets/icons/pharmacy.svg";
import Legal from "../../assets/icons/home-hashtag.png";
import Payment from "../../assets/icons/Money Bag.png";
import dashboard from "../../assets/icons/dashboard.svg";

const sidebarOptions = [
  { label: "Dashboard", icon: dashboard, path: "/user/dashboard" },
  { label: "User details", icon: User, path: "/user/profile" },
  {
    label: "Security and Login",
    icon: Security,
    path: "/user/profile/security-and-login",
  },
  {
    label: "Payment and Billing",
    icon: Payment,
    path: "/user/profile/payment-and-billing",
  },
  { label: "Legal", icon: Legal, path: "/user/profile/legal" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 992);
  const [currPath, setCurrPath] = useState(location.pathname);

  useEffect(() => setCurrPath(location.pathname), [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 992;
      setIsMobile(mobile);
      if (!mobile) setIsOpen(true);
    };
    window.addEventListener("resize", handleResize);
    // setTimeout(() => {
    //   setIsOpen(false);
    // }, 3000);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNavigate = (path) => {
    navigate(path);
    if (isMobile) setIsOpen(false);
    // setTimeout(() => {
    //   setIsOpen(false);
    // }, 3000);
  };

  return (
    <>
      {/* Toggle Button (Mobile Only) */}
      {isMobile && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            position: "fixed",
            top: "28px",
            left: "30px",
            zIndex: 1100,
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          {isOpen ? <ImCross
            size={20}
            // onClick={() => setToggleState(false)}
            style={{ cursor: "pointer", marginRight: "18px" }}
          /> : <FiMenu
            size={24}
            style={{ cursor: "pointer", marginRight: "15px" }}
            // onClick={() => setToggleState(true)}
            title="Menu"
          />}
        </button>
      )}

      {/* Overlay for Mobile */}
      {isMobile && isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
          style={{
            position: "fixed",
            top: "74px",
            left: 0,
            width: "100%",
            height: "100vh",
            background: "rgba(0,0,0,0.3)",
            zIndex: 1040,
          }}
        />
      )}

      {/* Sidebar Container */}
      <div
        style={{
          position: "fixed",
          left: 0,
          top: isMobile ? "77px" : "77px",
          height: "100vh",
          width: isMobile ? "70%" : "250px",
          backgroundColor: "#fff",
          boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
          overflowY: "auto",
          zIndex: 1050,
          transition: "transform 0.3s ease",
          transform:
            isMobile && !isOpen ? "translateX(-100%)" : "translateX(0)",
        }}
      >
        <ListGroup variant="flush" className="w-100">
          {sidebarOptions.map((item) => {
            const isSelected = currPath === item.path;
            return (
              <ListGroup.Item
                key={item.label}
                onClick={() => handleNavigate(item.path)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 16px",
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                  position: "relative",
                  borderRadius: "10px",
                  // backgroundColor: isSelected ? "#f1f1f1" : "transparent",
                }}
              >
                <img
                  src={item.icon}
                  alt={item.label}
                  style={{
                    width: "24px",
                    height: "24px",
                    filter: isSelected
                      ? "invert(41%) sepia(98%) saturate(452%) hue-rotate(132deg) brightness(91%) contrast(91%)"
                      : "grayscale(100%)",
                  }}
                />
                <span
                  style={{
                    opacity: isOpen ? 1 : 0,
                    width: isOpen ? "auto" : 0,
                    transition: "opacity 0.3s ease, width 0.3s ease",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.label}
                </span>

                {isSelected && (
                  <div
                    style={{
                      width: "4px",
                      height: "100%",
                      backgroundColor: "#10e851ff",
                      borderRadius: "4px",
                      position: "absolute",
                      right: "0",
                      top: "0",
                    }}
                  ></div>
                )}
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      </div>
    </>
  );
}
