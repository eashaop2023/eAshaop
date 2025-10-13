// import logo from "../../assets/eAshalogo.png";
import logo from "../.././assets/eAshalogo.png";
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_BASE_URL } from "../../api-config";
import LoaderOverlay from "../../commonComponents/FadeLoader";

// const API_BASE_URL = "${API_BASE_URL}";

function LoginPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [passwordError, setPasswordError] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [identifierError, setIdentifierError] = useState("");

  const [loginWithOtp, setLoginWithOtp] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [otpSentVisible, setOtpSentVisible] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [resendCount, setResendCount] = useState(0);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);


  const normalizeUser = (user) => {
  const dob = user.dob || user.DOB || null;
  const gender = user.gender || "Not Provided";

  const calculateAge = dobValue => {
    if (!dobValue) return "Not Provided";
    const birthDate = new Date(dobValue);
    if (isNaN(birthDate.getTime())) return "Not Provided";
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  return {
    id: user._id || user.id,
    full_name: user.full_name || user.name || "Unknown",
    email: user.email || "",
    phone_number: user.phone_number || "",
    dob,
    gender,
    age: calculateAge(dob)
  };
};


  const countdownRef = useRef(null);

  useEffect(() => {
    return () => clearInterval(countdownRef.current);
  }, []);

  // Handle OTP change
  const handleOtpChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value !== "" && index < otp.length - 1) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

const sendOtp = async () => {
  setLoading(true);
  try {
    const isEmail = identifier.includes("@");
    const payload = {
      verifyBy: isEmail ? "email" : "mobile",
      value: identifier.trim(),
    };

    const endpoint =
      role === "doctor"
        ? `${API_BASE_URL}/api/doctors/login/request-otp`
        : `${API_BASE_URL}/api/user/login/send-otp`;


    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to send OTP");

    if (role === "doctor" && data.doctorId) {
      localStorage.setItem("doctorId", data.doctorId);
      console.log("DoctorId saved:", data.doctorId);
    }

    setOtpSent(true);
    toast.success("OTP sent successfully!");
  } catch (error) {
    // Friendly error message instead of backend "User not found"
    if (error.message?.toLowerCase().includes("user not found")) {
      toast.error("Email or phone number is incorrect");
    } else {
      toast.error(error.message);
    }
  throw error}
    finally {
      setLoading(false);
    
  }
};


const resendOtp = async () => {
  setLoading(true);
  try {
    const doctorId = localStorage.getItem("doctorId"); 

    const isEmail = identifier.includes("@");
    const payload = {
verifyBy: isEmail ? "email" : "mobile",
      value: identifier.trim(),     
    };


    if (role === "doctor") {
      if (!doctorId) throw new Error("Doctor ID missing! Please request OTP again.");
      payload.doctorId = doctorId;
    }

    const endpoint =
      role === "doctor"
        ? `${API_BASE_URL}/api/doctors/login/resend-login-otp`
        : `${API_BASE_URL}/api/user/login/resend-otp`;


    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to resend OTP");

    toast.success("OTP resent successfully!");
  } catch (error) {
    toast.error(error.message);
    throw error;
  }
  finally {
      setLoading(false);
    }
};





const verifyOtp = async () => {
  setLoading(true);
  try {
    const doctorId = localStorage.getItem("doctorId"); 

    const isEmail = identifier.includes("@");
    const payload = {
      verifyBy: isEmail ? "email" : "mobile",
      value: identifier.trim(),
      otp: otp.join(""),
    };

    if (role === "doctor" && doctorId) {
      payload.doctorId = doctorId;
    }

    const endpoint =
      role === "doctor"
        ? `${API_BASE_URL}/api/doctors/login/verify-otp`
        : `${API_BASE_URL}/api/user/login/verify-otp`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(role === "doctor" && doctorId ? { doctorId } : {}),
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Invalid OTP");

    const authToken = data.authToken || data.token;
    if (!authToken) throw new Error("No token received!");

    localStorage.setItem("authToken", authToken);
    localStorage.setItem("role", role);

    if (data.user) {
      const normalizedUser = normalizeUser(data.user);
      localStorage.setItem("user", JSON.stringify(normalizedUser));
      localStorage.setItem("userId", normalizedUser.id);
    }

    toast.success("Login successful!");
    setTimeout(() => {
    if (role === "doctor") {
      navigate("/doctor/dashboard");
    } else {
      navigate("/user/dashboard");
    }
  }, 1000);
  } catch (error) {
    toast.error(error.message);
  }
  finally {
      setLoading(false);
    }
};

  //Handle Send/Resend OTP
