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
import { ImCross } from "react-icons/im";
// <<<<<<< HEAD
import User from "../../assets/icons/profile.png";
import Security from "../../assets/icons/pharmacy.svg";
import Legal from "../../assets/icons/home-hashtag.png";
// import Payment from "../../assets/icons/Money Bag.png";
// import Family from "../../assets/icons/people.png";
// import socket from '../../../common/socket';
// =======
import './Topbar.css';
import { io } from "socket.io-client";
import socket from '../../../commonComponents/socket';
// import socket from '../../../commonComponents/socket';
// --- Simple toast popup function
// --- Enhanced toast popup function ---
const showToast = (message, options = {}) => {
  const {
    background = "#00a99d", // default teal background
    color = "white",
    position = "bottom-right",
    duration = 4000, // 4 seconds by default
  } = options;

  const toast = document.createElement("div");
  toast.textContent = message;
  toast.style.position = "fixed";
  toast.style.zIndex = "9999";
  toast.style.padding = "12px 18px";
  toast.style.borderRadius = "8px";
  toast.style.background = background;
  toast.style.color = color;
  toast.style.fontSize = "14px";
  toast.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
  toast.style.opacity = "0";
  toast.style.transition = "opacity 0.4s ease, transform 0.4s ease";

  // --- Positioning ---
  if (position.includes("bottom")) {
    toast.style.bottom = "20px";
  } else {
    toast.style.top = "20px";
  }
  if (position.includes("right")) {
    toast.style.right = "20px";
  } else {
    toast.style.left = "20px";
  }

  // --- Animation (slide in) ---
  toast.style.transform = "translateY(20px)";
  document.body.appendChild(toast);

  // Animate in
  setTimeout(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";
  }, 100);

  // Animate out and remove
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(20px)";
    setTimeout(() => toast.remove(), 400);
  }, duration);
};

// const socket = io("http://localhost:5000", {
//   transports: ["websocket"],
//   reconnection: true,
//   reconnectionAttempts: Infinity,
//   reconnectionDelay: 2000,
// });



// >>>>>>> 70494b2c659823a4e959a7996e6f861a63dc7eb5

