import React from "react";

export default function TestDetailsTable() {
  return (
    <>
      <style>
        {`
          @media (max-width: 768px) {
            .test-details-container {
              flex-direction: row !important; /* Keep side by side */
              margin-left: 0 !important;
              padding: 10px !important;
              width: 100% !important;
           
            }
            .test-details-labels {
              width: 200px !important; /* Keep same width as desktop */
              padding-right: 24px !important;
              font-size: 16px !important;
            }
            .test-details-values {
              width: calc(100% - 200px) !important;
              font-size: 16px !important;
            }
            .test-details-values ul {
              padding-left: 1rem !important;
              margin-bottom: 0 !important;
            }
          }
        `}
      </style>

      <div
        className="d-flex test-details-container"
        style={{
          marginLeft: "400px",
          fontFamily: "'Urbanist', sans-serif",
          fontSize: "14px",
          lineHeight: "1.6",
          marginTop: "50px",
        }}
      >
        {/* Left Column - Labels */}
        <div
          className="d-flex flex-column test-details-labels"
          style={{
            width: "200px",
            fontWeight: 500,
            color: "#003B73",
            paddingRight: "24px",
            fontSize: "18px",
          }}
        >
          <div>Sample Type</div>
          <div className="mt-3">Tube Type</div>
          <div className="mt-3">Fasting Required</div>
          <div className="mt-3">Package Includes</div>
        </div>

        {/* Right Column - Values */}
        <div
          className="d-flex flex-column test-details-values"
          style={{
            color: "#494949",
            fontSize: "18px",
          }}
        >
          <div>Blood, Urine</div>
          <div className="mt-3">Serum, EDTA, Fluoride, Urine container</div>
          <div className="mt-3">8–10 Hrs</div>
          <div className="mt-3">
            <ul style={{ paddingLeft: "1rem", marginBottom: 0 }}>
              <li>Fasting Blood Sugar (FBS) Test</li>
              <li>Chloride (Cl) Test</li>
              <li>
                HbA1c (Glycosylated Hemoglobin) Test{" "}
                <span style={{ color: "#00A99D", cursor: "pointer" }}>
                  Show more...
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
