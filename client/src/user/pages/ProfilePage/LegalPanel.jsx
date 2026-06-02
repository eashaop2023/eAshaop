import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../../pages/ProfilePage/LegalPanel.module.css";

const LegalSection = () => {
  const fontFamily = "'Urbanist', sans-serif";

  // Load Urbanist font dynamically
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Urbanist:wght@400;600&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  // Handle responsive padding
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const responsivePaddingTop =
    windowWidth < 576
      ? "100px" // mobile (xs)
      : windowWidth < 768
      ? "120px" // small tablet (sm)
      : windowWidth < 992
      ? "135px" // tablet (md)
      : "150px"; // desktop and above (lg+)
const responsivePaddingLeft =
    windowWidth < 576
      ?"50px" // mobile (xs)
      : windowWidth < 768
      ? "50px" // small tablet (sm)
      : windowWidth < 992
      ? "70px" // tablet (md)
      : "150px"; // desktop and above (lg+)

  const linkStyle = {
    color: "#00A99D",
    textDecoration: "underline",
    display: "block",
    marginBottom: "10px",
    fontFamily,
    fontSize: windowWidth < 576 ? "14px" : "16px",
  };

  return (
    <div
      className={`${styles.mainContainer} container`}
      style={{
        paddingTop: responsivePaddingTop,
        paddingLeft: responsivePaddingLeft,
        paddingRight: "20px",
        fontFamily,
      }}
    >
      <div className="row justify-content-center">
        <div
          className="col-12 col-sm-10 col-md-8 col-lg-5"
          style={{
            borderRadius: "12px",
            padding: windowWidth < 576 ? "20px" : "30px",
          }}
        >
          <h2
            className="mb-3 heading"
            style={{
              fontWeight: 500,
              fontFamily,
              marginTop: windowWidth < 576 ? "20px" : "0px",
            }}
          >
            Legal
          </h2>
          <p
            style={{
              fontSize: windowWidth < 576 ? "13px" : "15px",
              color: "#444",
              fontFamily,
            }}
          >
            Review the latest terms and conditions.
          </p>

          <div style={{ marginTop: "15px" }}>
            <a href="#" style={linkStyle} onClick={(e) => e.preventDefault()}>
              Informed Consent
            </a>
            <a href="#" style={linkStyle} onClick={(e) => e.preventDefault()}>
              Notice of Privacy Practices
            </a>
            <a href="#" style={linkStyle} onClick={(e) => e.preventDefault()}>
              Behavioral Health Treatment Agreement
            </a>
            <a href="#" style={linkStyle} onClick={(e) => e.preventDefault()}>
              Non-Discrimination Notice
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalSection;
