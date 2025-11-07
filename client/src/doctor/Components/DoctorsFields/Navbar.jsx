import React, { useState, useEffect, useRef } from "react";
import { Bell, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo from "../../../assets/eAshalogo.png";
import "./Navbar.css";
import { API_BASE_URL } from "../../../api-config";

const Navbar = () => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [expandedIds, setExpandedIds] = useState([]);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // --- Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  // --- Fetch doctor notifications
  useEffect(() => {
    const role = localStorage.getItem("role");
    const doctorId = localStorage.getItem("doctorId");
    if (!doctorId || !role) return;

    const fetchNotifications = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/notifications/${role}/${doctorId}`);
        const data = await res.json();
        if (res.ok && data.notifications) setNotifications(data.notifications);
        else console.error("Error fetching notifications:", data.message);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // every 30s
    return () => clearInterval(interval);
  }, []);

  // --- Unread count
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // --- Mark one as read
  const handleMarkRead = async (id) => {
    const role = localStorage.getItem("role");
    try {
      const res = await fetch(`${API_BASE_URL}/api/notifications/${id}/read?type=${role}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
        );
        setExpandedIds((prev) => [...prev, id]);
      } else {
        console.error("Error marking read:", data.message);
      }
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  // --- Mark all as read
  const handleMarkAllRead = async () => {
    const role = localStorage.getItem("role");
    const doctorId = localStorage.getItem("doctorId");
    if (!doctorId || !role) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/notifications/mark-all-read?type=${role}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctorId }),
      });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      }
    } catch (err) {
      console.error("Error marking all read:", err);
    }
  };

  const handleUserClick = () => navigate("/doctor/doctorprofile");

  return (
    <div className="fixed top-0 left-0 w-full h-16 flex items-center justify-between px-6 border-b border-[#F7F7F7] shadow-sm bg-white z-[100]">
      {/* Logo */}
      <img src={Logo} alt="Logo" className="w-16 h-auto" />

      {/* Icons */}
      <div className="flex items-center gap-4 mr-[40px]" style={{ position: "relative" }}>
        <div style={{ position: "relative" }} ref={dropdownRef}>
          <button className="p-1 border-none" onClick={() => setShowDropdown((p) => !p)}>
            <Bell className="w-6 h-6" />
          </button>

          {/* Unread Badge */}
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
  >
    {/* Header */}
    <div className="notification-header">
      <strong>Notifications</strong>
      <div className="notification-header-actions">
        <button onClick={handleMarkAllRead} className="mark-all-btn">
          Mark all as read
        </button>
        <span onClick={() => setShowDropdown(false)} className="close-icon">
          ✕
        </span>
      </div>
    </div>

    {/* Scrollable List */}
    <div className="notification-list">
      {notifications.length > 0 ? (
        notifications.map((note) => (
          <div
            key={note._id}
            className={`notification-item ${note.isRead ? "" : "unread"}`}
            onClick={() => handleMarkRead(note._id)}
          >
            <p>
              {expandedIds.includes(note._id) ? (
                <>
                  {note.message.text}{" "}
                  <span
                    onClick={() =>
                      setExpandedIds((prev) => prev.filter((id) => id !== note._id))
                    }
                    className="toggle-text"
                  >
                    less
                  </span>
                </>
              ) : note.message.text.length > 40 ? (
                <>
                  {note.message.text.slice(0, 40)}...
                  <span
                    onClick={() => handleMarkRead(note._id)}
                    className="toggle-text"
                  >
                    more
                  </span>
                </>
              ) : (
                note.message.text
              )}
            </p>
          </div>
        ))
      ) : (
        <p className="notification-empty">No notifications</p>
      )}
    </div>
  </div>
)}
        </div>

        {/* Profile Button */}
        <div
          onClick={handleUserClick}
          className="w-10 h-10 bg-[#00A99D] rounded-full flex items-center justify-center cursor-pointer"
        >
          <User className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
