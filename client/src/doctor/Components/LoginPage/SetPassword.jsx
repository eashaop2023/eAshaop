import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../../api-config";
import EashaLogo from "../../../assets/eAshalogo.png";

const SetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const doctorId = searchParams.get("id") || searchParams.get("doctorId"); // Support both 'id' and 'doctorId' for backward compatibility
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const navigate = useNavigate();

  // Validate token and doctorId on mount
  useEffect(() => {
    if (!token || !doctorId) {
      toast.error("Invalid or missing password setup link. Please contact support.");
      setIsValidating(false);
      setIsValid(false);
    } else {
      setIsValidating(false);
      setIsValid(true);
    }
  }, [token, doctorId]);

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

  if (isValidating) {
    return (
      <div className="position-relative min-vh-100 d-flex justify-content-center align-items-center bg-white px-3">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Validating your link...</p>
        </div>
      </div>
    );
  }

  if (!isValid) {
    return (
      <div className="position-relative min-vh-100 d-flex justify-content-center align-items-center bg-white px-3">
        <div className="text-center w-100" style={{ maxWidth: "420px" }}>
          <div className="logo-wrapper">
            <img src={EashaLogo} alt="eAsha Logo" className="logo-img" />
          </div>
          <h2 className="fw-semibold mb-4">Invalid Link</h2>
          <p className="text-muted mb-4">
            The password setup link is invalid or has expired. Please contact support or request a new link.
          </p>
          <Link to="/doctor/login" className="btn text-white rounded-pill" style={{ background: "#00A99D" }}>
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

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
          Set Your Password
        </h2>
        <p className="text-muted mb-4" style={{ fontSize: "clamp(0.9rem, 1vw + 0.5rem, 1rem)" }}>
          Your account has been approved. Please set a secure password to complete your account setup.
        </p>

        <Formik
          initialValues={{ newPassword: "", confirmPassword: "" }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const response = await fetch(`${API_BASE_URL}/api/doctors/${doctorId}/set-password`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  password: values.newPassword,
                  token: token,
                }),
              });

              const data = await response.json();

              if (!response.ok) {
                throw new Error(data.message || "Failed to set password");
              }

              toast.success("Password set successfully! You can now login.", {
                position: "top-center",
                autoClose: 3000,
              });

              // Redirect to login after 2 seconds
              setTimeout(() => {
                navigate("/doctor/login");
              }, 2000);
            } catch (err) {
              toast.error(err.message || "Failed to set password. Please try again.");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ handleChange, handleBlur, values, isSubmitting }) => (
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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
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
                disabled={isSubmitting}
              >
                {isSubmitting ? "Setting Password..." : "Set Password"}
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
          <Link to="/doctor/login" style={{ color: "#00A99D" }}>
            Log in!
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SetPassword;

