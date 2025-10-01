import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Circle from "../../../assets/pharmacyicons/circle.svg"

const InfoSection = () => {
  const safetyInfo = [
    "Do not exceed the recommended dose — taking too much can cause serious liver damage.",
    "Avoid using with other medications that contain paracetamol/acetaminophen to prevent overdose.",
    "Consult your doctor before use if you have liver disease, alcohol dependency, or are pregnant or breastfeeding.",
    "Store the medicine in a cool, dry place, away from direct sunlight and out of reach of children.",
    "If you experience symptoms like skin rash, swelling, or difficulty breathing, stop using and seek medical help immediately — these could be signs of an allergic reaction.",
    "Do not take this medicine for more than 3 days for fever or 5 days for pain without medical advice.",
    "Avoid alcohol while taking paracetamol, as it may increase the risk of liver damage.",
  ];

  const renderBullet = () => (
    <img
      src={Circle}
      alt="bullet"
      style={{ width: "10px", height: "10px", marginTop: "9px" }}
    />
  );

  return (
    <>
      <style>
        {`
          @media (max-width: 768px) {
            #howtouse {
              margin-left: 20px !important;
            }
            #howtouse h5 {
              font-size: 18px !important;
            }
            #howtouse span {
              font-size: 14px !important;
            }
          }
        `}
      </style>

      <div id="howtouse">
        <div className="container mt-4" style={{  }}>
          <h5 style={{ fontWeight: 500, fontSize: "24px",color:"#252525" }}>How to Use</h5>
          <div className="d-flex align-items-start mb-4" style={{ gap: "10px" }}>
            {renderBullet()}
            <span style={{ fontSize: "18px", color: "#494949" }}>
              use it as Directed by Physicians
            </span>
          </div>

          <h5 style={{ fontWeight: 500, fontSize: "24px" }}>Safety Information</h5>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {safetyInfo.map((item, index) => (
              <div key={index} className="d-flex align-items-start" style={{ gap: "10px" }}>
                {renderBullet()}
                <span style={{ fontSize: "18px", color: "#494949" }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default InfoSection;
