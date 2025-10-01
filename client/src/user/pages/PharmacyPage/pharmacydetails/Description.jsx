
import React from "react";

export default function AboutTest() {
  return (
    <>
      <style>
        {`
          /* Tablet adjustments */
          @media (max-width: 1024px) {
            #Description {
              width: 90% !important;
              margin-left: auto !important;
              margin-right: auto !important;
              height: auto !important;
            }
            #Description h6 {
              font-size: 20px !important;
            }
            #Description p {
              font-size: 16px !important;
            }
          }

          /* Mobile adjustments */
          @media (max-width: 768px) {
            #Description {
              width: 95% !important;
              margin-left: 20px !important;
              margin-right: auto !important;
              height: auto !important;
              justify-content: center !important;
            }
            #Description h6 {
              font-size: 18px !important;
            }
            #Description p {
              font-size: 14px !important;
              line-height: 1.6 !important;
            }
          }
        `}
      </style>

      <div
        id="Description"
        style={{
          width: "1360px",
          height: "240px",
          fontFamily: "'Urbanist', sans-serif",
          color: "#333",
          fontSize: "14px",
          lineHeight: "1.7",
          marginTop: "40px",
          marginLeft: "40px",
        }}
      >
        <h6
          style={{
            fontWeight: 500,
            marginBottom: "16px",
            fontSize: "24px",
            color: "#252525",
          }}
        >
          About Paracetamol IP 500 mg
        </h6>

        <p
          style={{
            marginBottom: "12px",
            fontSize: "18px",
            fontWeight: "400px",
            color: "#494949",
          }}
        >
          Paracetamol 500mg is a well-known medicine used to treat fever and
          mild to moderate pain. It’s commonly taken for headaches, body aches,
          toothaches, period pain, and cold or flu-related symptoms. It helps
          you feel better by lowering body temperature and reducing the feeling
          of pain.
          <p />
          <p style={{ fontSize: "18px", fontWeight: "400px", color: "#494949" }}>
            This medicine usually starts working within 30 to 60 minutes, and
            its effects can last for 4 to 6 hours. It is considered safe when
            taken as directed, and it’s often recommended for both adults and
            children, though in different doses.
          </p>
          <p style={{ fontSize: "18px", fontWeight: "400px", color: "#494949" }}>
            However, it's important not to take more than the prescribed amount.
            Taking too much paracetamol can harm your liver. If you're already
            using other medicines that may contain paracetamol, make sure to
            check with your doctor or pharmacist.
          </p>
          <p style={{ fontSize: "18px", fontWeight: "400px", color: "#494949" }}>
            Always follow the dosage instructions given on the label or by your
            healthcare provider. If your fever or pain doesn’t go away after a
            few days, or if you have any health concerns, it’s best to consult a
            doctor.
          </p>
        </p>
      </div>
    </>
  );
}

