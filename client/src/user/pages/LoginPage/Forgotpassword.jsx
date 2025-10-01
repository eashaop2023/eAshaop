import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import EashaLogo from "../../assets/eAshalogo.png";

const Forgotpassword = () => {
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    phone: Yup.string()
      .required("Phone number is required")
      .matches(/^\+91\d{10}$/, "Enter a valid 10-digit phone number"),
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
          className="fw-semibold mt-4 mb-3"
          style={{ fontSize: "clamp(1.5rem, 2vw + 1rem, 2.5rem)" }}
        >
          Forgot Password
        </h2>

        <p
          className="mb-4"
          style={{
            color: "#706e6ed6",
            maxWidth: "400px",
            margin: "0 auto",
            fontSize: "clamp(1rem, 1.2vw + 0.5rem, 1rem)",
          }}
        >
          Don’t worry, resetting your password is easy. Just type in the phone
          number you registered to eAsha.
        </p>

        <Formik
          initialValues={{ phone: "+91" }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            console.log("Submitted Phone:", values.phone);
            navigate("/otp-verification", {
              state: {
                from: "forgot-password",
                phone: values.phone,
              },
            });
          }}
        >
          {({ setFieldValue }) => (
            <Form autoComplete="off">
              <div
                className="text-start mb-3 mx-auto"
                style={{ maxWidth: "400px" }}
              >
                <label
                  htmlFor="phone"
                  className="form-label"
                  style={{
                    color: "#494949",
                    fontSize: "clamp(1rem, 1.2vw + 0.5rem, 1.125rem)",
                  }}
                >
                  Phone Number
                </label>
                <Field name="phone">
                  {({ field }) => (
                    <div
                      className="d-flex align-items-center border form-control p-2"
                      style={{
                        borderColor: "gray",
                        boxShadow: "none",
                        borderRadius: "28px",
                        overflow: "hidden",
                      }}
                    >
                      <span
                        style={{
                          padding: "0 10px",
                          whiteSpace: "nowrap",
                          fontWeight: "500",
                          color: "#333",
                          fontSize: "1rem",
                        }}
                      >
                        +91
                      </span>
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength="10"
                        placeholder="Enter phone number"
                        className="border-0 flex-grow-1"
                        style={{
                          outline: "none",
                          boxShadow: "none",
                          fontSize: "1rem",
                          padding: "0",
                        }}
                        value={field.value.replace("+91", "")}
                        onChange={(e) => {
                          const digitsOnly = e.target.value.replace(/\D/g, "");
                          if (digitsOnly.length <= 10) {
                            const fullNumber = "+91" + digitsOnly;
                            setFieldValue("phone", fullNumber);
                          }
                        }}
                      />
                    </div>
                  )}
                </Field>

                <div style={{ minHeight: "20px", marginTop: "5px" }}>
                  <ErrorMessage name="phone">
                    {(msg) =>
                      msg ? (
                        <div
                          className="text-danger small"
                          style={{ lineHeight: "1.2" }}
                        >
                          {msg}
                        </div>
                      ) : null
                    }
                  </ErrorMessage>
                </div>
              </div>

              <button
                type="submit"
                className="btn text-white w-100 mt-0"
                style={{
                  maxWidth: "400px",
                  background: "#00A99D",
                  fontSize: "clamp(1rem, 1.2vw + 0.5rem, 1.125rem)",
                  borderRadius: "28px",
                }}
              >
                Verify OTP
              </button>
            </Form>
          )}
        </Formik>

        <p
          className="fw-medium mt-2"
          style={{
            color: "#494949",
            fontSize: "clamp(0.7rem, 1.2vw + 0.5rem, 1rem)",
          }}
        >
          Already have an account?{" "}
          <a href="/login" style={{ color: "#00A99D" }}>
            Log in!
          </a>
        </p>
      </div>
    </div>
  );
};

export default Forgotpassword;
