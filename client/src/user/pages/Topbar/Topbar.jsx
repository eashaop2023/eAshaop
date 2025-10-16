import React, { useEffect, useState } from 'react';
import logo from '../../assets/eAshalogo.png';
import dp from '../../assets/bookreading.png';
import notification from '../../assets/notification.svg'
import { useNavigate } from 'react-router-dom';
import styles from "../../pages/ProfilePage/Profile.module.css"
import {FiLogOut, FiMenu, FiX} from "react-icons/fi"
import { API_BASE_URL } from '../../../api-config';

const Topbar = ({ toggleSidebar: propToggleSidebar, isMobile: propIsMobile } = {}) => {
  const [calculatedIsMobile, setCalculatedIsMobile] = useState(window.innerWidth < 992);

  useEffect(() => {
    const handleResize = () => setCalculatedIsMobile(window.innerWidth < 992);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = propToggleSidebar;
  const isMobile = propIsMobile !== undefined ? propIsMobile : calculatedIsMobile;
  const [profileImage, setProfileImage] = useState(dp);

   useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.profileImage?.cloudinaryUrl) {
      setProfileImage(storedUser.profileImage.cloudinaryUrl);
    }
  }, []);


  const navigate = useNavigate();

  const handleClick = ()=>{
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
          <FiMenu
            size={24}
            style={{ cursor: "pointer", marginRight: '15px' }}
            onClick={toggleSidebar}
            title="Menu"
          />
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
          onClick={()=> {navigate('/')}}
        />
      </div>

      {/* Right: Notification + Bell + Profile Pic */}
      <div className="d-flex align-items-center ms-auto">

        <FiLogOut
        size={22}
        style={{ cursor: "pointer", color: "#dc3545",marginRight:'15px' }}
        onClick={handleLogout}
        title="Logout"
      />
        <img
          src={notification}
          alt="Notification"
          style={{ width: '22px', height: '22px', marginRight: '15px',cursor:"pointer" }}
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
