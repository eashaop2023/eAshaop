import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from '../../pages/ProfilePage/LegalPanel.module.css'

const link = document.createElement("link");
link.href = "https://fonts.googleapis.com/css2?family=Urbanist:wght@400;600&display=swap";
link.rel = "stylesheet";
document.head.appendChild(link);

const LegalSection = () => {
  const fontFamily = "'Urbanist', sans-serif";

  const linkStyle = {
    color: "#00A99D",
    textDecoration: "underline",
    display: "block",
    marginBottom: "8px",
    fontFamily,
    fontSize:"18px"
  };

  const containerStyle = {
    maxWidth: "352px",
    // marginTop: "148px",
    marginLeft: "430px",
     paddingTop: "148px",
    fontFamily,
    
  };

  return (
    <div className={` ${styles.mainContainer} container`} style={containerStyle}>
      <h2 className="mb-3"style={{ fontWeight: '500'}}>Legal</h2>
      <p style={{ fontSize: "14px", color: "#333" }}>
        Review the latest terms and conditions.
      </p>
      <a href="#" style={linkStyle} onClick={e => e.preventDefault()}>Informed Consent</a>
      <a href="#" style={linkStyle} onClick={e => e.preventDefault()}>Notice of Privacy Practices</a>
      <a href="#" style={linkStyle} onClick={e => e.preventDefault()}>Behavioral Health Treatment Agreement</a>
      <a href="#" style={linkStyle} onClick={e => e.preventDefault()}>Non-Discrimination Notice</a>
    </div>
  );
};

export default LegalSection;
