import React, { useState, useEffect } from 'react';
import close from '../../assets/icons/close.svg';
import open from '../../assets/icons/open.svg';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import EventIcon from '@mui/icons-material/Event';
import MedicationIcon from '@mui/icons-material/Medication';
import ScienceIcon from '@mui/icons-material/Science';
import DescriptionIcon from '@mui/icons-material/Description';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 992);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const [selected, setSelected] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const isLabCards = location.pathname === '/lab';

  // --- Menu items
  const menuItems = [
    { icon: DashboardIcon, label: 'Dashboard', path: '/user/dashboard' },
    { icon: LocalHospitalIcon, label: 'Doctors', path: '/user/category' },
    { icon: EventIcon, label: 'Appointments', path: '/user/appointment' },
    { icon: ReceiptLongIcon, label: 'Receipt', path: '/user/receipts' },
    { icon: MedicationIcon, label: 'Medications', path: '/user/medication' },
    { icon: ScienceIcon, label: 'Lab', path: '/user/lab' },
    { icon: DescriptionIcon, label: "Reports & Scanning's", path: '/user/reportone' },
    { icon: LocalPharmacyIcon, label: 'Pharmacy', path: '/user/pharmacy' },
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
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
  const [vw, setVw] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // --- Breakpoints & widths
  const MOBILE_BP = 992;
  const LAPTOP_BP = 1200;

  let sidebarWidth;
  if (!isOpen) {
    sidebarWidth = '110px';
  } else if (isMobile) {
    sidebarWidth = '260px';
  } else if (vw <= LAPTOP_BP) {
    sidebarWidth = isLabCards ? '360px' : '257px';
  } else {
    sidebarWidth = isLabCards ? '360px' : '300px';
  }

  const sidebarWidthNum = parseInt(sidebarWidth || '250', 10) || 250;
  const activeLineLeft = isMobile
    ? '222px'
    : isOpen
      ? `${Math.max(41, sidebarWidthNum - 30)}px`
      : '41px';

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
            position: 'fixed',
            top: '76px',
            width: '100%',
            height: '100vh',
            backgroundColor: '#fff',
            opacity: 0.98,
            zIndex: 998,
          }}
        />
      )}

      {/* Sidebar */}
      {!isMobile && (
        <div
          className='sidebarwidth'
          style={{
            position: 'fixed',
            top: isMobile ? (isOpen ? '100px' : '0px') : '77px',
            left: isMobile ? (isOpen ? '0' : '-260px') : '0px',
            width: sidebarWidth,
            height: 'calc(100vh - 78px)',
            backgroundColor: '#fff',
            borderRight: '1px solid #eee',
            padding: isMobile ? (isOpen ? '25px' : '20px') : '40px 0px 0px 57px',
            transition: 'left 0.4s ease, width 0.4s ease',
            overflowX: 'hidden',
            zIndex: 999,
          }}
        >
          <ol className='list-unstyled m-0 mt-5'>
            {menuItems.map((item, index) => {
              const isSelected = selected === item.label;
              const Icon = item.icon;
              return (
                <li
                  key={index}
                  onClick={() => {
                    navigate(item.path);
                    setTimeout(() => setIsOpen(false), 5000);
                    if (isMobile) setIsOpen(false);
                  }}
                  className={`d-flex align-items-center mb-4 sidebar-item ${
                    isSelected ? 'sidebar-active' : ''
                  }`}
                  style={{ marginLeft: '8px', position: 'relative', cursor: 'pointer' }}
                >
                  {isSelected && (
                    <div
                      style={{
                        position: 'absolute',
                        left: activeLineLeft,
                        top: '-7px',
                        width: '4px',
                        height: '32px',
                        borderRadius: '2px',
                        backgroundColor: '#00A99D',
                      }}
                    />
                  )}
                  <Icon className='sidebar-icon' />
                  <span
                    className='sidebar-label'
                    style={{
                      marginLeft: '12px',
                      whiteSpace: 'nowrap',
                      opacity: isOpen ? 1 : 0,
                      width: isOpen ? 'auto' : 0,
                      overflow: 'hidden',
                      transition: 'opacity 0.4s ease, width 0.4s ease',
                    }}
                  >
                    {item.label}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={toggleSidebar}
        className='toggle-icon-btn'
        title={isOpen ? 'Collapse' : 'Expand'}
        style={{
          position: 'fixed',
          top: '100px',
          left: isMobile ? '29px' : '60px',
          background: 'transparent',
          border: 'none',
          padding: isMobile ? '11px 0px 0px 4px' : '0px',
          transition: 'left 0.4s ease',
          zIndex: 2000,
        }}
      >
        {isMobile ? (
          <></>
        ) : (
          // isOpen ? (
          //   <FiX size={24} color="#333" />
          // ) : (
          //   <FiMenu size={24} color="#333" />
          // )
          <img
            src={isOpen ? close : open}
            alt='Toggle Sidebar'
            style={{ width: '40px', height: '40px' }}
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
