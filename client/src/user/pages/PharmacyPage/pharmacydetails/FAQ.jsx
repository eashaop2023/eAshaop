import React, { useState } from "react";
import Plus from "../../../assets/pharmacyicons/Add_Plus.svg"
import Minus from "../../../assets/pharmacyicons/Remove_Minus.svg"

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
    <div
      id="faq"
      style={{
        width: "1007px",
        marginLeft: "40px",
        fontFamily: "'Urbanist', sans-serif",
        marginTop: "40px",
        marginBottom: "50px",
      }}
    >
      <style>
        {`
          /* Tablet */
          @media (max-width: 1024px) {
            #faq {
              width: 90% !important;
              margin-left: auto !important;
              margin-right: auto !important;
            }
          }

          /* Mobile */
          @media (max-width: 768px) {
            #faq {
              width: 95% !important;
              margin-left: 20px !important;
              margin-right: auto !important;
            }
            #faq h6 {
              font-size: 20px !important;
            }
            #faq .faq-item {
              font-size: 16px !important;
              padding: 15px !important;
            }
            #faq .faq-answer {
              font-size: 14px !important;
            }
          }
        `}
      </style>

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
          className="faq-item"
          onClick={() => toggleAccordion(index)}
          style={{
            backgroundColor: openIndex === index ? "#077E8C1A" : "#fff",
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
              className="faq-answer"
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
  );
}
