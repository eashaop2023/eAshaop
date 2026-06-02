import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../../assets/eAshalogo.png";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const OTPVerification = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "signup"; // Default to signup
  const phone = location.state?.phone || "";
  console.log(location.state); 
  const maskedNumber = phone
  ? phone.replace(/(\+91)(\d{2})\d{6}(\d{2})/, "$1$2******$3")
  : "+91*******XX";


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

  const handleSubmit = (e) => {
  e.preventDefault();
  const enteredOtp = otp.join("");
  console.log("Entered OTP:", enteredOtp);

  if (enteredOtp === "0000") {
  setError(true);
} else {
  setError(false);

  if (from === "forgot-password") {
    navigate("/create-password", {
      state: { phone }, // pass the phone if needed
    });
  } else {
    toast.success("Account created successfully!", {
      position: "top-center",
      autoClose: 2000,
    });

    setTimeout(() => {
      navigate("/");
    }, 2000);
  }
}

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
             margin:20px auto 24px auto !important;
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
            .otp-form{
          margin-top: -20px !important;}  
          }
          button {
          margin-top: -20px !important;}
            

        
          @media(max-width:424px){
             .logo-img {
            height: 77px !important;
            width: 102px !important;
            object-fit: contain !important;
          }
          
      `}</style>

      <div
        className="w-100 d-flex flex-column justify-content-center"
        // style={{ minHeight: "100vh", position: "relative" }}
        style={{minHeight: "100vh", position:"relative" }}
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
              fontSize: "22px",
              fontWeight: 400,
            }}
          >
            We've sent a verification code to
            <br />
            {maskedNumber}
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
    height: "24px", // Reserve space whether error exists or not
    fontWeight: 500,
    color: error ? "red" : "transparent", // Show text only on error
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
              color: "#00A99D",
            }}
          >
            Resend Code
          </button>
        </div>
      </div>
    </>
  );
};

export default OTPVerification;
