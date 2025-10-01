import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import Hairfall from "../../assets/confirmappointmenticons/Hairfall.png";
import SearchIcon from "../../assets/confirmappointmenticons/search.svg";
import Microphone from "../../assets/cardiologist/microphone.svg";
import { BsBorderLeft } from "react-icons/bs";  
import { useNavigate } from "react-router-dom";
import FilterIcon from "../../assets/filter-icon.svg";

import "./LabFirstPage.css"

export default function LabCardsComponent() {
  const [showAllLocations, setShowAllLocations] = useState(false);
  const [expandedFilter, setExpandedFilter] = useState({
    test: false,
    price: false,
    package: false,
  });
  const [showSidebar, setShowSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767.98);

  const sidebarRef = useRef(null);
  const filterBtnRef = useRef(null);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setShowSidebar((prev) => !prev);
  };

  const handleClick = () => navigate("/lab/panel");

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 767.98);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile && showSidebar) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobile, showSidebar]);

  const labs = Array(6).fill({
    title: "Hair fall panel",
    price: "$253.80",
    original: "$282.00",
    lab: "Maheshwari lab",
    tests:
      "Liver Function Test (LFT), Smear for Malarial Parasite (MP), COVID-19 RT PCR & 28 Parameter(s) Covered",
  });

  const allLocations = [
    "All Locations", "Nearby", "Begumpet", "Secunderabad", "Prakash nagar",
    "Ameerpet", "SR Nagar", "Champapet", "Santhosh Nagar"
  ];
  const topLocations = ["All Locations", "Nearby"];
  const otherLocations = allLocations.slice(3);
  const visibleLocations = showAllLocations
    ? otherLocations
    : otherLocations.slice(0, 3);

  const toggleFilter = (key) =>
    setExpandedFilter((prev) => ({ ...prev, [key]: !prev[key] }));

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showSidebar &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        filterBtnRef.current &&
        !filterBtnRef.current.contains(event.target)
      ) {
        setShowSidebar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSidebar]);

  return (
    <div style={{ overflowX: "hidden" }}>
      <div
        className="container-fluid"
        style={{ backgroundColor: "#fff", minHeight: "100vh", overflowX: "hidden" }}
      >

        <div
          className="d-lg-none position-fixed top-0 start-0 w-100 bg-white px-3 pt-1 pb-1"
          style={{ zIndex:1060 , marginTop: "77.9px" }}
        >
          <h2 className="fw-medium mb-1" style={{ marginLeft: "52px", padding: "28px 0px 0px 0px" }}>Lab</h2>
          <div className="d-flex align-items-center gap-2">
            <button
              ref={filterBtnRef}
              onClick={toggleSidebar}
              className="btn d-flex align-items-center gap-1 p-2"
              style={{ borderRadius: '28px', border: '1px solid #ccc' }}
            >
              <img src={FilterIcon} alt="Filter" width={18} />
              <span className="small">Filter</span>
            </button>
            <div className="flex-grow-1">
              <div className="d-flex align-items-center px-3 py-1" style={{ borderRadius: "28px", border: "1px solid #ccc" }}>
                <img src={SearchIcon} width={16} alt="search" className="me-2" />
                <input
                  type="text"
                  placeholder="Search"
                  className="form-control border-0 p-48"
                  style={{ fontSize: "0.9rem", lineHeight: "normal" }}
                />
                <img src={Microphone} width={14} alt="mic" className="ms-2" />
              </div>
            </div>
          </div>
        </div>

        <div className="row gx-0">
          {/* Sidebar */}
          {(showSidebar && isMobile) || !isMobile ? (
            <aside
              ref={sidebarRef}
              className={`col-lg-2 pt-4 ps-3 pe-2 sidebar ${showSidebar ? "show" : ""}`}
              style={{
                position: isMobile ? "fixed" : "relative",
                top: isMobile && showSidebar ? "160px" : isMobile ? "100px" : "80px",
                left: isMobile ? "0" : "",
                zIndex: isMobile ? 1050 : 1,
                width: isMobile ? "250px" : "",
                height: "100vh",
                backgroundColor: "#fff",
                transform: isMobile && !showSidebar ? "translateX(-100%)" : "translateX(0)",
                borderRight: "1px solid #F7F7F7",
                borderLeft: "1px solid #F7F7F7",
                overflowY: "auto",
                transition: "transform 0.3s ease-in-out",
              }}
            >
              <div className="mb-3 mt-2">
                {topLocations.map((loc) => (
                  <div key={loc} className="form-check fw-medium mb-4">
                    <input className="form-check-input" type="checkbox" id={loc} />
                    <label className="form-check-label" htmlFor={loc}>{loc}</label>
                  </div>
                ))}
              </div>

              <div className="mb-4">
                <div className="input-group border overflow-hidden" style={{ borderRadius: "38px" }}>
                  <span className="input-group-text bg-white border-0">
                    <img src={SearchIcon} width={16} alt="search" />
                  </span>
                  <input
                    type="text"
                    className="form-control border-0"
                    placeholder="Search"
                    style={{ backgroundColor: "#fff" }}
                  />
                </div>
              </div>

              <div className="mb-4">
                {visibleLocations.map((loc) => (
                  <div key={loc} className="form-check mb-4">
                    <input className="form-check-input" type="checkbox" id={loc} />
                    <label className="form-check-label" htmlFor={loc}>{loc}</label>
                  </div>
                ))}
                {otherLocations.length > 2 && (
                  <button
                    className="btn btn-link p-0"
                    style={{ color: "#00A99D" }}
                    onClick={() => setShowAllLocations(!showAllLocations)}
                  >
                    {showAllLocations ? "See less..." : "See more..."}
                  </button>
                )}
              </div>

              {[{ label: "Test type", key: "test", options: ["Blood Test", "Urine Test", "X-Ray"] },
                { label: "Prices", key: "price", options: ["Below $100", "$100 - $200", "$200+"] },
                { label: "Health Packages", key: "package", options: ["Basic Health", "Advanced", "Women's Health"] },
              ].map(({ label, key, options }) => (
                <div className="mb-4" key={key}>
                  <div className="d-flex justify-content-between align-items-center" onClick={() => toggleFilter(key)} style={{ cursor: "pointer" }}>
                    <h6 className="fw-medium mb-3">{label}</h6>
                    {expandedFilter[key] ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
                  </div>
                  {expandedFilter[key] &&
                    options.map((option, i) => (
                      <div key={i} className="form-check">
                        <input className="form-check-input" type="checkbox" id={`${key}-${i}`} />
                        <label className="form-check-label" htmlFor={`${key}-${i}`}>{option}</label>
                      </div>
                    ))}
                </div>
              ))}
            </aside>
          ) : null}

          {/* Main Content */}
          <main
  className="col-lg-10 pt-4 px-4"
  style={{
    marginLeft: isMobile ? '0' : '350px',
    marginTop: isMobile ? '140px' : '86px', // ⬅ increased for mobile
    marginBottom: "50px"
  }}
>
            <div className="w-[1160px] d-flex align-items-center justify-content-between mb-4 flex-wrap">
              <h2 className="mb-3 me-3 fw-medium d-none d-lg-block" style={{ lineHeight: "120%" }}>
                Lab
              </h2>
              <div className="d-none d-lg-block"
                style={{
                  maxWidth: "535px",
                  height: "48px",
                  flexGrow: 1,
                  minWidth: "300px",
                  marginRight: "65px",
                }}
              >
                <div
                  className="d-flex align-items-center h-100 px-3"
                  style={{
                    borderRadius: "28px",
                    backgroundColor: "#fff",
                    border: "1px solid #F7F7F7",
                  }}
                >
                  <img src={SearchIcon} width={18} alt="search" style={{ marginRight: "20px", opacity: 0.6 }} />
                  <input
                    type="text"
                    className="flex-grow-1 border-0 bg-transparent p-0"
                    placeholder="Search tests by Alphabets, Speciality, Conditions"
                    style={{ fontSize: "0.9rem", outline: "none", lineHeight: "normal" }}
                  />
                  <img src={Microphone} width={16} alt="microphone" style={{ marginLeft: "10px", opacity: 0.6 }} />
                </div>
              </div>
            </div>

            {/* Cards */}
            <div className="row g-5">
              {labs.map((lab, idx) => (
                <div key={idx} className="col-12 col-md-6 col-lg-4" style={{ maxWidth: '380px' }}>
                  <div className="card h-100 position-relative rounded-4">
                    <span className="position-absolute top-0 end-0 text-dark small fw-medium" style={{ backgroundColor: "#F7F7F7", borderRadius: "4px 0px 0px 4px", padding: "4px 20px", marginTop: "30px", fontSize: "0.8rem" }}>
                      15% OFF
                    </span>
                    <img
                      src={Hairfall}
                      alt="lab"
                      className="w-100"
                      style={{ borderTopLeftRadius: "1rem", borderTopRightRadius: "1rem", objectFit: "cover", height: "120%" }}
                    />
                    <div className="card-body px-3">
                      <h4 className="card-title mb-1 fw-medium">{lab.title}</h4>
                      <div className="d-flex align-items-center mb-2">
                        <div style={{ width: "50px", height: "7px", borderRadius: "999px", background: "linear-gradient(to right, #00A99D 70%, #F5F5F5 40%)", marginRight: "8px" }}></div>
                        <p className="text-#252525 small m-0">Most booked</p>
                      </div>
                      <p className="fw-regular mb-2" style={{ color: "#00A99D", fontSize: "14px", textDecoration: "underline" }}>{lab.lab}</p>
                      <p className="small mb-3 lh-sm lab-tests-text">
                        <strong>Tests included:</strong> {lab.tests.split("28 Parameter(s) Covered")[0]}
                        <span style={{ color: "#013A63", textDecoration: "underline", fontSize: "13px" }}>28 Parameter(s) Covered</span>
                      </p>
                      <div className="d-flex align-items-center mb-3">
                        <small className="text-decoration-line-through text-muted me-2">{lab.original}</small>
                        <span className="fw-semibold" style={{ color: "#00A99D", fontSize: "18px" }}>{lab.price}</span>
                      </div>
                      <button className="btn w-100 text-white" style={{ background: "#00B4A8", borderRadius: "20px" }} onClick={handleClick}>
                        Book slot
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
