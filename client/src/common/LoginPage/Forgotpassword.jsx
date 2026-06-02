import React from "react";
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import EashaLogo from "../.././assets/eAshalogo.png";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_BASE_URL } from "../../api-config";
import LoaderOverlay from "../../commonComponents/FadeLoader";


const Forgotpassword = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const role = params.get("role") || "user"; // Default to 'user' if not specified
  const navigate = useNavigate();
    const [loading, setLoading] = useState(false); // ✅ Loader state


  // Validation schema for phone or email in one field
  const validationSchema = Yup.object({
    identifier: Yup.string()
      .required("Phone number or email is required")
      .test("is-valid", "Enter a valid phone number or email", function (value) {
        if (!value) return false;

        // Check if it's a valid 10-digit phone number
        const phoneRegex = /^\+91\d{10}$/;
        if (phoneRegex.test(value)) return true;

        // Check if it's a valid email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(value)) return true;
        return false;
      }),
  });

    const apiBase = role === "doctor"
    ? `${API_BASE_URL}/api/doctors/forgot-password/request-otp`
    : `${API_BASE_URL}/api/user/forgot-password/send-otp`;


  return (
    <div className="position-relative min-vh-100 d-flex justify-content-center align-items-center bg-white px-3">
      <LoaderOverlay loading={loading} />
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
          number or email you registered to eAsha.
        </p>

        <Formik
          initialValues={{ identifier: "" }}
          validationSchema={validationSchema}
onSubmit={async (values, { setSubmitting }) => {
  try {
    const input = values.identifier.trim();

    // 1️⃣ Check if input is empty
    if (!input) {
      toast.error("Please enter a phone number or email", { position: "top-center" });
      setSubmitting(false);
      return;
    }

    // 2️⃣ Determine verifyBy and validate input format
    let verifyBy;
    if (input.includes("@")) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input)) {
        toast.error("Invalid email format", { position: "top-center" });
        setSubmitting(false);
        return;
      }
      verifyBy = "email";
    } else {
      // Assume phone
      const phoneRegex = /^\+91\d{10}$/;
      if (!phoneRegex.test(input)) {
        toast.error("Invalid phone number. Include country code +91", { position: "top-center" });
        setSubmitting(false);
        return;
      }
      verifyBy = "phone";
    }

    // 3️⃣ Prepare payload
    const payload = { verifyBy, value: input };
    setLoading(true); // Show loader
    console.log("Sending payload:", payload);

    // 4️⃣ Call backend API
    const res = await fetch(apiBase, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    console.log("Response from backend:", res.status, data);

    // 5️⃣ Handle backend errors
    if (!res.ok) {
      if (data.message?.toLowerCase().includes("not found")) {
        toast.error("Invalid email or phone number", { position: "top-center" });
      } else {
        toast.error(data.message || "Failed to send OTP", { position: "top-center" });
      }
      setSubmitting(false);
      return;
    }
    toast.success("OTP sent successfully!", { position: "top-center", autoClose: 1500 });

setTimeout(() => {
    // 6️⃣ Suess → Navigate to OTP page
    navigate("/forgot-otp", {
      state: {
        from: "forgot-password",
        identifier: input,
        userId: data.userId || null,
        doctorId: data.doctorId || null,
        role,
      },
    });
}, 1000); // Navigate after 2 seconds
  } catch (error) {
    console.error("Forgot Password Error:", error);
    toast.error("Something went wrong. Please try again.", { position: "top-center" });
  } finally {
    setSubmitting(false);
    setLoading(false);
  }
}}
        >
          {({ setFieldValue }) => (
            <Form autoComplete="off">
              <div
                className="text-start mb-3 mx-auto"
                style={{ maxWidth: "400px" }}
              >
                <label
                  htmlFor="identifier"
                  className="form-label"
                  style={{
                    color: "#494949",
                    fontSize: "clamp(1rem, 1.2vw + 0.5rem, 1.125rem)",
                  }}
                >
                  Phone Number / Email
                </label>
                <Field name="identifier">
                  {({ field }) => (
                    <input
                      type="text"
                      placeholder="Enter phone number or email"
                      className="form-control"
                      style={{
                        borderRadius: "28px",
                        fontSize: "1rem",
                        padding: "0.75rem 1rem",
                      }}
                      value={field.value}
                      onChange={(e) => {
                        let input = e.target.value.trim();

                        // If only numbers are typed, auto-add +91
                        const digitsOnly = input.replace(/\D/g, "");
                        if (digitsOnly.length === 10 && /^\d+$/.test(input)) {
                          input = "+91" + digitsOnly;
                        }

                        setFieldValue("identifier", input);
                      }}
                    />
                  )}
                </Field>

                <div style={{ minHeight: "20px", marginTop: "5px" }}>
                  <ErrorMessage name="identifier">
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
                Send OTP
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
