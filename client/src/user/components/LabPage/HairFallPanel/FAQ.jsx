import React, { useState } from "react";
import Plus from "../../../assets/cardiologist/Add_Plus.svg";
import Minus from "../../../assets/cardiologist/Remove_Minus.svg";

const faqs = [
  {
    question: "What is Fever Profile",
    answer:
      "A Fever Profile – Comprehensive Test helps identify the cause of persistent fever by examining blood and urine. It screens for infections such as malaria, dengue, typhoid, and chikungunya, for diagnosis and treatment.",
  },
  {
    question: "What is Fever Profile",
    answer:
      "A Fever Profile – Comprehensive Test helps identify the cause of persistent fever by examining blood and urine. It screens for infections such as malaria, dengue, typhoid, and chikungunya, for diagnosis and treatment.",
  },
  {
    question: "What is Fever Profile",
    answer:
      "A Fever Profile – Comprehensive Test helps identify the cause of persistent fever by examining blood and urine. It screens for infections such as malaria, dengue, typhoid, and chikungunya, for diagnosis and treatment.",
  },
  {
    question: "What is Fever Profile",
    answer:
      "A Fever Profile – Comprehensive Test helps identify the cause of persistent fever by examining blood and urine. It screens for infections such as malaria, dengue, typhoid, and chikungunya, for diagnosis and treatment.",
  },
];

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div>
      <style>
        {`
          @media (max-width: 768px) {
            #faq {
              width: 90% !important;
              margin-left: auto !important;
              margin-right: auto !important;
            }
            #faq h6 {
              font-size: 20px !important;
              
            }
            #faq div {
              font-size: 16px !important;
            }
            #faq p {
              font-size: 14px !important;
            }
          }
        `}
      </style>

      <div
        id="faq"
        style={{
          width: "1007px",
          marginLeft: "400px",
          fontFamily: "'Urbanist', sans-serif",
          marginTop: "40px",
        }}
      >
        <h6
          style={{
            fontSize: "24px",
            fontWeight: 500,
            marginBottom: "20px",
            color: "#252525",
          }}
        >
          FAQs on Fever Profile
        </h6>

        {faqs.map((faq, index) => (
          <div
            key={index}
            onClick={() => toggleAccordion(index)}
            style={{
              backgroundColor: openIndex === index ? "#F7F7F7" : "#fff",
              borderRadius: "28px",
              padding: "20px",
              marginBottom: "10px",
              cursor: "pointer",
              fontSize: "24px",
              fontWeight: "500px",
              color: "#252525",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontWeight: 500,
                fontSize: "18px",
              }}
            >
              {faq.question}
              <img
                src={openIndex === index ? Minus : Plus}
                alt="Toggle Icon"
                style={{ width: "24px", height: "24px" }}
              />
            </div>
            {openIndex === index && (
              <p
                style={{
                  fontSize: "18px",
                  marginTop: "10px",
                  color: "#494949",
                  fontWeight: "400px",
                }}
              >
                {faq.answer}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
