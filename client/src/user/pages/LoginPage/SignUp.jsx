import React from "react";
import { useNavigate } from "react-router-dom";
import eAshaLogo from "../../assets/eAshalogo.png";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import '../../pages/LoginPage/SignUp.css'; // Assuming you have a CSS file for styles
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
    <div className="h-[100vh] overflow-hidden flex items-center justify-center bg-white px-4">
      <div className="form-wrapper h-[115%] max-w-5xl w-full grid grid-cols-1 md:grid-cols-2  gap-22  items-center custom-order-fix no-mobile-gap">
          <div className="form-container h-[90%]  forms-name ">
        <Formik
          initialValues={{
            fullName: "",
            phone: "+91",
            dob: "",
            gender: "",
            password: "",
            confirmPassword: "",
            acceptTerms: false,
          }}
          validationSchema={SignUpSchema}
          onSubmit={(values) => {
            console.log("Form submitted:", values);
            navigate("/otp-verification", {
              state: { from: "signup", phone: values.phone },
            });
          }}
        >
          {({ setFieldValue }) => (
            <Form className="space-y-4 w-full">
              <h1 className="font-urbanist font-semibold text-[41px] leading-[100%] text-center">
                Sign up
              </h1>

              {/* Full Name */}
              <div>
                <label className="font-urbanist text-[18px] text-[#494949]">
                  Full name
                </label>
                <Field
                  name="fullName"
                  className="w-full h-[50px] border border-gray-400 rounded-xl px-3 py-2 focus:outline-none focus:ring"
                />
                <ErrorMessage
                  name="fullName"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="font-urbanist text-[18px] text-[#494949]">
                  Phone number
                </label>
                <div className="flex gap-3">
                  <div className="w-28 h-[50px] flex items-center justify-center border border-gray-400 rounded-xl bg-gray-100 text-gray-700 font-medium country-code">
                    +91
                  </div>
                  <input
                    name="phone"
                    type="text"
                    inputMode="numeric"
                    maxLength="10"
                    placeholder="Enter phone number"
                    className="w-full h-[50px] border border-gray-400 rounded-xl px-3 py-2 focus:outline-none focus:ring"
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
                  className="text-red-500 text-sm"
                />
              </div>

              {/* DOB & Gender */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-urbanist text-[18px] text-[#494949]">
                    Date of birth
                  </label>
                  <Field
                    type="date"
                    name="dob"
                    className="w-full h-[50px] border border-gray-400 rounded-xl px-3 py-2 focus:outline-none focus:ring"
                  />
                  <ErrorMessage
                    name="dob"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div>
                  <label className="font-urbanist text-[18px] text-[#494949]">
                    Gender
                  </label>
                  <Field
                    as="select"
                    name="gender"
                    className="w-full h-[50px] border border-gray-400 rounded-xl px-3 py-2 focus:outline-none focus:ring"
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </Field>
                  <ErrorMessage
                    name="gender"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="relative">
                <label className="font-urbanist text-[18px] text-[#494949]">
                  Password
                </label>
                <Field
                  type={showPassword ? "password" : "text"}
                  name="password"
                  className="w-full h-[50px] border border-gray-400 rounded-xl px-3 py-2 focus:outline-none focus:ring"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-[43px] eye"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <label className="font-urbanist text-[18px] text-[#494949]">
                  Re-enter Password
                </label>
                <Field
                  type={showP ? "password" : "text"}
                  name="confirmPassword"
                  className="w-full h-[50px] border border-gray-400 rounded-xl px-3 py-2 focus:outline-none focus:ring"
                />
                <button
                  type="button"
                  onClick={() => setShowP(!showP)}
                  className="absolute right-4 top-[43px] eye"
                >
                  {showP ? <FaEyeSlash /> : <FaEye />}
                </button>
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2">
                <Field type="checkbox" name="acceptTerms" className="mt-1 w-4 h-4 shrink-0" />
                <span className="font-urbanist text-[14px] text-[#494949] leading-4">
                  I understand that by providing this consent, I am allowing this
                  application to store my personal information and acknowledging
                  that admin can contact me on my Phone Number and Email Address
                  if admin requires further information or clarification
                </span>
              </div>
              <ErrorMessage
                name="acceptTerms"
                component="div"
                className="text-red-500 text-sm"
              />

              <button
                type="submit"
                className="w-full bg-teal-500 font-urbanist font-medium text-white hover:bg-teal-600"
                style={{padding:"11px",
                       borderRadius:"28px",
                       fontWeight:"500"
                }
                }
              >
                Verify OTP
              </button>

              <p className="text-start mt-3 text-gray-600 font-urbanist">
                Already registered?{" "}
                <span
                  onClick={() => navigate("/login")}
                  className="text-teal-500 cursor-pointer"
                >
                  Log in
                </span>
              </p>
            </Form>
          )}
        </Formik>
        </div>

        <div className="image-wrapper flex justify-center w-full  items-center   ">
          <img
            src={eAshaLogo}
            alt="eAsha Healthcare"
            className="w-[77px] h-[102px] sm:w-[120px] sm:h-[150px] md:w-[180px] md:h-[200px] lg:w-[353px] lg:h-[438px] object-contain"
          />
        </div>
      </div>
    </div>
  );
}

export default SignUp;