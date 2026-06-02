import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Check from "../../../assets/pharmacyicons/checkmark.svg"

const KeyUses = () => {
  const uses = [
    {
      title: "Fever reduction",
      description: "Helps bring down high body temperature.",
    },
    {
      title: "Headache relief",
      description: "Effective for tension headaches and migraines.",
    },
    {
      title: "Body pain",
      description: "Relieves muscle aches, back pain, and joint discomfort.",
    },
    {
      title: "Toothache",
      description: "Reduces pain and inflammation from dental issues.",
    },
  ];

  return (
    <div id="uses">
      <style>
        {`
          @media (max-width: 768px) {
            #uses {
              margin-left: auto !important;
              margin-top:auto !important;
            }
            #uses h5 {
              font-size: 18px !important;
            }
            #uses strong {
              font-size: 18px !important;
            }
            #uses .text-muted {
              font-size: 14px !important;
            }
          }
        `}
      </style>

      <div
        className="container"
        style={{ marginTop: "40px",}}
      >
        <h5 style={{ fontWeight: "500px", fontSize: "24px", left: "20px",paddingTop:"60px",color:"#252525"}}>
          Key Uses
        </h5>
        <div className="rounded p-0">
          {uses.map((use, index) => (
            <div key={index} className="d-flex align-items-start p-3">
              <div className="me-3">
                <div
                  style={{
                    width: "58px",
                    height: "58px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img src={Check} alt="check" />
                </div>
              </div>
              <div>
                <strong style={{ fontSize: "24px", fontWeight: "500px" }}>
                  {use.title}
                </strong>
                <div
                  className="text-muted small"
                  style={{ fontSize: "18px", fontWeight: "400px" }}
                >
                  {use.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KeyUses;
