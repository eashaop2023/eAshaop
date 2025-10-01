import React, { useState } from "react";
import { Button, Card } from "react-bootstrap";
import qrCode from "../../../assets/pharmacyicons/qr.jpg"
import phonePe from "../../../assets/pharmacyicons/phonepe.svg";
import gpay from "../../../assets/pharmacyicons/gpay.png";
import upi from "../../../assets/pharmacyicons/upi.svg";
import './OrderPayment.css'

const OrderPayment = () => {
  const [selectedMethod, setSelectedMethod] = useState("UPI");
  const [selectedUpi, setSelectedUpi] = useState(null);

  const paymentOptions = ["UPI", "Card", "Net banking"];
  const upiOptions = [
    { img: phonePe, label: "PhonePe" },
    { img: gpay, label: "GPay" },
    { img: upi, label: "UPI" },
  ];

  const subtotal = 2000;
  const discount = 500;
  const deliveryFee = 15;
  const total = subtotal - discount + deliveryFee;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "827px 533px",
        columnGap: "60px",
        marginLeft: "40px",
        // marginTop: "147px",
        paddingTop:"150px",
        fontFamily: "Urbanist, sans-serif",
        width:'1360px'
      }}
    >
      {/* LEFT: Payment Section */}
      <div style={{ width: "827px", height: "759px" }}>
        <h2 className="fw-medium mb-2" style={{color:'#252525'}}>Confirm Appointment</h2>
        <p className="fw-medium mb-5" style={{ color:'#494949' }}>
          Confirm your slot by providing us with your payment information
        </p>

        <div >
          <h4 className="fw-medium mb-3">Payment method</h4>

          <div
            className="d-flex gap-2 align-items-center justify-content-between rounded-pill px-3 mb-4"
            style={{
              width: 357,
              height: 62,
              border: "1px solid #00A99D",
              backgroundColor: "#fff",
            }}
          >
            {paymentOptions.map((method, idx) => (
              <Button
                key={idx}
                style={{
                    border:'none',
                  width:
                    method === "Net banking"
                      ? 143
                      : method === "Card"
                      ? 88
                      : 74,
                  height: 42,
                  fontSize: 14,
                  borderRadius: 28,
                  backgroundColor:
                    selectedMethod === method ? "#00A99D" : "transparent",
                  color: selectedMethod === method ? "#FFFFFF" : "#00A99D",
                }}
                onClick={() => setSelectedMethod(method)}
              >
                {method}
              </Button>
            ))}
          </div>

          {/* UPI Options */}
            <div className="upi-container mb-2" style={{width:'403px',height:'129px'}}>
  {/*sliding highlight */}
<div className="upi-highlight" style={{ transform: `translateX(${selectedUpi * 145}px)` }}></div>
             {upiOptions.map((option, i) => (
                <div
                  key={i}
                  className="upi-box"
                  onClick={() => setSelectedUpi(i)}
                >
                  <div className="upi-box-inner">
                    <div
                      className="d-flex align-items-center justify-content-center mx-auto mb-2"
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 80,
                        border: "1px solid #F7F7F7",
                      }}
                    >
                      <img src={option.img} alt={option.label} />
                    </div>
                    <div
                      className="text-muted"
                      style={{
                        color: selectedUpi === i ? "#00A99D" : "#212529",
                      }}
                    >
                      {option.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>





          <p style={{fontSize:'18px', color:'#494949'}}>Scan this QR using your PhonePe mobile</p>
          <img src={qrCode} alt="QR Code" width={200} height={200} />
        </div>
      </div>

      {/* RIGHT: Order Summary */}
      <div style={{ width: "550px", height: "402px" }}>
        <Card style={{ border: "1px solid #EEEEEE", borderRadius: "12px" }}>
          <Card.Body>
            <h4 className="fw-medium" style={{ color: "#252525", marginBottom: "50px" }}>
              Order Summary
            </h4>
            <div className="d-flex justify-content-between mb-4" style={{ fontSize: "18px", color: "#252525" }}>
              <span className="fw-regular">Subtotal</span>
              <span className="fw-medium">₹{subtotal}</span>
            </div>
            <div className="d-flex justify-content-between mb-4" style={{ fontSize: "18px", color: "#252525" }}>
              <span className="fw-regular">Discount</span>
              <span className="fw-medium">-₹{discount}</span>
            </div>
            <div className="d-flex justify-content-between mb-4" style={{ fontSize: "18px", color: "#252525" }}>
              <span className="fw-regular">Delivery Fee</span>
              <span className="fw-medium">₹{deliveryFee}</span>
            </div>
            <hr className="mb-4" style={{ border: "1px solid #EEEEEE" }} />
            <div className="d-flex justify-content-between" style={{ fontSize: "18px", color: "#252525" }}>
              <span className="fw-regular">Total</span>
              <span className="fw-medium">₹{total}</span>
            </div>
            
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default OrderPayment;
