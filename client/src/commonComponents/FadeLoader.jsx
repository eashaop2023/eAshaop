import React from "react";
import { FadeLoader } from "react-spinners";

const LoaderOverlay = ({ loading }) => {
  if (!loading) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(255,255,255,0.8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <FadeLoader color="#00A99D" height={20} width={6} margin={4} speedMultiplier={1.2} />
    </div>
  );
};

export default LoaderOverlay;
