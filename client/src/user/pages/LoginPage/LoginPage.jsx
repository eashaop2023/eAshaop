import logo from "../../assets/eAshalogo.png";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 

function LoginPage() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    const phoneRegex = /^[0-9]{10}$/;
    let valid = true;

    // Phone validation
    if (!phoneRegex.test(phone)) {
      setPhoneError("Please enter a valid 10-digit phone number");
      valid = false;
    } else {
      setPhoneError("");
    }

    // Password validation
    if (password !== "easha") {
      setPasswordError("Incorrect password");
      valid = false;
    } else {
      setPasswordError("");
    }

    if (valid) {
      navigate("/dashboard");
    }
  };

  return (
    <>
     <style>
  {`
    .login-wrapper input::placeholder {
      opacity: 0.2;
      color: #000305;
    }

    @media (min-width: 1024px) {
      .login-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .img-logo {
        width: 350px !important;
        height: 303px !important;
      }
    }

  @media (min-width: 768px) and (max-width: 1024px) {
  .login-wrapper .row {
    display: flex !important;
    flex-wrap: nowrap !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 0 !important; /* smaller gap */
    --bs-gutter-x: 0 !important; /* remove bootstrap gutter */
  }

  .login-wrapper .col-md-6 {
    flex: 0 1 auto !important; /* only take needed space */
    max-width: unset !important; /* not forced to 50% */
    padding: 0 !important; /* remove padding */
  }

  .form {
    max-width: 464px;
    width: 100%;
  }

  .img-logo {
    width: 250px !important;
    height: 190px !important;
  }
}


    @media (min-width: 425px) and (max-width: 767px) {
      .img-logo {
        width: 100px !important;
        height: 130px !important;
      }
        .form {
        margin-top: -30px;}
    }
      @media  (max-width: 425px) {
      .img-logo {
        width: 77px !important;
        height: 102px !important;
        margin-bottom: 0px;
        padding-bottom: 0px;
      }
        .form{
        margin-top: -30px;
        }
    }
  `}
</style>


      <div className="login-wrapper min-vh-100 d-flex justify-content-center align-items-center bg-white">
        <div className="row w-100 mx-0" style={{ maxWidth: "1100px" }}>
          {/* Left Section */}
          <div className="col-12 col-md-6 d-flex justify-content-center align-items-center p-4 p-lg-5 order-2 order-lg-1 form">
            <div style={{ maxWidth: "464px",width:'100%' }}>
              <h1 className="mb-4 fw-semibold text-center ">
                Login to your account
              </h1>

              <form onSubmit={handleLogin}>
                {/* Phone Number */}
                <div className="mb-3">
                  <label htmlFor="phone" className="form-label" >
                    Phone Number
                  </label>
                  <div className="input-group">
                    <span
                      className="input-group-text"
                      style={{ borderRadius: "28px 0 0 28px" }}
                    >
                      +91
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      id="phone"
                      placeholder="Enter phone number"
                      style={{ borderRadius: "0 28px 28px 0" }}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  {phoneError && (
                    <div className="text-danger mt-1" style={{ fontSize: "0.875rem" }}>
                      {phoneError}
                    </div>
                  )}
                </div>

                {/* Password */}
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Enter password"
                    style={{ borderRadius: "28px" }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {passwordError && (
                    <div className="text-danger mt-1" style={{ fontSize: "0.875rem" }}>
                      {passwordError}
                    </div>
                  )}
                </div>

                {/* Forgot Password */}
                <div className="mb-2">
                  <Link
                    to="/forgot-password"
                    style={{ fontSize: "0.9rem", color: "#00A99D" }}
                  >
                    Forgot your password?
                  </Link>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-100 text-white border-0"
                  style={{
                    backgroundColor: "#00A99D",
                    padding: "11px",
                    borderRadius: "28px",
                    fontWeight: "500",
                  }}
                >
                  Log in
                </button>

                {/* Sign Up & Contact */}
                <div className="mt-3" style={{ fontSize: "0.9rem" }}>
                  Don’t have an account?{" "}
                  <Link to="/signup" style={{ color: "#00A99D" }} className="text-decoration-none">
                    Sign up!
                  </Link>
                </div>
                <div className="mt-2">
                  <Link to="/contact" style={{ color: "#00A99D" }} className="text-decoration-none">
                    Contact us
                  </Link>
                </div>
              </form>
            </div>
          </div>

          {/* Right Section */}
          <div className="col-12 col-md-6 d-flex justify-content-center align-items-center p-4 order-1  order-md-2">
            <img
              src={logo}
              alt="eAsha Healthcare"
              className="img-fluid img-logo"
              // style={{ width: "77px", height: "102px" }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
