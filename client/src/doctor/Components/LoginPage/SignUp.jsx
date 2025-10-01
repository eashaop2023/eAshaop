import React from "react";
import { useNavigate } from "react-router-dom";
import eAshaLogo from "../../../assets/eAshalogo.png";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const SignUpSchema = Yup.object().shape({
  fullName: Yup.string()
    .required("Full name is required")
    .test(
      "Aadhar-name",
      "Full name as per Aadhar",
      (value) => value && value.trim().split(" ").length >= 2
    ),
  phone: Yup.string()
    .matches(/^\+91[0-9]{10}$/, "Must be a valid 10-digit number")
    .required("Phone number is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  dob: Yup.date().required("Date of birth is required"),
  gender: Yup.string().required("Gender is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/,
      "Password must contain uppercase, lowercase, number & special character"
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Re-enter password is required"),
  acceptTerms: Yup.boolean().oneOf([true], "You must accept the terms"),
});

function SignUp() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(true);
  const [showP, setShowP] = React.useState(true);

  return (
    <>
      <style>
        {`
        /* Desktop adjustments */
        @media (min-width: 1025px) {
          .signup-wrapper {
            display: flex;
            align-items: center;
            justify-content: center;
            padding-left: 50px;
            padding-right: 50px;
          }
          .signup-form {
            margin-right: 40px;
          }
          .img-logo {
            width: 300px;
            height: auto;
          }
        }

        /* Tablets */
        @media (min-width: 768px) and (max-width: 1024px) {
          .img-logo {
            width: 220px;
            height: auto;
          }
        }

        /* Mobiles */
        @media (max-width: 767px) {
          .signup-wrapper {
            flex-direction: column;
            text-align: left;
            padding: 20px;
          }
          .img-logo {
            width: 120px;
            height: auto;
            margin-bottom: 15px;
          }
          .signup-form {
            margin-right: 0;
            text-align: left; /* Make form text left-aligned */
          }
          .form-control,
          .form-select,
          .input-group-text,
          .form-check-label {
            text-align: left; /* Input and labels left-aligned */
          }
        }

        /* Fix password toggle button alignment */
        .password-toggle {
          position: absolute;
          top: 50%;
          right: 15px;
          transform: translateY(-50%);
          border: none;
          background: transparent;
          cursor: pointer;
          color: #555;
        }
        `}
      </style>

      <div className="container-fluid min-vh-100 d-flex align-items-center bg-white signup-wrapper">
        <div
          className="row w-100 mx-0"
          style={{ maxWidth: "1100px", margin: "auto" }}
        >
          {/* Left Section (Form) */}
          <div className="col-12 col-md-6 d-flex align-items-center justify-content-center p-4 order-2 order-md-1 signup-form">
            <div style={{ maxWidth: "500px", width: "100%" }}>
              <Formik
                initialValues={{
                  fullName: "",
                  phone: "+91",
                  email: "",
                  dob: "",
                  gender: "",
                  password: "",
                  confirmPassword: "",
                  acceptTerms: false,
                }}
                validationSchema={SignUpSchema}
                // onSubmit={(values) => {
                //   console.log("Form submitted:", values);
                //   navigate("/otp-verification", {
                //     state: { from: "signup", phone: values.phone, email: values.email },
                //   });
                // }}


                onSubmit={async (values, { setSubmitting, setErrors }) => {
  try {
    const payload = {
      full_name: values.fullName,
      phone_number: values.phone, // Already in +91 format
      gender: values.gender,
      password: values.password,
      email: values.email,
      dob: values.dob,
      verifyBy: values.email ? "email" : "phone", // ✅ choose OTP method
    };

    const res = await fetch("http://localhost:5000/api/user/registration/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Registration failed");

    // ✅ Navigate to OTP page with identifier
    navigate("/otp-verification", {
      state: { 
        from: "signup",
        verifyByValue: values.email || values.phone,
      },
    });
  } catch (err) {
    console.error(err);
    setErrors({ api: err.message });
  } finally {
    setSubmitting(false);
  }
}}

              >
                {({ setFieldValue }) => (
                  <Form>
                    <h1 className="mb-4 fw-semibold text-center text-md-start">Sign up</h1>

                    {/* Full Name */}
                    <div className="mb-2">
                      <label className="form-label">Full Name</label>
                      <Field
                        name="fullName"
                        className="form-control rounded-pill"
                        placeholder="Enter full name"
                      />
                      <ErrorMessage
                        name="fullName"
                        component="div"
                        className="text-danger small"
                      />
                    </div>

                    {/* Phone Number */}
                    <div className="mb-2">
                      <label className="form-label">Phone number</label>
                      <div className="input-group">
                        <span className="input-group-text">+91</span>
                        <input
                          name="phone"
                          type="text"
                          inputMode="numeric"
                          maxLength="10"
                          placeholder="Enter phone number"
                          className="form-control rounded-end"
                          onChange={(e) => {
                            const cleaned = e.target.value.replace(/\D/g, "");
                            if (cleaned.length <= 10) {
                              setFieldValue("phone", "+91" + cleaned);
                            }
                          }}
                        />
                      </div>
                      <ErrorMessage
                        name="phone"
                        component="div"
                        className="text-danger small"
                      />
                    </div>

                    {/* Email */}
                    <div className="mb-2">
                      <label className="form-label">Email</label>
                      <Field
                        name="email"
                        type="email"
                        className="form-control rounded-pill"
                        placeholder="Enter email address"
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-danger small"
                      />
                    </div>

                    {/* DOB & Gender */}
                    <div className="row mb-2">
                      <div className="col">
                        <label className="form-label">Date of birth</label>
                        <Field
                          type="date"
                          name="dob"
                          className="form-control rounded-pill"
                        />
                        <ErrorMessage
                          name="dob"
                          component="div"
                          className="text-danger small"
                        />
                      </div>
                      <div className="col">
                        <label className="form-label">Gender</label>
                        <Field
                          as="select"
                          name="gender"
                          className="form-select rounded-pill"
                        >
                          <option value="">Select</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </Field>
                        <ErrorMessage
                          name="gender"
                          component="div"
                          className="text-danger small"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="mb-2 position-relative">
                      <label className="form-label">Password</label>
                      <Field
                        type={showPassword ? "password" : "text"}
                        name="password"
                        className="form-control rounded-pill"
                        placeholder="Enter password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="password-toggle"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="text-danger small"
                      />
                    </div>

                    {/* Confirm Password */}
                    <div className="mb-2 position-relative">
                      <label className="form-label">Re-enter Password</label>
                      <Field
                        type={showP ? "password" : "text"}
                        name="confirmPassword"
                        className="form-control rounded-pill"
                        placeholder="Re-enter password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowP(!showP)}
                        className="password-toggle"
                      >
                        {showP ? <FaEyeSlash /> : <FaEye />}
                      </button>
                      <ErrorMessage
                        name="confirmPassword"
                        component="div"
                        className="text-danger small"
                      />
                    </div>

                    {/* Terms */}
                    <div className="form-check mb-2">
                      <Field
                        type="checkbox"
                        name="acceptTerms"
                        className="form-check-input"
                        id="acceptTerms"
                      />
                      <label
                        htmlFor="acceptTerms"
                        className="form-check-label small"
                      >
                        I understand that by providing this consent, I am allowing
                        this application to store my personal information and
                        acknowledging that admin can contact me on my Phone Number
                        and Email Address if admin requires further information or
                        clarification
                      </label>
                    </div>
                    <ErrorMessage
                      name="acceptTerms"
                      component="div"
                      className="text-danger small"
                    />

                    {/* Submit */}
                    <button
                      type="submit"
                      className="btn w-100 text-white"
                      style={{
                        backgroundColor: "#00A99D",
                        padding: "11px",
                        borderRadius: "28px",
                        fontWeight: "500",
                      }}
                    >
                      Verify OTP
                    </button>

                    <p className="mt-3 text-muted small text-center text-md-start">
                      Already registered?{" "}
                      <span
                        onClick={() => navigate("/login")}
                        className="text-decoration-none"
                        style={{ color: "#00A99D", cursor: "pointer" }}
                      >
                        Log in
                      </span>
                    </p>
                  </Form>
                )}
              </Formik>
            </div>
          </div>

          {/* Right Section (Logo) */}
          <div className="col-12 col-md-5 d-flex justify-content-center align-items-center order-1 order-md-2">
            <img
              src={eAshaLogo}
              alt="eAsha Healthcare"
              className="img-fluid img-logo"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default SignUp;
