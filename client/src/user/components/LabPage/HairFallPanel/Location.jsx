import React from "react";
import mapImg from "../../../assets/panel/Maps.jpg"; 

export default function LabLocationCard() {
  return (
    <div
      className="lab-container d-flex"
      style={{
        width: "1007px",
        marginLeft: "400px",
        fontFamily: "'Urbanist', sans-serif",
        gap: "16px",
        alignItems: "flex-start",
        marginTop: "50px",
        marginBottom: "50px",
      }}
    >
      <style>
        {`
          /* Tablet view (<1024px) */
          @media (max-width: 1023px) {
            .lab-container {
              width: auto !important;
              margin-left: 0 !important;
              padding: 0 16px;
            }
            .lab-right img {
              width: 100% !important;
              height: auto !important;
            }
          }

          /* Mobile view (≤768px) */
          @media (max-width: 768px) {
            .lab-container {
              flex-direction: row !important;
              gap: 0px !important;
              
              
            }
            .lab-left {
              width: 176px !important;
              height: 155px !important;
              font-size:0.8px !important;
            }
            .lab-right img {
              width: 192px !important;
              height: 172px !important;
              border-radius: 8px !important;
            }
          }
        `}
      </style>

      {/* Left Side - Text */}
      <div className="lab-left" style={{ flex: 1 }}>
        <h6
          style={{
            fontWeight: "500",
            marginBottom: "8px",
            color: "#252525",
            fontSize: "24px",
          }}
        >
          Maheshwari lab
        </h6>
        <div style={{ fontSize: "18px", color: "#8E8E8E" }}>
          1-8-31/1, Minister Road Krishna Nagar Colony, Ramgopalpet, Begumpet,
          <br />
          Secunderabad, Telangana 500003
        </div>
        <div
          style={{
            fontSize: "18px",
            marginTop: "12px",
            color: "#8E8E8E",
          }}
        >
          4.5 km | 24min
        </div>
      </div>

      {/* Right Side - Map */}
      <div className="lab-right">
        <img
          src={mapImg}
          alt="Map"
          style={{
            width: "624px",
            height: "144px",
            borderRadius: "12px",
            objectFit: "cover",
          }}
        />
      </div>
    </div>
  );
}

