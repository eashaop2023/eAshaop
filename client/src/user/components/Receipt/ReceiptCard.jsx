import React from "react";
import eAshalogo from "../../assets/eAshalogo.png";

const ReceiptCard = ({ receipt }) => {
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

  const formatTime = (date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
  };

  return (
    <div className="receipt-card" style={{
      maxWidth: "800px",
      margin: "20px auto",
      padding: "30px",
      backgroundColor: "#ffffff",
      border: "1px solid #e0e0e0",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
    }}>
      {/* Company Logo */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <img 
          src={eAshalogo} 
          alt="eAsha Logo" 
          style={{ maxWidth: "150px", height: "auto" }}
        />
      </div>

      {/* OP Unique Number */}
      <div style={{ 
        textAlign: "center", 
        marginBottom: "30px",
        padding: "15px"
      }}>
        <h3 style={{ margin: "0", color: "#00A99D", fontSize: "18px", fontWeight: "600" }}>
          OP Unique Number: <strong>{appointmentNumber}</strong>
        </h3>
      </div>

      {/* Doctor Details Card */}
      <div style={{
        padding: "20px",
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        border: "1px solid #e0e0e0",
        marginBottom: "20px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
      }}>
        <h4 style={{ 
          marginTop: "0", 
          marginBottom: "15px",
          color: "#00A99D", 
          fontSize: "18px",
          fontWeight: "600",
          borderBottom: "2px solid #00A99D", 
          paddingBottom: "10px" 
        }}>
          Doctor Details
        </h4>
        <div style={{ lineHeight: "2" }}>
          <p style={{ margin: "8px 0" }}><strong>Name:</strong> {doctorDetails?.name || "N/A"}</p>
          <p style={{ margin: "8px 0" }}><strong>Speciality:</strong> {doctorDetails?.speciality || "N/A"}</p>
          <p style={{ margin: "8px 0" }}><strong>Email:</strong> {doctorDetails?.email || "N/A"}</p>
          <p style={{ margin: "8px 0" }}><strong>Mobile:</strong> {doctorDetails?.mobile || "N/A"}</p>
          {doctorDetails?.hospitalName && (
            <p style={{ margin: "8px 0" }}><strong>Hospital:</strong> {doctorDetails.hospitalName}</p>
          )}
          {doctorDetails?.hospitalLocation && (
            <p style={{ margin: "8px 0" }}><strong>Location:</strong> {doctorDetails.hospitalLocation}</p>
          )}
        </div>
      </div>

      {/* Patient Details Card */}
      <div style={{
        padding: "20px",
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        border: "1px solid #e0e0e0",
        marginBottom: "20px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
      }}>
        <h4 style={{ 
          marginTop: "0", 
          marginBottom: "15px",
          color: "#00A99D", 
          fontSize: "18px",
          fontWeight: "600",
          borderBottom: "2px solid #00A99D", 
          paddingBottom: "10px" 
        }}>
          Patient Details
        </h4>
        <div style={{ lineHeight: "2" }}>
          <p style={{ margin: "8px 0" }}><strong>Name:</strong> {patientDetails?.name || "N/A"}</p>
          <p style={{ margin: "8px 0" }}><strong>Age:</strong> {patientDetails?.age || "N/A"}</p>
          <p style={{ margin: "8px 0" }}><strong>Gender:</strong> {patientDetails?.gender || "N/A"}</p>
          <p style={{ margin: "8px 0" }}><strong>Email:</strong> {patientDetails?.email || "N/A"}</p>
          <p style={{ margin: "8px 0" }}><strong>Mobile:</strong> {patientDetails?.mobile || "N/A"}</p>
          {patientDetails?.address && (
            <p style={{ margin: "8px 0" }}><strong>Address:</strong> {patientDetails.address}</p>
          )}
          {patientDetails?.pincode && (
            <p style={{ margin: "8px 0" }}><strong>Pincode:</strong> {patientDetails.pincode}</p>
          )}
        </div>
      </div>

      {/* Payment Details Card */}
      <div style={{
        padding: "20px",
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        border: "1px solid #e0e0e0",
        marginBottom: "20px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
      }}>
        <h4 style={{ 
          marginTop: "0", 
          marginBottom: "15px",
          color: "#00A99D", 
          fontSize: "18px",
          fontWeight: "600",
          borderBottom: "2px solid #00A99D", 
          paddingBottom: "10px" 
        }}>
          Payment Details
        </h4>
        
        {/* Payment Table */}
        <div style={{
          marginBottom: "20px",
          border: "1px solid #e0e0e0",
          borderRadius: "5px",
          overflow: "hidden"
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#00A99D", color: "#ffffff" }}>
                <th style={{ padding: "12px", textAlign: "left" }}>Description</th>
                <th style={{ padding: "12px", textAlign: "right" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "12px", borderBottom: "1px solid #e0e0e0" }}>
                  Consultation Fee ({appointmentDetails?.type === "clinic" ? "Clinic Visit" : "Video Consultation"})
                </td>
                <td style={{ padding: "12px", textAlign: "right", borderBottom: "1px solid #e0e0e0" }}>
                  ₹{paymentDetails?.amount || 0}.00
                </td>
              </tr>
              <tr style={{ backgroundColor: "#f9f9f9", fontWeight: "bold" }}>
                <td style={{ padding: "12px" }}>Total</td>
                <td style={{ padding: "12px", textAlign: "right" }}>₹{paymentDetails?.amount || 0}.00</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Payment Method & Status */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "15px"
        }}>
          <div>
            <p style={{ margin: "0 0 5px 0", fontSize: "14px", color: "#666" }}><strong>Payment Method:</strong></p>
            <p style={{ margin: "0", color: "#00A99D", fontWeight: "600", fontSize: "16px" }}>
              {paymentDetails?.paymentMethod || "Pay at Clinic"}
            </p>
          </div>
          <div>
            <p style={{ margin: "0 0 5px 0", fontSize: "14px", color: "#666" }}><strong>OP Status:</strong></p>
            <p style={{ 
              margin: "0", 
              color: appointmentDetails?.status === "booked" ? "#28a745" : "#ffc107",
              fontWeight: "600",
              fontSize: "16px"
            }}>
              {appointmentDetails?.status === "booked" ? "Successful" : appointmentDetails?.status || "Pending"}
            </p>
          </div>
        </div>

        {/* Appointment Date & Time */}
        <div style={{ marginTop: "15px", paddingTop: "15px", borderTop: "1px solid #e0e0e0" }}>
          <p style={{ margin: "5px 0" }}><strong>Appointment Date:</strong> {formatDate(appointmentDetails?.date)}</p>
          <p style={{ margin: "5px 0" }}><strong>Appointment Time:</strong> {appointmentDetails?.time}</p>
          <p style={{ margin: "5px 0" }}><strong>Type:</strong> {appointmentDetails?.type === "clinic" ? "Clinic Visit" : "Video Consultation"}</p>
        </div>
      </div>

      {/* Receipt Generated Date */}
      <div style={{
        textAlign: "center",
        padding: "10px",
        color: "#666",
        fontSize: "12px",
        borderTop: "1px solid #e0e0e0",
        marginTop: "20px"
      }}>
        Receipt Generated: {formatDate(createdAt)} at {formatTime(createdAt)}
      </div>
    </div>
  );
};

export default ReceiptCard;

