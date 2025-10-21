import React, { useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Outlet, useNavigate } from "react-router-dom";

import locationIcon from "../../../assets/pharmacyicons/location.svg";
import searchIcon from "../../../assets/pharmacyicons/search.svg";
import microphoneIcon from "../../../assets/pharmacyicons/microphone.svg";
import uploadIcon from "../../../assets/pharmacyicons/Upload.svg";

import Medicines from "../../../assets/pharmacyicons/Medicines.png";
import PersonalCare from "../../../assets/pharmacyicons/PersonalCare.png";
import BabyMomCare from "../../../assets/pharmacyicons/Baby&Momcare.png";
import HealthDevices from "../../../assets/pharmacyicons/HealthDevices.png";
import AyurvedaHerbal from "../../../assets/pharmacyicons/Ayurved.png";
import Homeopathy from "../../../assets/pharmacyicons/Homeopathy.png";
import SexualWellness from "../../../assets/pharmacyicons/SexualWellness.png";
import ElderyCare from "../../../assets/pharmacyicons/ElderlyCare.png";

import subtract from "../../../assets/pharmacyicons/Subtract.png";
import subtract1 from "../../../assets/pharmacyicons/Subtract1.png";
import subtract2 from "../../../assets/pharmacyicons/Subtract2.png";
import subtract3 from "../../../assets/pharmacyicons/Subtract3.png";
import antibioticBottle from "../../../assets/pharmacyicons/antibiotic.png";

import styles from "../../../pages/PharmacyPage/homesec/HomeSection.module.css";

const categories = [
  { name: "Medicines", image: Medicines },
  { name: "Personal Care", image: PersonalCare },
  { name: "Baby & Mom Care", image: BabyMomCare },
  { name: "Health Devices", image: HealthDevices },
  { name: "Ayurveda & Herbal", image: AyurvedaHerbal },
  { name: "Homeopathy", image: Homeopathy },
  { name: "Sexual Wellness", image: SexualWellness },
  { name: "Elderly Care", image: ElderyCare },
];

const trendingProducts = [
  { bg: subtract, label: "gentle cleansing & face TLC" },
  { bg: subtract1, label: "protein booster" },
  { bg: subtract2, label: "health juice" },
  { bg: subtract3, label: "combo pack" },
];

