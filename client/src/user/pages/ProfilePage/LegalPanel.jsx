import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from '../../pages/ProfilePage/LegalPanel.module.css';

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
    fontSize: "16px",
  };

  const containerStyle = {
    maxWidth: "100%",
    paddingLeft: "15px",
    paddingRight: "15px",
    fontFamily,
    paddingTop: "148px", // default for large screens
  };

  // Make padding responsive using a simple inline check
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const responsivePaddingTop =
    windowWidth < 576
      ? "110px" // mobile
      : windowWidth < 768
      ? "130px" // tablet
      : "148px"; // desktop
      

  return (
    <div
      className={`${styles.mainContainer} container`}
      style={{ ...containerStyle, paddingTop: responsivePaddingTop }}
    >
      <div className="row justify-content-center">
        <div className="col-12 col-md-6 col-lg-4">
          <h2 className="mb-3" style={{ fontWeight: 500, fontFamily }}>Legal</h2>
          <p style={{ fontSize: "14px", color: "#333", fontFamily }}>
            Review the latest terms and conditions.
          </p>
          <a href="#" style={linkStyle} onClick={e => e.preventDefault()}>Informed Consent</a>
          <a href="#" style={linkStyle} onClick={e => e.preventDefault()}>Notice of Privacy Practices</a>
          <a href="#" style={linkStyle} onClick={e => e.preventDefault()}>Behavioral Health Treatment Agreement</a>
          <a href="#" style={linkStyle} onClick={e => e.preventDefault()}>Non-Discrimination Notice</a>
        </div>
      </div>
    </div>
  );
};

export default LegalSection;
