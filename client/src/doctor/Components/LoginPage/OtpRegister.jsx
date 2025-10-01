import React, { useState,useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../../../assets/eAshalogo.png";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const OtpRegister = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [showPopup, setShowPopup] = useState(false);
    const [resendCount, setResendCount] = useState(0);
  const [timer, setTimer] = useState(0); // Timer for resend OTP
  const doctorId=location.state?.doctorId;
  const from = location.state?.from || "signup"; // Default to signup
  const identifier = location.state?.identifier || ""; // phone/email

   useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [timer]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 3) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  const enteredOtp = otp.join("").trim();  

  try {
    const res = await fetch("http://localhost:5000/api/doctors/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json",doctorId:doctorId, },
      body: JSON.stringify({ doctorId, email: identifier, otp: enteredOtp }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Invalid OTP");

    toast.success("Account verified successfully!", {
      position: "top-center",
      autoClose: 2000,
    });

    setShowPopup(true);
  } catch (error) {
    setError(true);
  }
};


// ✅ Resend OTP
const handleResend = async () => {
   if (resendCount >= 3) {
      toast.error("You’ve reached the resend limit (3 times).", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }
     console.log("Resend OTP payload:", {
    doctorId,
    verifyBy: identifier.includes("@") ? "email" : "mobile",
  });
  try {
    const res = await fetch("http://localhost:5000/api/doctors/resend-verification-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
body: JSON.stringify({ doctorId, verifyBy: identifier.includes("@") ? "email" : "mobile" }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to resend OTP");

    toast.success("OTP resent successfully!", {
      position: "top-center",
      autoClose: 2000,
    });
      
    setResendCount((prev) => prev + 1);
      setTimer(60); // 🔥 Start 1-minute cooldown

  } catch (error) {
    toast.error("Could not resend OTP", {
      position: "top-center",
      autoClose: 2000,
    });
  }
};

const handleOkClick = () => {
    setShowPopup(false);
    navigate("/login");
  };

    
  return (
    <>
      <style>{`
        .logo-wrapper {
          position: absolute;
          top: 2.313rem;
          left: 6.563rem;
        }

        .logo-img {
          height: 4.563rem;
          width: 5.56rem;
        }

        @media (max-width: 767.98px) {
          .logo-wrapper {
            position: relative !important;
            top: unset;
            left: unset;
            margin: 20px auto 24px auto !important;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            margin-bottom: 38px !important;
          }
          .logo-img {
            height: 100px !important;
            width: 130px !important;
            object-fit: contain !important;
          }
          .otp-form {
            margin-top: -20px !important;
          }
        }
        button {
          margin-top: -20px !important;
        }

        @media (max-width: 424px) {
          .logo-img {
            height: 77px !important;
            width: 102px !important;
            object-fit: contain !important;
          }
        }
      `}</style>

      <div
        className="w-100 d-flex flex-column justify-content-center"
        style={{ minHeight: "100vh", position: "relative" }}
      >
        <div className="logo-wrapper">
          <img src={logo} alt="Logo" className="logo-img" />
        </div>

        <div className="text-center mb-4 otp-form">
          <h1 className="mb-3" style={{ fontWeight: 600, color: "#252525" }}>
            OTP Verification
          </h1>
          <p
            className="text-muted"
            style={{
              color: "#494949",
              fontSize: "20px",
              fontWeight: 400,
            }}
          >
            Please enter the OTP we’ve sent to your registered{" "}
            {identifier.includes("@") ? "email address" : "phone number"}.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-100"
          style={{
            maxWidth: "350px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            className="d-flex justify-content-center otp"
            style={{ gap: "24px", marginBottom: "2rem" }}
          >
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                className="form-control text-center p-0"
                style={{
                  width: "50px",
                  height: "50px",
                  fontSize: "2.125rem",
                  fontWeight: 600,
                  textAlign: "center",
                  lineHeight: "50px",
                  border: "none",
                  backgroundColor: "#F7F7F7",
                  borderRadius: "8px",
                }}
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                maxLength={1}
                inputMode="numeric"
                autoComplete="one-time-code"
                required
              />
            ))}
          </div>

          <div
            className="mb-3"
            style={{
              height: "24px",
              fontWeight: 500,
              color: error ? "red" : "transparent",
              transition: "color 0.3s ease",
              textAlign: "center",
            }}
          >
            Invalid OTP. Please try again.
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 py-2 mb-3"
            style={{
              maxWidth: "350px",
              height: "46px",
              borderRadius: "28px",
              padding: "12px 10px",
              backgroundColor: "#00A99D",
              border: "none",
              fontWeight: 400,
              fontSize: "1.125rem",
              lineHeight: "22px",
              textAlign: "center",
            }}
          >
            Continue
          </button>
        </form>

        <div
          className="text-center mt-3"
          style={{ fontWeight: 400, fontSize: "1.125rem", color: "#494949" }}
        >
          <p>Didn't receive the code?</p>
          <button
            className="btn btn-link p-0"
            style={{
              fontWeight: 400,
              fontSize: "1.125rem",
            color: timer > 0 || resendCount >= 3 ? "#aaa" : "#00A99D",
            pointerEvents: timer > 0 || resendCount >= 3 ? "none" : "auto",
            }}
            onClick={handleResend}
          >
           {timer > 0
            ? `Resend in ${timer}s`
            : resendCount >= 3
            ? "Resend Limit Reached"
            : "Resend Code"}          </button>
        </div>

        {/* Popup Modal */}
      {showPopup && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-5 text-center">
              <h3 className="mb-3">Thank You!</h3>
              <p className="text-muted mb-4">
                After verification, login credentials will be provided to you.
              </p>
              <button
                className="btn text-white rounded-pill"
                style={{ backgroundColor: "#00BFA6", borderColor: "#00A99D" }}
                onClick={handleOkClick}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default OtpRegister;