export default function HomeSection() {
  const [selectedLocation, setSelectedLocation] = useState("503001, Nizamabad");
  const locations = [
    "503001, Nizamabad",
    "500097, Rangareddy",
    "500001, Hyderabad",
  ];

  const fileInputRef = useRef(null);
  const handleUploadClick = () => fileInputRef.current.click();
  const navigate = useNavigate();
  const handleMedicineClick = () => navigate("filter");

  return (
    <>
      <div style={{ overflowX: "hidden" }}>
        <div
          className={`${styles.mainContainer}`}
          style={{
            marginTop: "53px",
            overflowX: "hidden",
            backgroundColor: "#ffffff",
            minHeight: "100vh",
          }}
        >
          {/* Hero Section */}
          <div
            style={{
              backgroundColor: "#EDFFFE",
              width: "100%",
              padding: "40px 0",
              overflowX: "hidden",
              height: "auto",
            }}
          >
            <div className="container">
              <h1 className="fw-bold text-dark">
                Take care of your health without hurting your wallet
              </h1>
              <p style={{ fontSize: "24px", color: "#252525" }}>
                Compare price and save up 50%
              </p>

              <div
                className={`d-flex flex-column flex-lg-row align-items-start align-items-lg-center gap-3 ${styles.searchWrapper}`}
              >
                <div
                  className={`d-flex align-items-center bg-transparent rounded-pill px-3 flex-grow-1 ${styles.secSearchWrapper}`}
                  style={{
                    maxWidth: "950px",
                    border: "1px solid #8E8E8E",
                    height: "56px",
                  }}
                >
                  <img src={locationIcon} alt="Location" width="18" />
                  <div className="dropdown ms-2">
                    <button
                      className="btn btn-sm dropdown-toggle fw-medium"
                      style={{
                        fontSize: "18px",
                        color: "#00A99D",
                        background: "transparent",
                        border: "none",
                        padding: 0,
                      }}
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {selectedLocation.split(",")[0]},
                      <span style={{ color: "#00A99D" }}>
                        {" "}
                        {selectedLocation.split(",")[1]}
                      </span>
                    </button>
                    <ul className="dropdown-menu">
                      {locations.map((loc, index) => (
                        <li key={index}>
                          <button
                            className="dropdown-item"
                            style={{ color: "#00A99D", fontSize: "18px" }}
                            onClick={() => setSelectedLocation(loc)}
                          >
                            {loc.split(",")[0]},
                            <span style={{ color: "#00A99D" }}>
                              {" "}
                              {loc.split(",")[1]}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <span className="mx-2">|</span>
                  <img
                    src={searchIcon}
                    alt="Search"
                    width="18"
                    style={{ filter: "brightness(0) saturate(100%)" }}
                  />
                  <input
                    type="text"
                    className="form-control border-0 ms-2"
                    placeholder="Search for"
                    style={{
                      fontSize: "18px",
                      boxShadow: "none",
                      backgroundColor: "transparent",
                    }}
                  />
                  <img
                    src={microphoneIcon}
                    alt="Mic"
                    width="18"
                    className="ms-2"
                  />
                </div>

                <button
                  className="btn rounded-pill fw-regular"
                  style={{
                    backgroundColor: "#00A99D",
                    color: "#fff",
                    width: "160px",
                    height: "56px",
                  }}
                >
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="container mt-4 mb-4">
            <div className="row justify-content-start g-3">
              {categories.map((cat, index) => (
                <div
                  key={index}
                  className="col-4 col-sm-3 col-md-2 text-center"
                  onClick={handleMedicineClick}
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="mb-1"
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "cover",
                    }}
                  />
                  <p className="small fw-regular mb-0">{cat.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Upload Prescription */}
          <div className="container mb-5">
            <div className="row justify-content-center">
              <div className="col-12 col-md-10">
                <div
                  className={`d-flex flex-column flex-md-row align-items-center justify-content-between px-5 py-4 position-relative ${styles.fileUpload}`}
                  style={{
                    border: "2px dashed #00A99D",
                    borderRadius: "28px",
                    backgroundColor: "#fff",
                  }}
                >
                  <div
                    style={{
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      height: "100%",
                      width: "50%",
                      background: "#F7F7F7",
                      clipPath: "polygon(0 0, 76% 0, 100% 100%, 0% 100%)",
                      zIndex: 0,
                      borderTopLeftRadius: "28px",
                      borderBottomLeftRadius: "28px",
                    }}
                  ></div>

                  <div style={{ zIndex: 1 }}>
                    <h6 className="fw-bold mb-1" style={{ color: "#00A99D", fontSize: "31px" }}>
                      Get 15% off
                    </h6>
                    <p className="mb-0 text-dark" style={{ fontSize: "18px" }}>
                      Saving on meds starts with your prescription
                    </p>
                  </div>

                  <button
                    className="btn d-flex align-items-center gap-2 fw-regular px-5 mt-3 mt-md-0"
                    style={{
                      color: "#00A99D",
                      backgroundColor: "transparent",
                      border: "none",
                      zIndex: 1,
                      fontSize: "24px",
                    }}
                    onClick={handleUploadClick}
                  >
                    <img src={uploadIcon} alt="upload" width="56" />
                    Upload prescription
                  </button>

                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    accept=".pdf,.jpg,.jpeg,.png"
                    multiple
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Trending Products */}
          <div className="container mb-5">
            <h4 className="fw-medium mb-4">Trending products</h4>
            <div className="row g-4">
              {trendingProducts.map((item, idx) => (
                <div key={idx} className="col-6 col-md-3">
                  <div className="card border-0" style={{ borderRadius: "28px" }}>
                    <img
                      src={item.bg}
                      alt={item.label}
                      className="card-img-top"
                      style={{
                        height: "176px",
                        objectFit: "cover",
                      }}
                    />
                    <div className="card-body text-center py-2">
                      <button
                        className="btn d-flex justify-content-center align-items-center gap-2"
                        style={{
                          width: "135px",
                          height: "40px",
                          fontSize: "14px",
                          fontWeight: "400",
                          backgroundColor: "#00A99D",
                          color: "#fff",
                          padding: "10px 24px",
                          borderRadius: "28px",
                          transform: "translateY(-48px)",
                        }}
                      >
                        Add to cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Offer Section */}
          <div className="container mb-5">
            <div className="row align-items-center">
              <div className="col-md-6 text-center text-md-start mb-4 mb-md-0">
                <h4 className="text-dark mb-2 fw-normal">
                  Our Prices Dropped Harder Than Your Fever
                </h4>
                <h1 className="fw-bold" style={{ color: "#00A99D" }}>50% OFF!</h1>
                <p style={{ fontSize: "15px" }}>
                  <del className="text-muted" style={{ fontSize: "22px" }}>₹ 500</del>{" "}
                  <span className="fw-bold text-dark" style={{ fontSize: "24px" }}>₹ 250</span>
                  <span className="fw-normal text-dark ms-3" style={{ fontSize: "24px" }}>Including tax</span>
                </p>
                <button
                  className="btn rounded-pill px-4"
                  style={{ backgroundColor: "#00A99D", color: "#fff" }}
                >
                  Buy now
                </button>
              </div>

              <div className="col-md-6 text-center">
                <img
                  src={antibioticBottle}
                  alt="Bottle"
                  className="img-fluid"
                  style={{ maxHeight: "265px" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