const Topbar = ({ toggleSidebar: propToggleSidebar, isMobile: propIsMobile } = {}) => {
  const [calculatedIsMobile, setCalculatedIsMobile] = useState(window.innerWidth < 992);
    const [notifications, setNotifications] = useState([]);
      const [showDropdown, setShowDropdown] = useState(false);
      const [expandedIds, setExpandedIds] = useState([]);
const dropdownRef = React.useRef(null);                                                 

useEffect(() => {
  function handleClickOutside(event) {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  }

  if (showDropdown) {
    document.addEventListener("mousedown", handleClickOutside);
  } else {
    document.removeEventListener("mousedown", handleClickOutside);
  }

  return () => document.removeEventListener("mousedown", handleClickOutside);
}, [showDropdown]);

  useEffect(() => {
    const handleResize = () => setCalculatedIsMobile(window.innerWidth < 992);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // const toggleSidebar = propToggleSidebar;
  // const isMobile = propIsMobile !== undefined ? propIsMobile : calculatedIsMobile;
  const [profileImage, setProfileImage] = useState();
  const [isFetchingNotifications, setIsFetchingNotifications] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    
    // Check if user data was recently fetched (within last 5 seconds) to avoid duplicate calls
    const lastFetchTime = sessionStorage.getItem('userDataLastFetch');
    const now = Date.now();
    const fiveSecondsAgo = now - 5000;
    
    if (!lastFetchTime || parseInt(lastFetchTime) < fiveSecondsAgo) {
      fetch(`${API_BASE_URL}/api/user/${storedUser.id}`)
        .then((res) => res.json()) // parse JSON
        .then((data) => {
          if (data?.user?.profileImage?.cloudinaryUrl) {
            setProfileImage(data?.user?.profileImage?.cloudinaryUrl);
          }
          // Cache the fetch time to prevent duplicate calls
          sessionStorage.setItem('userDataLastFetch', now.toString());
        })
        .catch((err) => {
          console.error("Error fetching user:", err);
        });
    } else {
      // Use cached profile image from localStorage if available
      const cachedUser = JSON.parse(localStorage.getItem("user"));
      if (cachedUser?.profileImage?.cloudinaryUrl) {
        setProfileImage(cachedUser.profileImage.cloudinaryUrl);
      }
    }

     
      socket.emit("joinUserRoom", storedUser.id);
      
      socket.on("UserprofileImageUpdated", (data) => {
     

      if (data.userId === storedUser.id) {
        const newImage = data.profileImage.cloudinaryUrl || data.profileImage;

        setProfileImage(newImage);

       
        const updatedUser = {
          ...storedUser,
          profileImage: { cloudinaryUrl: newImage },
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    });

   
    return () => {
      socket.off("UserprofileImageUpdated");
    };

  }, []);

  // --- Fetch notifications with debouncing to prevent duplicate calls
  const fetchNotifications = async () => {
    // Prevent multiple simultaneous calls
    if (isFetchingNotifications) {
      return;
    }

    try {
      setIsFetchingNotifications(true);
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const storedRole = localStorage.getItem("role"); // 'user' or 'doctor'
      const userId = storedUser?.id;

      if (!userId || !storedRole) {
        console.warn("No userId or role found in localStorage — skipping fetch.");
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/notifications/${storedRole}/${userId}`);
      
      // Handle 404 errors gracefully
      if (res.status === 404) {
        console.warn("Notifications endpoint not found (404). This may be expected if notifications are not yet implemented.");
        setNotifications([]);
        return;
      }

      if (!res.ok) {
        throw new Error(`Failed to fetch notifications: ${res.status}`);
      }

      const data = await res.json();

      if (Array.isArray(data.notifications)) {
        setNotifications(data.notifications);
        console.log("Fetched notifications:", data.notifications.length);
      } else {
        console.warn("Notifications data format unexpected:", data);
        setNotifications([]);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
      // Don't show error to user if it's a 404 (endpoint might not exist)
      if (err.message && !err.message.includes("404")) {
        console.error("Failed to fetch notifications:", err.message);
      }
    } finally {
      setIsFetchingNotifications(false);
    }
  };

  // useEffect(() => {
  //   fetchNotifications(); // Initial fetch on mount
  // }, []);


  // --- Real-time notifications via Socket.IO
useEffect(() => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.id;
  if (!userId) return;

  let hasFetched = false; // Flag to prevent duplicate initial fetch

  const joinRoomAndFetch = () => {
    socket.emit("joinUser", userId);
    console.log("Joined user room after connect/reconnect:", userId);
    // Only fetch if not already fetched (prevent duplicate on initial connect)
    if (!hasFetched) {
      fetchNotifications();
      hasFetched = true;
    }
  };

  // If socket is already connected, join and fetch immediately
  if (socket.connected) {
    joinRoomAndFetch();
  }

  socket.on("connect", joinRoomAndFetch);
  socket.on("reconnect", () => {
    // On reconnect, allow fetching again (user might have new notifications)
    hasFetched = false;
    joinRoomAndFetch();
  });

  socket.on("newNotification", (data) => {
  const messageText =
    typeof data.message === "string"
      ? data.message
      : data.message?.text || "You have a new notification! Please check.";

  // ✅ Show toast safely
  showToast(messageText, {
    background: "#00a99d",
    position: "bottom-right",
    duration: 5000,
  });

  // if (messageText.includes("You have a new notification")) {
  //   return; // STOP here (do not add to dropdown)
  // }

  // ✅ Normalize data structure for your state
  const newNotif = {
    _id: data._id || Date.now(),
    message: {
      text: messageText,
      link: data.message?.link || null,
    },
    isRead: false,
  };

  setNotifications((prev) => [newNotif, ...prev]);
});

 
  socket.on("connect_error", (err) => {
    console.error("Socket connection error:", err.message);
  });

  return () => {
    socket.off("newNotification");
    socket.off("connect_error");
    socket.off("connect", joinRoomAndFetch);
    socket.off("reconnect", joinRoomAndFetch);
  };
}, []);



   // --- Unread count
  const unreadCount = notifications.filter(n => !n.isRead).length;

   // --- Mark as read
  const handleMarkRead = async (id) => {
      const role = localStorage.getItem("role"); // 'user' or 'doctor'

    try {
    const res = await fetch(`${API_BASE_URL}/api/notifications/${id}/read?type=${role}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
        const data = await res.json();

      if (res.ok) {
       console.log(" Marked as read:", data.notification);

        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
        );
              setExpandedIds((prev) => [...prev, id]);

      } else{
      console.error(" Error:", data.message);
      }
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  // --- Toggle dropdown
  const handleBellClick = () => setShowDropdown((prev) => !prev);




  const [toggleState, setToggleState] = useState(false);

  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/user/profile')
  }

  const handleLogout = async () => {
    try {
      // Get auth token from localStorage
      const authToken = localStorage.getItem("authToken");
      
      // Disconnect socket connection
      if (socket && socket.connected) {
        socket.disconnect();
      }

      // Call backend logout API with token in body
      if (authToken) {
        try {
          const response = await fetch(`${API_BASE_URL}/api/user/logout`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: authToken }),
          });

          const data = await response.json();
          if (!response.ok) {
            console.warn("Logout API warning:", data.message);
          }
        } catch (apiError) {
          console.warn("Logout API error (continuing with local cleanup):", apiError);
        }
      }

      // Clear all localStorage items
      localStorage.removeItem("authToken");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userId");
      localStorage.removeItem("role");
      localStorage.removeItem("doctorId");
      localStorage.removeItem("appointmentData");
      localStorage.removeItem("selectedSlot");
      
      // Clear sessionStorage
      sessionStorage.clear();

      // Navigate to login page
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      // Even if there's an error, clear local storage and navigate
      localStorage.clear();
      sessionStorage.clear();
      if (socket && socket.connected) {
        socket.disconnect();
      }
      navigate("/login");
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
  const validPaths = [
    "/user/profile",
    "/user/profile/security-and-login",
    "/user/profile/payment-and-billing",
    "/user/profile/legal",
  ];
  const [random, setRandom] = useState(false);
  useEffect(() => {
    if (validPaths.includes(location?.pathname)) {
      setRandom(true);
    }
  }, []);
  // const sidebarOptions = [
  //   { label: "Dashboard", icon: dashboard, path: "/user/dashboard" },
  //   { label: "User details", icon: User, path: "/user/profile" },
  //   { label: "Security and Login", icon: Security, path: "/user/profile/security-and-login" },
  //   { label: "Payment and Billing", icon: Payment, path: "/user/profile/payment-and-billing" },
  //   // { label: "Family Members", icon: Family, path: "/user/profile/family-members" },
  //   { label: "Legal", icon: Legal, path: "/user/profile/legal" },
  // ];
  return (
    <div
      className={` ${styles.topBarContainer}  w-100 d-flex justify-content-between align-items-center px-3 px-lg-4 py-2 border-bottom bg-white`}
      style={{ border: '1px solid #F7F7F7', position: 'fixed', zIndex: 1050 }}
    >
      <div
        className="d-flex align-items-center"
        style={{
          marginLeft: isMobile ? "16px" : "25px",
        }}
      >
        {isMobile && (
          <>
            {!random && (
              <>
                {!toggleState ? (
                  <FiMenu
                    size={24}
                    style={{ cursor: "pointer", marginRight: "15px" }}
                    onClick={() => setToggleState(true)}
                    title="Menu"
                  />
                ) : (
                  <ImCross
                    size={18}
                    onClick={() => setToggleState(false)}
                    style={{ cursor: "pointer", marginRight: "18px" }}
                  />
                )}

                <div
                  onClick={() => setToggleState(false)}
                  style={{
                    position: "fixed",
                    top: "76px",
                    left: 0,
                    width: "100%",
                    height: "100vh",
                    backgroundColor: toggleState
                      ? "rgba(0, 0, 0, 0.3)"
                      : "rgba(0, 0, 0, 0)",
                    zIndex: 998,
                    pointerEvents: toggleState ? "auto" : "none",
                    transition: "background-color 0.4s ease",
                  }}
                ></div>

                <div
                  style={{
                    position: "fixed",
                    top: "76px",
                    left: 0,
                    width: "65%",
                    height: "100vh",
                    backgroundColor: "#fff",
                    zIndex: 999,
                    padding: "0px 0px",
                    paddingLeft: "20px",
                    paddingRight:"20px", 
                    paddingTop:"5px",                   
                    overflowY: "auto",
                    boxShadow: "2px 0 8px rgba(0, 0, 0, 0.1)",
                    transition:
                      "transform 0.4s ease-in-out, opacity 0.4s ease-in-out",
                    transform: toggleState
                      ? "translateX(0)"
                      : "translateX(-100%)",
                    opacity: toggleState ? 1 : 0,
                    // borderTopRightRadius: "12px",
                    borderBottomRightRadius: "12px",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <ol className="list-unstyled">
                    {menuItems.map((item, index) => (
                      <li
                        key={index}
                        onClick={() => {
                          navigate(item.path);
                          setToggleState(false);
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          padding: "12px 0",
                          cursor: "pointer",
                          fontSize: "16px",
                          color: "#333",
                          backgroundColor:
                            location.pathname === item.path
                              ? "rgba(0,169,157,0.08)"
                              : "transparent",
                          borderRadius: "10px",
                          transition:
                            "background-color 0.3s ease, transform 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor =
                            "rgba(0,169,157,0.05)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor =
                            location.pathname === item.path
                              ? "rgba(0,169,157,0.08)"
                              : "transparent";
                        }}
                      >
                        <img
                          src={item.icon}
                          alt={item.label}
                          style={{
                            width: "24px",
                            height: "24px",
                            marginRight: "12px",
                            marginLeft: "12px",
                            filter:
                              location.pathname === item.path
                                ? "invert(49%) sepia(99%) saturate(443%) hue-rotate(132deg) brightness(95%) contrast(93%)"
                                : "grayscale(100%) opacity(0.8)",
                            transition: "filter 0.3s ease",
                          }}
                        />
                        <span>{item.label}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </>
            )}
          </>
        )}


        <img
          src={logo}
          alt="Logo"
          className="img-fluid hover:cursor-pointer"
          style={{
            width: "72px",
            height: "60px",
            marginRight: "40px",
            marginLeft: random ? "40px" : ""
          }}
          onClick={() => {
            navigate("/user/dashboard");
          }}
        />
      </div>



      <div className="d-flex align-items-center ms-auto">

        <FiLogOut
          size={22}
          style={{ cursor: "pointer", color: "#dc3545", marginRight: '15px' }}
          onClick={handleLogout}
          title="Logout"
        />

{/*  Notification Bell */}
<div style={{ position: "relative", marginRight: "15px" }} ref={dropdownRef}>
  <img
    src={notification}
    alt="Notification"
    style={{ width: '22px', height: '22px', cursor: "pointer" }}
    onClick={() => setShowDropdown((prev) => !prev)}
  />

  {/*  Unread Count Badge */}
  {unreadCount > 0 && (
    <span
      style={{
        position: "absolute",
        top: "-5px",
        right: "-5px",
        background: "red",
        color: "white",
        borderRadius: "50%",
        fontSize: "10px",
        width: "16px",
        height: "16px",
        textAlign: "center",
        lineHeight: "16px",
      }}
    >
      {unreadCount}
    </span>
  )}

  {/* Dropdown */}
{showDropdown && (
  <div
    className="notification-dropdown"
    // ref={dropdownRef}
    style={{
      position: "absolute",
      top: "30px",
      right: "0",
      background: "#fff",
      border: "1px solid #ddd",
      borderRadius: "10px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      zIndex: 2000,
      overflow: "hidden", // Prevent header from scrolling
    }}
  >
    {/* --- HEADER (Fixed) --- */}
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px",
        borderBottom: "1px solid #eee",
        position: "sticky",
        top: 0,
        background: "#fff",
        zIndex: 10,
      }}
    >
      <strong>Notifications</strong>
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <button
          onClick={async () => {
            const role = localStorage.getItem("role");
            const user = JSON.parse(localStorage.getItem("user"));
            const id = user?.id;
            if (!id || !role) return;

            try {
              const res = await fetch(
                `${API_BASE_URL}/api/notifications/mark-all-read?type=${role}`,
                {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    userId: role === "user" ? id : undefined,
                    doctorId: role === "doctor" ? id : undefined,
                  }),
                }
              );
              if (res.ok) {
                setNotifications((prev) =>
                  prev.map((n) => ({ ...n, isRead: true }))
                );
              }
            } catch (err) {
              console.error("Error marking all read:", err);
            }
          }}
          style={{
            background: "transparent",
            border: "none",
            color: "#007bff",
            fontSize: "13px",
            cursor: "pointer",
          }}
        >
          Mark all as read
        </button>
        <span
          onClick={() => setShowDropdown(false)}
          style={{
            cursor: "pointer",
            color: "#555",
            fontSize: "16px",
            marginRight: "5px",
          }}
        >
          ✕
        </span>
      </div>
    </div>

    {/* --- SCROLLABLE LIST --- */}
    <div
      className="notification-list"
      style={{
        maxHeight: "300px",
        overflowY: "auto",
        scrollbarWidth: "none", // Firefox
      }}
    >
      {notifications.length > 0 ? (
        notifications.map((note) => (
          <div
            key={note._id}
            style={{
              backgroundColor: note.isRead ? "#f9f9f9" : "#00a99d", // ✨ Change unread color here
              padding: "10px",
              borderRadius: "8px",
              margin: "8px 10px",
              border: "1px solid #eee",
            }}
          >
            <p style={{ margin: 0, fontSize: "14px", color: "#333" }}>
              {expandedIds.includes(note._id) ? (
                <>
                  {note.message.text}{" "}
                  {note.message.link && (
          <a
            href={note.message.link}
            onClick={(e) => {
              e.stopPropagation();
              navigate(note.message.link);
            }}
            style={{ color: "#00A99D", textDecoration: "underline",marginRight:"10px" }}
          >
            Click here 
          </a>
        )}
                  <span
                    onClick={() =>
                      setExpandedIds((prev) =>
                        prev.filter((id) => id !== note._id)
                      )
                    }
                    style={{ color: "#007bff", cursor: "pointer" }}
                  >
                    less
                  </span>
                </>
              ) : note.message.text.length > 40 ? (
                <>
                  {note.message.text.slice(0, 40)}...
                  <span
                    onClick={() => handleMarkRead(note._id)}
                    style={{ color: "#007bff", cursor: "pointer" }}
                  >
                    more
                  </span>
                </>
              ) : (
                 <>
        {note.message.text}{" "}
        {note.message.link && (
          <a
  href={note.message.link}
  onClick={(e) => {
    e.preventDefault(); // stop browser reload
    e.stopPropagation();

    const link = note.message.link || "";

    // ✅ Handle absolute and relative links safely
    if (link.startsWith("http")) {
      const url = new URL(link);
      navigate(url.pathname); // only navigate to path part
    } else {
      navigate(link); // relative path
    }
  }}
  style={{ color: "#00A99D", textDecoration: "underline" }}
>
  Click here ...
</a>

        )}
      </>
              )}
            </p>
          </div>
        ))
      ) : (
        <p style={{ textAlign: "center", color: "#888", padding: "10px" }}>
          No notifications
        </p>
      )}
    </div>
  </div>
)}
</div>

         {/* Profile Image */}
        <div 
          className="d-flex flex-column align-items-center"
          style={{ cursor: 'pointer' }}
          onClick={handleClick}
        >
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className="rounded-circle"
              style={{ width: '48px', height: '48px', objectFit: 'cover' }}
            />
          ) : (
            <div
              className="rounded-circle d-flex align-items-center justify-content-center"
              style={{ 
                width: '48px', 
                height: '48px', 
                backgroundColor: '#E0E0E0',
                border: '2px solid #E0E0E0'
              }}
            >
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="24" cy="24" r="24" fill="#E0E0E0" />
                <circle cx="24" cy="18" r="8" fill="#9E9E9E" />
                <ellipse cx="24" cy="38" rx="12" ry="8" fill="#9E9E9E" />
              </svg>
            </div>
          )}
          <span 
            style={{ 
              fontSize: '12px', 
              color: '#252525', 
              marginTop: '4px',
              fontWeight: '500'
            }}
          >
            Profile
          </span>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
