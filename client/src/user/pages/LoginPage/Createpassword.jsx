import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import EashaLogo from "../../assets/eAshalogo.png";

const Createpassword = () => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    newPassword: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
        "Password must contain at least one uppercase, one lowercase, one number and one special character"
      )
      .required("New Password is required"),

    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Passwords must match")
      .required("Confirm Password is required"),
  });

  return (
    <div className="position-relative min-vh-100 d-flex justify-content-center align-items-center bg-white px-3">
      <style>{`
        .logo-img {
          height: 4.563rem;
          width: 5.56rem;
        }

        .logo-wrapper {
          position: absolute;
          top: 2.313rem;
          left: 6.563rem;
        }
        .logo-wrapper {
          position: absolute;
          top: 2.313rem;
          left: 6.563rem;
          
        }

        .logo-img {
          height: 4.563rem;
          width: 5.56rem;
        }
           .password-toggle {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
          color: #00A99D;
          font-size: 1.25rem;
        }

        .position-relative-input {
          position: relative;
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
           .password-toggle {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
          color: #00A99D;
          font-size: 1.25rem;
          }
        .position-relative-input {
          position: relative;
        }
          

        @media (max-width: 991.98px) {
          .logo-wrapper {
            position: relative !important;
            top: unset;
            left: unset;
            margin-bottom: 8px;
            display: flex;
            justify-content: center;
            width: 100%;
          }
        }

       
      `}</style>

      <div className="text-center w-100" style={{ maxWidth: "420px" }}>
        <div className="logo-wrapper">
          <img src={EashaLogo} alt="eAsha Logo" className="logo-img" />
        </div>

        <h2
          className="fw-semibold"
          style={{
            fontSize: "clamp(1.5rem, 2vw + 1rem, 2.2rem)",
            marginBottom: "1rem",
          }}
        >
          Create a Password
        </h2>

        <Formik
          initialValues={{ newPassword: "", confirmPassword: "" }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            console.log("Password changed:", values);

            // Show success toast
            toast.success("Password changed successfully!", {
              position: "top-center",
              autoClose: 2000,
            });

            // Redirect after 2 seconds
            setTimeout(() => {
              navigate("/login");
            }, 2000);
          }}
        >
          {({ handleChange, handleBlur, values }) => (
            <Form autoComplete="off">
              {/* New Password */}
              <div className="text-start mb-3">
                <label
                  htmlFor="newPassword"
                  className="form-label"
                  style={{ color: "#494949" }}
                >
                  New Password
                </label>
                <div className="position-relative-input">
                  <Field
                    type={showNewPassword ? "text" : "password"}
                    id="newPassword"
                    name="newPassword"
                    className="form-control p-2"
                    style={{
                      borderRadius: "28px",
                      borderColor: "gray",
                      boxShadow: "none",
                      outline: "none",
                    }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.newPassword}
                    autoComplete="new-password"
                  />
                  <span
                    className="password-toggle"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <FiEye /> : <FiEyeOff />}
                  </span>
                </div>
                <ErrorMessage name="newPassword">
                  {(msg) => <div className="text-danger small mt-1">{msg}</div>}
                </ErrorMessage>
              </div>

              {/* Confirm Password */}
              <div className="text-start mb-4">
                <label
                  htmlFor="confirmPassword"
                  className="form-label"
                  style={{ color: "#494949" }}
                >
                  Confirm Password
                </label>
                <div className="position-relative-input">
                  <Field
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    className="form-control p-2"
                    style={{
                      borderRadius: "28px",
                      borderColor: "gray",
                      boxShadow: "none",
                      outline: "none",
                    }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.confirmPassword}
                    autoComplete="new-password"
                  />
                  <span
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FiEye /> : <FiEyeOff />}
                  </span>
                </div>
                <ErrorMessage name="confirmPassword">
                  {(msg) => <div className="text-danger small mt-1">{msg}</div>}
                </ErrorMessage>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="btn text-white w-100 rounded-pill mb-3"
                style={{
                  background: "#00A99D",
                  fontSize: "clamp(1rem, 1.2vw + 0.5rem, 1.125rem)",
                }}
              >
                Submit
              </button>
            </Form>
          )}
        </Formik>

        {/* Sign In */}
        <p
          className="fw-medium text-start"
          style={{
            color: "#494949",
            fontSize: "clamp(0.7rem, 1.2vw + 0.5rem, 1rem)",
          }}
        >
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#00A99D" }}>
            Log in!
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Createpassword;