const handleSendOrResendOtp = async () => {
  setOtp(["", "", "", ""]);
  setOtpSentVisible(false); // reset popup

  try {
    if (!otpSent) {
      await sendOtp(); // Wait for success
    } else {
      await resendOtp(); // Wait for success
    }

    // Only after success
    setOtpSentVisible(true);
    setResendDisabled(true);
    setCountdown(60);
    setResendCount((prev) => prev + 1);

    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current);
          setResendDisabled(false);
          setOtpSentVisible(false);
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
  } catch (error) {
    // Already handled in sendOtp / resendOtp with toast
    setResendDisabled(false); // make sure button stays enabled
  }
};

  //Handle Login
const handleLogin = async (e) => {
  e.preventDefault();

  const phoneRegex = /^[0-9]{10}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!phoneRegex.test(identifier) && !emailRegex.test(identifier)) {
    setIdentifierError("Please enter a valid phone number or email");
    return;
  }
  setLoading(true);

  try {
    if (loginWithOtp) {
      await verifyOtp();
    } else {
      const payload = {
        email: identifier.includes("@") ? identifier : undefined,
        phone_number: !identifier.includes("@") ? identifier : undefined, // ✅ FIX: use phone_number, not mobile
        password,
      };

      Object.keys(payload).forEach((key) => !payload[key] && delete payload[key]);

      const res = await fetch(
        role === "doctor"
          ? `${API_BASE_URL}/api/doctors/login`
          : `${API_BASE_URL}/api/user/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (!res.ok) {
  // Customize error messages based on backend response
  if (data.message?.toLowerCase().includes("user not found")) {
    toast.error("Email or password is incorrect");
  } else if (data.message?.toLowerCase().includes("invalid password")) {
    toast.error("Incorrect password");
  } else if (data.message?.toLowerCase().includes("invalid credentials")) {
    toast.error("Email or password is incorrect");
  } else {
    toast.error(data.message || "Login failed. Please try again.");
  }
  return;
}


      const authToken = data.authToken || data.token;

      if (!authToken) {
    toast.error(data.message || "Email or password is incorrect");
        return;
      }

      localStorage.setItem("authToken", authToken);
      localStorage.setItem("role", role);

      if (data.user) {
        const normalizedUser = normalizeUser(data.user);
        localStorage.setItem("user", JSON.stringify(normalizedUser));
        localStorage.setItem("userId", normalizedUser.id);
      }

      toast.success("Login successful!");
      setTimeout(() => {
      if (role === "doctor") {
        navigate("/doctor/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    },2000);
  } }catch (error) {
  toast.error(error.message || "Network error. Please try again.");
} finally{
  setLoading(false);
}
};
  

  return (
    <>
      <style>
        {`
        .login-wrapper input::placeholder { opacity: 0.2; color: #000305; }
        .form-check-input:checked { background-color: #00A99D !important; border-color: #00A99D !important; }
        .form-check-input:focus { box-shadow: 0 0 0 0.2rem rgba(0, 169, 157, 0.25) !important; border-color: #00A99D !important; }

        /* Responsive logo */
        .img-logo {
          width: 100%;
          height: auto;
          object-fit: contain;
        }

        @media (min-width: 768px) and (max-width: 1023px) {
           .img-logo {
          width: 100%;
          height: 50%;
        }
        }

       @media (max-width: 767px) {
  .form-check-input[type="radio"] {
    width: 15px !important;
    height: 15px !important;
    border-radius: 50% !important;
        }}

        @media (max-width: 768px) {
          .img-logo {
            max-width: 250px;
          }
        }

        @media (max-width: 576px) {
          .img-logo {
            max-width: 140px;
          }
        }
          
      `}
      </style>

      <div className="login-wrapper min-vh-100 d-flex justify-content-center align-items-center bg-white">
        <div className="row w-100 mx-0" style={{ maxWidth: "1100px" }}>
{loading && <LoaderOverlay loading={loading} />}


          {/* Left Section */}
          <div className="col-12 col-md-6 d-flex justify-content-center align-items-center p-4 p-lg-5 order-2 order-lg-1 form">
            <div style={{ maxWidth: "464px", width: "100%" }}>
              <h1 className="mb-4 fw-semibold text-center">Login to your account</h1>

              <form onSubmit={handleLogin} autoComplete="off">
                {/* Role Selection */}
                <div className="d-flex justify-content-center gap-4 my-3">
                  <div className="form-check">
                    <input className="form-check-input" type="radio" name="role" id="user" value="user"
                      checked={role === "user"} onChange={(e) => setRole(e.target.value)} />
                    <label className="form-check-label" htmlFor="user">User</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="radio" name="role" id="doctor" value="doctor"
                      checked={role === "doctor"} onChange={(e) => setRole(e.target.value)} />
                    <label className="form-check-label" htmlFor="doctor">Doctor</label>
                  </div>
                </div>

                {/* Identifier */}
                <div className="mb-3">
                  <label htmlFor="identifier" className="form-label">Phone Number or Email</label>
                  <div className="input-group">
                    <input type="text" className="form-control" id="identifier" placeholder="Enter phone number or email"
                      style={{ borderRadius: "28px" }} value={identifier} onChange={(e) => setIdentifier(e.target.value)} autoComplete="off" />
                  </div>
                  {identifierError && <div className="text-danger mt-1" style={{ fontSize: "0.875rem" }}>{identifierError}</div>}
                </div>

                {/* Password / OTP */}
                {!loginWithOtp ? (
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <div style={{ position: "relative" }}>
                      <input type={showPassword ? "text" : "password"} className="form-control" id="password"
                        placeholder="Enter password" style={{ borderRadius: "28px", paddingRight: "40px" }}
                        value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
                      <span onClick={() => setShowPassword(!showPassword)}
                        style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#6c757d" }}>
                        {showPassword ? <FaEye /> : <FaEyeSlash/>}
                      </span>
                    </div>
                    {passwordError && <div className="text-danger mt-1" style={{ fontSize: "0.875rem" }}>{passwordError}</div>}
                  </div>
                ) : (
                  <div className="mb-3">
                    <label className="form-label">Enter OTP</label>
                    <div className="d-flex justify-content-start gap-3 mb-2">
                      {otp.map((digit, index) => (
                        <input key={index} id={`otp-${index}`} type="text" className="form-control text-center"
                          style={{ width: "50px", height: "50px", borderRadius: "12px", fontSize: "1.25rem" }} maxLength="1"
                          value={digit} onChange={(e) => handleOtpChange(index, e.target.value)} />
                      ))}
                    </div>
                    {passwordError && <div className="text-danger mb-2" style={{ fontSize: "0.875rem" }}>{passwordError}</div>}
                  </div>
                )}

                {/* Toggle + Forgot / Resend in same line */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="form-check form-switch mb-0">
                    <input className="form-check-input" type="checkbox" id="loginWithOtp" checked={loginWithOtp}
                      onChange={() => { setLoginWithOtp(!loginWithOtp); setPasswordError(""); setOtpSentVisible(false); setResendDisabled(false); }} />
                    <label className="form-check-label" htmlFor="loginWithOtp">{loginWithOtp ? "Login with OTP" : "Login with Password"}</label>
                  </div>
                  {!loginWithOtp ? (
<Link to={`/forgot-password?role=${role}`} style={{ color: "#00A99D" }}>Forgot your password?</Link>
                  ) : (
                   <button
  type="button"
  className="btn btn-link p-0"
  style={{ fontSize: "0.9rem", color: resendDisabled ? "gray" : "#00A99D" }}
  onClick={handleSendOrResendOtp}
  disabled={resendDisabled || resendCount >= 2}
>
  {otpSent ? (resendDisabled ? `Resend OTP (${countdown}s)` : "Resend OTP") : "Send OTP"}
</button>

                  )}
                </div>

                {/* OTP Sent popup */}
                {otpSentVisible && loginWithOtp && !resendDisabled && (
                  <div className="text-success mb-2" style={{ fontSize: "0.875rem" }}>OTP sent successfully!</div>
                )}

                {/* Submit */}
                <button type="submit" className="w-100 text-white border-0" style={{ backgroundColor: "#00A99D", padding: "11px", borderRadius: "28px", fontWeight: "500" }}>Log in</button>

                {/* Sign Up & Contact */}
                <div className="mt-3" style={{ fontSize: "0.9rem" }}>
                  Don’t have an account? <Link to={role === "doctor" ? "/register" : "/signup"} style={{ color: "#00A99D" }} className="text-decoration-none">{role === "doctor" ? "Register" : "Sign up!"}</Link>
                </div>
                <div className="mt-2">
                  <Link to="/contact" style={{ color: "#00A99D" }} className="text-decoration-none">Contact us</Link>
                </div>
              </form>
            </div>
          </div>

          {/* Right Section */}
          <div></div>
          <div className="col-12 col-md-6 d-flex justify-content-center align-items-center p-5 order-1 order-md-2">
            <img src={logo} alt="eAsha Healthcare" className="img-fluid img-logo" />
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
