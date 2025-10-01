import React, { useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Outlet, useNavigate } from "react-router-dom";

import locationIcon from "../../../assets/pharmacyicons/location.svg";
import searchIcon from "../../../assets/pharmacyicons/search.svg"
import microphoneIcon from "../../../assets/pharmacyicons/microphone.svg"
import uploadIcon from "../../../assets/pharmacyicons/Upload.svg"

import Medicines from "../../../assets/pharmacyicons/Medicines.png"
import PersonalCare from "../../../assets/pharmacyicons/PersonalCare.png"
import BabyMomCare from "../../../assets/pharmacyicons/Baby&MomCare.png";
import HealthDevices from "../../../assets/pharmacyicons/HealthDevices.png"
import AyurvedaHerbal from "../../../assets/pharmacyicons/Ayurved.png"
import Homeopathy from "../../../assets/pharmacyicons/Homeopathy.png"
import SexualWellness from "../../../assets/pharmacyicons/SexualWellness.png"
import ElderyCare from "../../../assets/pharmacyicons/ElderlyCare.png"

import subtract from "../../../assets/pharmacyicons/Subtract.png"
import subtract1 from "../../../assets/pharmacyicons/Subtract1.png";
import subtract2 from "../../../assets/pharmacyicons/Subtract2.png";
import subtract3 from "../../../assets/pharmacyicons/Subtract3.png"
import antibioticBottle from "../../../assets/pharmacyicons/antibiotic.png"
// import FiltersSidebar from "../filters/Filters";
import styles from "../../../pages/PharmacyPage//homesec/HomeSection.module.css"

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

  const fileInputRef = useRef(null); // ADD: ref to input

  const handleUploadClick = () => {
    fileInputRef.current.click(); // Open file dialog
  };
    const navigate = useNavigate();
const handleMedicineClick = () => {
  navigate("filter"); // relative to /pharmacy
};


  return (
    <>
    <div style={{overflowX:'hidden'}}>
    <div
      style={{
        marginLeft: "290px",
        marginTop: "53px",
        overflowX: "hidden",
        width: "calc(100%)",
        backgroundColor: "#ffffff",
        minHeight: "100vh",
      }}
      className={` ${styles.mainContainer}`}
    >
      {/* Light Blue Background Section (Full Width) */}
      <div
        style={{
          backgroundColor: "#EDFFFE",
          width: "100%",
          padding: "40px 0",
          overflowX: "hidden",
          height: "270px",
        }}
      >
        <div className="mb-4">
          <h1
            className="fw-bold"
            style={{ color: "#252525", padding: "0px 0px 0px 40px" }}
          >
            Take care of your health without hurting your wallet
          </h1>
          <p
            style={{
              fontSize: "24px",
              color: "#252525",
              padding: "0px 0px 0px 40px",
            }}
          >
            Compare price and save up 50%
          </p>
        </div>

        <div
          className={` ${styles.searchWrapper} d-flex flex-wrap gap-3`}
          style={{ padding: "0px 0px 0px 40px" }}

        >
          <div
            className={` ${styles.secSearchWrapper} d-flex align-items-center bg-transperent rounded-pill px-3`}
            style={{
              width: "100%",
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
            <img src={searchIcon} alt="Search" width="18" style={{ filter: "brightness(0) saturate(100%)" }} />

            <input
              type="text"
              className="form-control border-0 ms-2"
              placeholder="Search for"
              style={{
                fontSize: "18px",
                boxShadow: "none",
                backgroundColor: "transparent",
                border: "1px solid #8E8E8E",
              }}
            />
            <img src={microphoneIcon} alt="Mic" width="18" className="ms-2" />
          </div>

          <button
            className="btn rounded-pill px- fw-regular"
            style={{
              backgroundColor: "#00A99D",
              color: "#fff",
              width:'160px',
              height: "56px",
              marginLeft:"40px"
            }}
          >
            Search
          </button>
        </div>
      </div>

      {/* Category Icons */}
      <div className={`${styles.imgWrapper}  d-flex flex-wrap gap-1 mb-4 mt-4`}>
        {categories.map((cat, index) => (
          <div
            key={index}
            className={` d-flex flex-column align-items-center text-center`}
            style={{ marginLeft: "40px" }}
            onClick={handleMedicineClick}
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="mb-1 hover:cursor-pointer"
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

      {/* Upload Prescription Box */}
      <div className="w-100 px-0 mb-5" style={{ marginLeft: "40px" }}>
        <div
          className={` ${styles.fileUpload} d-flex justify-space-between align-items-center px-5 py-4 position-relative`}
          style={{
            width: "69%",
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

          {/* Left Text */}
          <div style={{ zIndex: 1 }}>
            <h6
              className="fw-bold mb-1"
              style={{
                color: "#00A99D",
                fontSize: "31px",
                marginBottom: "0.25rem",
              }}
            >
              Get 15% off
            </h6>
            <p
              className="mb-0 text-dark"
              style={{ fontSize: "18px", color: "" }}
            >
              Saving on meds starts with your prescription
            </p>
          </div>

          {/* Right Upload Button */}
          <button
            className="btn d-flex align-items-center gap-2 fw-regular px-5"
            style={{
              color: "#00A99D",
              backgroundColor: "transparent",
              border: "none",
              zIndex: 1,
              fontSize: "24px",
              marginLeft: "180px",
            }}
            onClick={handleUploadClick} // ADDED
          >
            <img src={uploadIcon} alt="upload" width="56" />
            Upload prescription
          </button>

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept=".pdf,.jpg,.jpeg,.png"
            multiple
          />
        </div>
      </div>

      {/* Trending Products */}
      <div className="mb-0 ms-5">
        <h4 className="fw-medium mb-4">Trending products</h4>
        <div className="d-flex flex-wrap gap-4">
          {trendingProducts.map((item, idx) => (
            <div
              key={idx}
              className="card border-0"
              style={{ width: "239px", borderRadius: "28px" }}
            >
              <img
                src={item.bg}
                alt={item.label}
                className="card-img-top"
                style={{
                  height: "176px",
                  objectFit: "cover",
                  borderTopLeftRadius: "0px",
                  borderTopRightRadius: "0px",
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
                    transform: "translate(87px, -48px)",
                  }}
                >
                  Add to cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Offer Section */}
      <div className="d-flex justify-content-between flex-wrap align-items-center">
        <div style={{ marginLeft: "150px" }}>
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

        <div className="d-flex justify-content-start flex-grow-1">
          <img
            src={antibioticBottle}
            alt="Bottle"
            style={{ width: "86%", height: "265px", objectFit: "contain" }}
          />
        </div>
      </div>
    </div>
   

      
    </div>
    {/* <Outlet/> */}
    </>
  );
}
