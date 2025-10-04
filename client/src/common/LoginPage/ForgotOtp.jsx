import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
// import logo from "../.././assets/eAshalogo.png";
import logo from "../.././assets/eAshalogo.png";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../api-config";

const ForgotOtp = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const doctorId = location.state?.doctorId || null;  // ✅ capture doctorId
  const from = location.state?.from || "forgot-password"; 
  const identifier = location.state?.identifier || ""; 
  const role = location.state?.role || "user"; // 'doctor' or 'user'


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


    const getApiBase = (action) => {
    if (role === "doctor") {
      return `${API_BASE_URL}/api/doctors/forgot-password/${action}`;
    } else {
      return `${API_BASE_URL}/api/user/forgot-password/${action}`;
    }
  };


const verifyOTP = async () => {
  const enteredOtp = otp.join("");
  if (enteredOtp.length < 4) {
    setError(true);
    return;
  }

  setLoading(true);
  try {
    const verifyBy = identifier.includes("@") ? "email" : "mobile";

      const payload = {
        verifyBy,
        otp: enteredOtp,
        ...(verifyBy === "email" ? { value: identifier } : { value: identifier }),
      };

      const res = await fetch(getApiBase("verify-otp"), {
        method: "POST",
headers: {
          "Content-Type": "application/json",
          ...(role === "doctor" && doctorId ? { doctorid: doctorId } : {}), // ✅ send doctorId header
        },        body: JSON.stringify(payload),
      });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Invalid OTP");

    setError(false);

        if (role === "doctor" && doctorId) {
      localStorage.setItem("doctorId", doctorId);
    }


    if (from === "forgot-password") {
      navigate("/create-password", { state: { identifier, role, doctorId: role === "doctor" ? doctorId : null,
 } });
    } else {
      toast.success("OTP verified!", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  } catch (err) {
    setError(true);
    toast.error(err.message);
  } finally {
    setLoading(false);
  }
};

const resendOTP = async () => {

  setLoading(true);
  try {
    const verifyBy = identifier.includes("@") ? "email" : "mobile";

    // Include doctorId in the payload
      const payload = {
        verifyBy,
        value: identifier,
        ...(role === "doctor" && doctorId ? { doctorId } : {}), // ✅ send doctorId in body for resend
      };
      const res = await fetch(getApiBase("resend-otp"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to resend OTP");

    toast.success(`OTP resent to your ${verifyBy}`);
  } catch (err) {
    toast.error(err.message);
  } finally {
    setLoading(false);
  }};

  const handleSubmit = (e) => {
    e.preventDefault();
    verifyOTP();
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
          style={{ color: "#494949", fontSize: "20px", fontWeight: 400 }}
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
          disabled={loading}
        >
          {loading ? "Processing..." : "Continue"}
        </button>
      </form>

      <div
        className="text-center mt-3"
        style={{ fontWeight: 400, fontSize: "1.125rem", color: "#494949" }}
      >
        <p>Didn't receive the code?</p>
        <button
          className="btn btn-link p-0"
          style={{ fontWeight: 400, fontSize: "1.125rem", color: "#00A99D" }}
          onClick={resendOTP}
          disabled={loading}
        >
          {loading ? "Resending..." : "Resend Code"}
        </button>
      </div>
    </div>
    </>
  );
};

export default ForgotOtp;
