import React from "react";

export default function TestProcess() {
  const steps = [1, 2, 3, 4];

  return (
    <div
      id="process"
      style={{
        width: "1007px",
        marginLeft: "400px",
        fontFamily: "'Urbanist', sans-serif",
        color: "#333",
        marginBottom: "50px",
        marginTop: "10px",
      }}
    >
      <style>
        {`
          @media (max-width: 768px) {
            #process {
              width: 100% !important;
              margin-left: 0 !important;
              padding: 0 10px;
              font-size:14px !important;
            }
            #process .steps-container {
              flex-wrap: wrap !important;
            }
            #process .step-card {
              flex: 0 0 calc(50% - 8px) !important;
              margin-bottom: 16px;
            }
          }
        `}
      </style>

      <h6
        style={{
          fontWeight: 500,
          marginBottom: "24px",
          fontSize: "24px",
          color: "#252525",
        }}
      >
        Test Process
      </h6>

      <div className="steps-container" style={{ display: "flex", gap: "16px" }}>
        {steps.map((step, index) => (
          <div
            key={index}
            className="step-card"
            style={{
              flex: 1,
              border: "1px solid #F7F7F7",
              borderRadius: "16px",
              padding: "20px",
              backgroundColor: "#fff",
              width: "239.75px",
              height: "184px",
            }}
          >
            <div
              style={{
                color: "#00A99D",
                fontSize: "16px",
                fontWeight: 500,
                marginBottom: "10px",
              }}
            >
              {step}
            </div>
            <div
              style={{
                fontWeight: 700,
                marginBottom: "6px",
                color: "#252525",
                fontSize: "18px",
              }}
            >
              Vaccinated Phlebotomists
            </div>
            <div
              style={{
                color: "#494949",
                fontSize: "18px",
                fontWeight: "400px",
              }}
            >
              Only vaccinated phlebos are assigned orders
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
