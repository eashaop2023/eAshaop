
import React from "react";

export default function AboutTest() {
  return (
    <div
      id="about"
      style={{
        width: "1007px",
        marginLeft: "400px",
        fontFamily: "'Urbanist', sans-serif",
        color: "#333",
        fontSize: "14px",
        lineHeight: "1.7",
        boxSizing: "border-box",
      }}
    >
      <style>
        {`
          @media (max-width: 1023px) {
            #about {
              width: 100%!important;
              margin-left: 0 !important;
              padding: 0 16px;
              
            }
          }
        `}
      </style>

      <h6
        style={{
          fontWeight: 500,
          marginBottom: "16px",
          fontSize: "24px",
          color: "#252525",
        }}
      >
        About test
      </h6>

      <p
        style={{
          marginBottom: "12px",
          fontSize: "18px",
          fontWeight: "400",
          color: "#494949",
        }}
      >
        The Fever Profile – Comprehensive Test is a diagnostic package designed to identify the
        underlying causes of persistent fever. This test assesses blood cell counts, liver function,
        and evaluates markers for infections like malaria, dengue, typhoid, chikungunya, and
        Covid-19.
      </p>

      <p
        style={{
          fontSize: "18px",
          fontWeight: "400",
          color: "#494949",
        }}
      >
        Fever is a common symptom of illness and can significantly affect health. Acute febrile
        illness (AFI) is a fever lasting for less than two weeks and can be caused by different
        pathogens. Because symptoms can overlap and diagnostic tools may be limited, finding the
        exact cause of the fever can be difficult.
      </p>
    </div>
  );
}
