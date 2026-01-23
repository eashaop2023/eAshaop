import React from "react";
import { useNavigate } from "react-router-dom";
import eAshalogo from "../../assets/eAshalogo.png";

const ReceiptCardCompact = ({ receipt }) => {
  const navigate = useNavigate();
  
  if (!receipt) return null;

  const {
    appointmentNumber,
    doctorDetails,
    patientDetails,
    appointmentDetails,
    paymentDetails,
    createdAt
  } = receipt;

  const formatDate = (date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div 
      className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
      style={{ padding: "20px", marginBottom: "20px" }}
    >
      {/* Top Section: Logo and OP Unique Number with View All Button - Single Line */}
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between",
        gap: "20px",
        flexWrap: "wrap"
      }}>
        {/* Logo */}
        <div>
          <img 
            src={eAshalogo} 
            alt="eAsha Logo" 
            style={{ maxWidth: "120px", height: "auto" }}
          />
        </div>
        
        {/* OP Unique Number */}
        <div style={{ flex: 1, minWidth: "200px" }}>
          <h3 style={{ margin: "0", color: "#00A99D", fontSize: "18px", fontWeight: "600" }}>
            OP Unique Number: <strong>{appointmentNumber}</strong>
          </h3>
        </div>
        
        {/* View All Button */}
        <button
          onClick={() => navigate("/user/receipts")}
          style={{
            color: "#00A99D",
            border: "1px solid #00A99D",
            borderRadius: "6px",
            padding: "6px 20px",
            fontWeight: 500,
            backgroundColor: "transparent",
            cursor: "pointer",
            fontSize: "14px",
            whiteSpace: "nowrap"
          }}
        >
          View all
        </button>
      </div>
    </div>
  );
};

export default ReceiptCardCompact;

