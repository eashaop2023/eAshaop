import React from "react";
import brushImg from "../../../assets/confirmappointmenticons/Hairfall.png";
import Mostbooked from "../../../assets/confirmappointmenticons/range.png";
import { useNavigate } from "react-router-dom";

const data = new Array(8).fill({
  title: "Hair fall panel",
  lab: "Maheshwari lab",
  originalPrice: "$282.00",
  discountPrice: "$253.80",
  tests:
    "Liver Function Test (LFT), Smear for Malarial Parasite (MP), COVID -19 RT PCR",
  parameters: "28 Parameter(s) Covered",
  image: brushImg,
  discountLabel: "15% OFF",
});

export default function VerticalHealthCards() {
  return (
    <div style={{ overflowX: "hidden" }}>
      <div
        id="similar"
        className=" my-5"
        style={{
          fontFamily: "'Urbanist', sans-serif",
          maxWidth: "100%",
          overflowX: "hidden",
          marginRight: "auto",
          borderRadius: "16px",
        }}
      >
        {/* Heading */}
        <h4 className="mb-4 text-md-start">Similar Health Packages</h4>

        {/* Scrollable Wrapper */}
        <div
          className="scroll-wrapper"
          style={{
            overflowX: "auto",
            overscrollBehavior: "contain",
          }}
        >
          <div className="cards-container">
            {data.map((item, index) => (
              <div
                key={index}
                className="card border-0 shadow-sm rounded-4 health-card"
              >
                {/* Image */}
                <div className="position-relative">
                  <img
                    src={item.image}
                    className="w-100"
                    style={{ height: "131px", objectFit: "cover" }}
                    alt="Health test"
                  />
                  <span
                    className="position-absolute top-0 end-0 bg-light text-dark px-2 py-1"
                    style={{
                      fontSize: "12px",
                      borderBottomLeftRadius: "8px",
                      marginTop: "6px",
                      marginRight: "6px",
                      fontWeight: 500,
                    }}
                  >
                    {item.discountLabel}
                  </span>
                </div>

                {/* Content */}
                <div className="card-body d-flex flex-column">
                  <h6 className="fw-bold mb-2" style={{ fontSize: "16px" }}>
                    {item.title}
                  </h6>

                  <div
                    className="d-flex align-items-center mb-1"
                    style={{ fontSize: "14px", color: "#252525" }}
                  >
                    <img
                      src={Mostbooked}
                      alt="Most booked"
                      style={{
                        width: "40px",
                        height: "5px",
                        marginRight: "6px",
                      }}
                    />
                    Most booked
                  </div>

                  <a
                    href="#"
                    className="text-decoration-underline mb-2"
                    style={{ color: "#00A99D", fontSize: "13px" }}
                  >
                    {item.lab}
                  </a>

                  <p className="mb-2" style={{ fontSize: "14px" }}>
                    <strong>Tests included:</strong> {item.tests},{" "}
                    <a href="#" style={{ color: "#013A63" }}>
                      {item.parameters}
                    </a>
                  </p>

                  <hr
                    style={{
                      border: "1px solid #EEEEEE",
                      marginBottom: "1px",
                    }}
                  />

                  <div className="mt-auto">
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <del className="text-muted" style={{ fontSize: "14px" }}>
                        {item.originalPrice}
                      </del>
                      <span
                        style={{
                          fontSize: "16px",
                          fontWeight: 600,
                          color: "#00A99D",
                        }}
                      >
                        {item.discountPrice}
                      </span>
                    </div>

                    <button
                      className="btn"
                      style={{
                        backgroundColor: "#00A99D",
                        color: "white",
                        borderRadius: "999px",
                        fontWeight: 500,
                        fontSize: "14px",
                        width: "100%",
                        height: "40px",
                      }}
                    >
                      Book Slot
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Styles */}
        <style>
          {`
      #similar {
        margin-left: 400px;
        margin-right: auto;
        max-width: 100%;
        font-family: 'Urbanist', sans-serif;
        overflow-x: hidden;
        border-radius: 16px;
      }

      @media (max-width: 1024px) {
        #similar {
          maxwidth: "100% !important",
          overflowX: "hidden",
          // marginRight: "auto",
          marginLeft:20px,
          borderRadius: "16px",
        }
          .cards-container {
          gap: 0.8rem;
          max-width:100% !important
        }
          }

      @media (max-width: 768px) {
        #similar {
          margin-left: 0 !important;
          padding-left: 10px !important;
          padding-right: 10px !important;
          font-size: 12px;
        }
        .cards-container {
          gap: 0.8rem;
        }
        .health-card {
          width: calc(50% - 0.4rem);
        }
      }

      #similar > .scroll-wrapper::-webkit-scrollbar {
        display: none;
      }

      .cards-container {
        display: flex;
        flex-wrap: nowrap;
        gap: 1rem;
       
      }

      .health-card {
        height: 400px;
        flex: 0 0 auto;
        width: 289px;
      }

      @media (max-width: 768px) {
        .health-card img {
          object-fit: cover;
        }
      }
    `}
        </style>
      </div>
    </div>
  );
}
