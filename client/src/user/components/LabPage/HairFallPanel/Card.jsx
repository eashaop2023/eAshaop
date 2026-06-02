import React from "react";
import brushImg from "../../../assets/confirmappointmenticons/Hairfall.png"
import Document from "../../../assets/panel/Document Text.svg"
import MostBooked from "../../../assets/confirmappointmenticons/range.png"
import { BsChevronRight } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
export default function HairFallPanel() {
  return (
    <>
      <style>
        {`
         @media (max-width: 768px) {
  .hairfall-container {
    margin-left: 0 !important;
    margin-top: 20px !important;
    padding: 10px !important;
    width: 100% !important;
    box-sizing: border-box;
  }

  .breadcrumb {
    flex-wrap: wrap;
    font-size: 14px !important;
    width: 100% !important;
    margin-bottom: 12px !important;
  }

  .test-card {
    flex-direction: column !important;
    width: 100% !important;
    height: auto !important;
    gap: 12px !important;
    padding: 0 !important;
  }

  .test-image img {
    width: 100% !important;
    height: 160px !important;  /* reduced from default 228px */
    object-fit: cover;         /* maintains aspect ratio while cropping */
    border-radius: 16px 16px 0 0 !important;
  }

  /* rest unchanged */
  .content-section {
    margin-left: 0 !important;
    margin-top: 0 !important;
    padding: 10px !important;
  }

  .price-button {
    flex-direction: column !important;
    align-items: flex-start !important;
    gap: 8px !important;
  }

  .price-button button {
    width: 100% !important;
    margin-right: 0 !important;
  }

  .price-button > div {
    font-size: 16px !important;
  }
}

        `}
      </style>

      <div className="hairfall-container" style={{ marginLeft: "400px", paddingTop: "110px" }}>
        {/* Breadcrumb */}
        <div
          className="breadcrumb"
          style={{
            display: "flex",
            alignItems: "center",
            fontFamily: "'Urbanist', sans-serif",
            fontSize: "16px",
            marginBottom: "16px",
            width: "1007px",
          }}
        >
          <span style={{ fontWeight: "400", fontSize: "18px", color: "#8E8E8E" }}>Tests</span>
          <span
            style={{
              color: "#00A99D",
              margin: "0 8px",
              fontWeight: "500",
            }}
          >
            &gt;
          </span>
          <span
            style={{
              color: "#00A99D",
              fontWeight: 400,
              textDecoration: "underline",
              cursor: "pointer",
              fontSize: "18px",
            }}
          >
            Hair Fall Panel
          </span>
        </div>

        {/* Test Card */}
        <div
          className="test-card"
          style={{
            width: "1007px",
            height: "253px",
            borderRadius: "16px",
            border: "1px solid #F7F7F7",
            fontFamily: "'Urbanist', sans-serif",
            display: "flex",
            gap: "24px",
            overflow: "hidden",
            paddingLeft: "0px",
          }}
        >
          {/* Image Section */}
          <div className="test-image" style={{ position: "relative" }}>
            <img
              src={brushImg}
              alt="Hair Fall Test"
              style={{
                width: "248px",
                height: "228px",
                borderRadius: "16px 0px 0px",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "6px",
                right: "8px",
                backgroundColor: "#f8f9fa",
                padding: "4px 8px",
                fontSize: "12px",
                borderBottomLeftRadius: "8px",
                color: "#6c757d",
              }}
            >
              15% OFF
            </div>
          </div>

          {/* Content Section */}
          <div
            className="content-section"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              flexGrow: 1,
              marginLeft: "30px",
              marginTop: "10px",
            }}
          >
            {/* Top */}
            <div>
              <h5 style={{ fontWeight: "700", marginBottom: "4px" }}>Hair Fall Panel</h5>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "13px",
                  marginBottom: "4px",
                  color: "#666",
                }}
              >
                <img
                  src={MostBooked}
                  alt="Most booked"
                  style={{
                    width: "40px",
                    height: "5px",
                    marginRight: "6px",
                  }}
                />
                Most booked
              </div>

              <div
                style={{
                  color: "#00A99D",
                  fontSize: "13px",
                  marginBottom: "5px",
                  textDecoration: "underline",
                }}
              >
                Maheshwari Lab
              </div>

              <div style={{ fontSize: "14px", color: "#252525" }}>
                <span style={{ fontWeight: "700", fontSize: "14px" }}>Tests included:</span>{" "}
                Liver Function Test (LFT), Smear for Malarial Parasite (MP),
                COVID-19 RT PCR &nbsp;
                <a href="#" style={{ color: "#013A63" }}>
                  28 Parameter(s) Covered
                </a>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "8px",
                  fontSize: "18px",
                  color: "#00A99D",
                }}
              >
                <img src={Document} alt="Doc" style={{ marginRight: "6px" }} />
                Reports in 15.0 Hrs
              </div>
            </div>

            {/* Bottom */}
            <div
              className="price-button"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div
                  style={{
                    textDecoration: "line-through",
                    fontSize: "14px",
                    color: "#999",
                  }}
                >
                  ₹282.00
                </div>
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: "400",
                    color: "#000000",
                  }}
                >
                  ₹253.80
                </div>
              </div>

              <button
                style={{
                  backgroundColor: "#00A99D",
                  color: "#fff",
                  border: "none",
                  borderRadius: "28px",
                  padding: "10px 30px",
                  fontSize: "14px",
                  fontWeight: 500,
                  cursor: "pointer",
                  marginRight: "10px",
                  width: "160px",
                  height: "44px",
                }}
              >
                Book slot
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
