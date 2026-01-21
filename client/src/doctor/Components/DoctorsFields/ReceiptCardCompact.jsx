import React from "react";
import eAshalogo from "../../../assets/eAshalogo.png";

const ReceiptCardCompact = ({ receipt }) => {
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
      {/* Top Section: Logo and OP Unique Number */}
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        gap: "30px",
        marginBottom: "25px"
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
        <div>
          <h3 style={{ margin: "0", color: "#00A99D", fontSize: "18px", fontWeight: "600" }}>
            OP Unique Number: <strong>{appointmentNumber}</strong>
          </h3>
        </div>
      </div>

      {/* Middle Section: Doctor and Patient Details Side by Side */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "1fr 1fr", 
        gap: "20px",
        marginBottom: "20px"
      }}>
        {/* Doctor Details Card */}
        <div style={{
          padding: "15px",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          border: "1px solid #e0e0e0",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
        }}>
          <h4 style={{ 
            marginTop: "0", 
            marginBottom: "12px",
            color: "#00A99D", 
            fontSize: "16px",
            fontWeight: "600",
            borderBottom: "2px solid #00A99D", 
            paddingBottom: "8px" 
          }}>
            Doctor Details
          </h4>
          <div style={{ lineHeight: "1.8", fontSize: "14px" }}>
            <p style={{ margin: "6px 0" }}><strong>Name:</strong> {doctorDetails?.name || "N/A"}</p>
            <p style={{ margin: "6px 0" }}><strong>Speciality:</strong> {doctorDetails?.speciality || "N/A"}</p>
            <p style={{ margin: "6px 0" }}><strong>Email:</strong> {doctorDetails?.email || "N/A"}</p>
            <p style={{ margin: "6px 0" }}><strong>Mobile:</strong> {doctorDetails?.mobile || "N/A"}</p>
            {doctorDetails?.hospitalName && (
              <p style={{ margin: "6px 0" }}><strong>Hospital:</strong> {doctorDetails.hospitalName}</p>
            )}
            {doctorDetails?.hospitalLocation && (
              <p style={{ margin: "6px 0" }}><strong>Location:</strong> {doctorDetails.hospitalLocation}</p>
            )}
          </div>
        </div>

        {/* Patient Details Card */}
        <div style={{
          padding: "15px",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          border: "1px solid #e0e0e0",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
        }}>
          <h4 style={{ 
            marginTop: "0", 
            marginBottom: "12px",
            color: "#00A99D", 
            fontSize: "16px",
            fontWeight: "600",
            borderBottom: "2px solid #00A99D", 
            paddingBottom: "8px" 
          }}>
            Patient Details
          </h4>
          <div style={{ lineHeight: "1.8", fontSize: "14px" }}>
            <p style={{ margin: "6px 0" }}><strong>Name:</strong> {patientDetails?.name || "N/A"}</p>
            <p style={{ margin: "6px 0" }}><strong>Age:</strong> {patientDetails?.age || "N/A"}</p>
            <p style={{ margin: "6px 0" }}><strong>Gender:</strong> {patientDetails?.gender || "N/A"}</p>
            <p style={{ margin: "6px 0" }}><strong>Email:</strong> {patientDetails?.email || "N/A"}</p>
            <p style={{ margin: "6px 0" }}><strong>Mobile:</strong> {patientDetails?.mobile || "N/A"}</p>
            {patientDetails?.address && (
              <p style={{ margin: "6px 0" }}><strong>Address:</strong> {patientDetails.address}</p>
            )}
            {patientDetails?.pincode && (
              <p style={{ margin: "6px 0" }}><strong>Pincode:</strong> {patientDetails.pincode}</p>
            )}
          </div>
        </div>

      </div>

      {/* Bottom Section: Payment Details - Full Width */}
      <div style={{
        padding: "25px",
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        border: "1px solid #e0e0e0",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        width: "100%"
      }}>
        <h4 style={{ 
          marginTop: "0", 
          marginBottom: "20px",
          color: "#00A99D", 
          fontSize: "18px",
          fontWeight: "600",
          borderBottom: "2px solid #00A99D", 
          paddingBottom: "10px" 
        }}>
          Payment Details
        </h4>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "1.2fr 1px 1fr",
          gap: "40px",
          fontSize: "15px"
        }}>
          {/* Left Side - Payment Info */}
          <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            gap: "15px"
          }}>
            {/* Consultation Fee */}
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center"
            }}>
              <span style={{ fontWeight: "600", color: "#333", fontSize: "15px" }}>Consultation Fee:</span>
              <span style={{ color: "#00A99D", fontWeight: "600", fontSize: "18px", whiteSpace: "nowrap" }}>
                ₹{paymentDetails?.amount || 0}.00
              </span>
            </div>
            
            {/* Payment Method */}
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center"
            }}>
              <span style={{ fontWeight: "600", color: "#333", fontSize: "15px" }}>Payment Method:</span>
              <span style={{ color: "#00A99D", fontWeight: "600", fontSize: "15px", whiteSpace: "nowrap" }}>
                {paymentDetails?.paymentMethod || "Pay at Clinic"}
              </span>
            </div>
            
            {/* OP Status */}
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center"
            }}>
              <span style={{ fontWeight: "600", color: "#333", fontSize: "15px" }}>OP Status:</span>
              <span style={{ 
                color: appointmentDetails?.status === "booked" ? "#28a745" : "#ffc107",
                fontWeight: "600",
                fontSize: "15px",
                whiteSpace: "nowrap"
              }}>
                {appointmentDetails?.status === "booked" ? "Successful" : appointmentDetails?.status || "Pending"}
              </span>
            </div>
          </div>
          
          {/* Vertical Divider */}
          <div style={{ 
            backgroundColor: "#e0e0e0",
            width: "1px",
            height: "100%"
          }}></div>
          
          {/* Right Side - Appointment Details */}
          <div style={{ 
            display: "flex", 
            flexDirection: "column",
            gap: "15px"
          }}>
            {/* Date */}
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center"
            }}>
              <span style={{ fontWeight: "600", color: "#333", fontSize: "15px" }}>Date:</span>
              <span style={{ color: "#666", fontSize: "15px", whiteSpace: "nowrap" }}>{formatDate(appointmentDetails?.date)}</span>
            </div>
            
            {/* Time */}
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center"
            }}>
              <span style={{ fontWeight: "600", color: "#333", fontSize: "15px" }}>Time:</span>
              <span style={{ color: "#666", fontSize: "15px", whiteSpace: "nowrap" }}>{appointmentDetails?.time}</span>
            </div>
            
            {/* Type */}
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center"
            }}>
              <span style={{ fontWeight: "600", color: "#333", fontSize: "15px" }}>Type:</span>
              <span style={{ color: "#666", fontSize: "15px", whiteSpace: "nowrap" }}>{appointmentDetails?.type === "clinic" ? "Clinic Visit" : "Video Consultation"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptCardCompact;

