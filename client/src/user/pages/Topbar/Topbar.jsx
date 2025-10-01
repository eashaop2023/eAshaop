import React, { useEffect, useState } from 'react';
import logo from '../../assets/eAshalogo.png';
import dp from '../../assets/bookreading.png';
import notification from '../../assets/notification.svg'
import { useNavigate } from 'react-router-dom';
import styles from "../../pages/ProfilePage/Profile.module.css"

const Topbar = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    handleResize(); // Check on mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navigate = useNavigate();

  const handleClick = ()=>{
    navigate('profile')
  }

  return (
    <div
      className={` ${styles.topBarContainer}  w-100 d-flex justify-content-between align-items-center px-3 px-lg-4 py-2 border-bottom bg-white`}
      style={{ border: '1px solid #F7F7F7', position: 'fixed', zIndex: 1050 }}
    >
      {/* Left: Logo */}
      <div
        className="d-flex align-items-center"
        style={{
          marginLeft: isMobile ? '16px' : '25px',
        }}
      >
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
        <img
          src={notification}
          alt="Notification"
          style={{ width: '22px', height: '22px', marginRight: '15px',cursor:"pointer" }}
        />
        <i className="bi bi-bell fs-5 me-3"></i>
        <img
          src={dp}
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
