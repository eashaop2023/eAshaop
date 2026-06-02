import React, { useState,useEffect } from "react";
import {   FiChevronUp } from "react-icons/fi";
// import Star from '../../../assets/Star.png';
import Star from '../../../assets/icons/star.png'
// import Search from '../../../assets/search-normal.png';
import Search from '../../../assets/confirmappointmenticons/search.svg'
import Arrowdown from '../../../assets/arrow-down.svg';
import './Sidebar.css';
import "bootstrap/dist/css/bootstrap.min.css";

const Sidebar = ({ selectedFilters, setSelectedFilters,isOpen,onClose }) => {
  const [filterLocation, setFilterLocation] = useState("");
  const [openFilter, setOpenFilter] = useState([]);
  const [showAllLocations, setShowAllLocations] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1023);


  const allLocations = [
    "Begumpet", "Secunderabad", "Prakash nagar", "Ameerpet", "SR Nagar",
    "Madhapur", "Gachibowli", "Kukatpally", "Banjara Hills", "Jubilee Hills"
  ];

  const toggleFilter = (section) => {
    setOpenFilter((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };


  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 1023);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);



  const handleFilterChange = (category, value) => {
    setSelectedFilters((prev) => {
      const updated = prev[category].includes(value)
        ? prev[category].filter((v) => v !== value)
        : [...prev[category], value];
      return { ...prev, [category]: updated };
    });
  };

  return (
    <>
      <style>{`
        .custom-checkbox {
          appearance: none;
          width: 24px;
          height: 24px;
          border: 1px solid #F7F7F7;
          border-radius: 6px;
          background-color: white;
          cursor: pointer;
          position: relative;
        }
        .custom-checkbox:checked {
          background-color: #00A99D;
          border-color: #00A99D;
        }
        .custom-checkbox:checked::after {
          content: '✔';
          color: white !important;
          font-size: 10px;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }

        .hide-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
          
      `}</style>

       {/* <button
        className="btn btn-light d-md-none position-fixed top-0 start-0 m-2"
        onClick={() => setIsOpen(!isOpen)}
        style={{ zIndex: 1100 }}
      >
        ☰
      </button> */}

      <div
  className={` sidebar-container p-3 bg-white border-end position-fixed start-0 overflow-auto hide-scrollbar d-block
        ${isOpen ? "open" : ""}`}
  style={{
  width: "360px",
  overflowY: "auto",
  top: "75px",                // Match navbar height
 height: "calc(100vh - 75px)" // Fill remaining screen
}}
>

  {isMobile && (
  <button
    onClick={onClose}
    style={{
      background: "transparent",
      border: "none",
      fontSize: "1.5rem",
      position: "absolute",
      top: "10px",
      right: "10px",
      cursor: "pointer",
      zIndex: 1200,
    }}
    aria-label="Close sidebar"
  >
    ×
  </button>
)}



        {/* All Locations and Nearby */}
        <div className="mb-2">
          {["All Locations", "Nearby"].map((option) => (
            <div className="d-flex align-items-center mb-4" key={option}>
              <input
                type="checkbox"
                id={option}
                className="custom-checkbox me-2"
                checked={selectedFilters.general.includes(option)}
                onChange={() => handleFilterChange("general", option)}
              />
              <label htmlFor={option} className="fw-medium mb-0" style={{ fontSize: "1.12rem" }}>
                {option}
              </label>
            </div>
          ))}
        </div>
        <hr style={{color:' #ada8a8ff'}} />

        {/* Location Search */}
        <div className="mb-4 position-relative">
          <img src={Search}
            style={{
              position: "absolute",
              top: "50%",
              left: "10px",
              transform: "translateY(-50%)",
              color: "#aaa",
              pointerEvents: "none",
              width: "24px",
              height: "24px",
            }}
          />
          <input
            type="text"
            placeholder="Search"
            className="form-control mb-2"
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
            style={{
              paddingLeft: "40px",
              color: "#8E8E8E",
              borderRadius: "16px",
              border: "1px solid #F7F7F7",
              outline: "none",
              boxShadow: "none",
            }}
          />
        </div>

        <ul className="list-unstyled">
          {(showAllLocations ? allLocations : allLocations.slice(0, 5))
            .filter((loc) => loc.toLowerCase().includes(filterLocation.toLowerCase()))
            .map((loc) => (
              <li key={loc} className="d-flex align-items-center mb-4">
                <input
                  type="checkbox"
                  id={loc}
                  className="me-2 custom-checkbox"
                  checked={selectedFilters.locations.includes(loc)}
                  onChange={() => handleFilterChange("locations", loc)}
                />
                <label htmlFor={loc} style={{ fontSize: "1.12rem", marginBottom: 0 }}>
                  {loc}
                </label>
              </li>
            ))}
        </ul>

        <button
          onClick={() => setShowAllLocations((prev) => !prev)}
          className="btn btn-link p-0 mb-4 text-decoration-none"
          style={{ color: "#00A99D", fontSize: "1.12rem" }}
        >
          {showAllLocations ? "See less..." : "See more..."}
        </button>

        {/* Other Filters */}
        {["fee", "gender", "language", "rating"].map((section) => (
          <div key={section}>
            <p
              className="d-flex justify-content-between align-items-center mb-4 fw-medium"
              onClick={() => toggleFilter(section)}
              style={{ cursor: "pointer",fontSize:'1.12rem' }}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
              {openFilter.includes(section) ? (
                <FiChevronUp style={{ width: "24px", height: "24px",color:'#252525' }} />
              ) : (
                <img src={Arrowdown} height={7} width={16} style={{ fill:'#252525' }} />

              )}
            </p>

            {openFilter.includes(section) && (
              <ul className="list-unstyled ms-4">
                {(
                  section === "fee"
                    ? ["Under ₹500 ", "₹500 - ₹600", "₹600 - ₹800", "₹800 - ₹1000", "Above ₹1000"]
                    : section === "gender"
                    ? ["Male", "Female"]
                    : section === "language"
                    ? ["Telugu", "English"]
                    : ["5", "4", "3"]
                ).map((value) => (
                  <li key={value} className="d-flex align-items-center mb-4" style={{ fontSize: "1.12rem" }}>
                    <input
                      type="checkbox"
                      className="me-2 custom-checkbox"
                      checked={
                        section === "rating"
                          ? selectedFilters[section].includes(`★${value}`)
                          : selectedFilters[section].includes(value)
                      }
                      onChange={() =>
                        handleFilterChange(section, section === "rating" ? `★${value}` : value)
                      }
                    />
                    {section === "rating" && (<img src={Star} size={16} style={{ color:"#00A99D"}} className="me-2" />)}
                    {value}
                  </li>
                ))}
              </ul>
            )}
            <hr style={{color:' #ada8a8ff'}} />
          </div>
        ))}
      </div>
    </>
  );
};

export default Sidebar;
