import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
// import Navbar from "../Navbar";

const FamilyMembersForm = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    status: "",
  });

  const [focused, setFocused] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Added:", form);
  };

  const inputStyle = {
    border: "1px solid #8E8E8E",
    borderRadius: "20px",
    padding: "10px 15px",
    outline: "none",
    transition: "box-shadow 0.2s ease",
  };

  const inputFocusStyle = {
    boxShadow: "0 0 0 0.2rem rgba(0, 169, 157, 0.25)",
  };

  return (
    <>
     
      <style>
        <style>
  {`
    /* Small devices */
    @media (max-width: 576px) {
      .family-container {
        padding: 35px 10px 20px 40px !important;
      }
      .family-heading {
        padding-left: 50px !important;
        font-size: 1.4rem !important;
      }
      h2 {
            margin-left: 30px !important;
      }
    }

    /* Medium devices */
    @media (min-width: 577px) and (max-width: 768px) {
      .family-container {
        padding: 55px 15px 25px 15px !important;
      }
      .family-heading {
        padding-left: 30px !important;
        font-size: 1.6rem !important;
      }
    }

    /* Small laptops (769px to 1024px) */
    @media (min-width: 769px) and (max-width: 1024px) {
      .family-container {
        padding: 60px 20px 25px 20px !important;
        position: relative !important; /* prevent overlap issues */
        left: 180px !important;
      }
      .family-heading {
        padding-left: 10px !important;
        font-size: 1.7rem !important;
      }
    }

    /* Large devices (above 1024px) keep your fixed layout */
    @media (min-width: 1025px) {
      .family-container {
        padding: 0px 15px 0px 0px !important;
        margin-top:80px;
      }
      .family-heading {
        padding-left: 0px !important;
        font-size: 1.8rem !important;
      }
    }
      @media (min-width : 1440px) {
      .family-container {
        margin-top : 40px !important;
        padding : 0px 220px 0px 0px !important;
      }
      }
  `}
</style>

      </style>

      <div
        className="container family-container"
        style={{
          maxWidth: "100%",
          fontFamily: "Urbanist, sans-serif",
          position: "fixed",
          top:"70px",
          left:"0px"
        }}
      >
        {/* Heading Row */}
        <div
          className="d-flex align-items-center mb-3 family-heading"
          style={{
            maxWidth: "617px",
            margin: "0 auto",
            justifyContent: "space-between",
          }}
        >
          <h2 style={{ fontWeight: "500", color: "#252525", margin: 0 }}>
            Family Members
          </h2>
        </div>

        <div style={{ maxWidth: "617px", margin: "0 auto" }}>
          <form
            onSubmit={handleSubmit}
            className="d-flex flex-column gap-4 mt-3"
          >
            <div>
              <label htmlFor="fullName" className="form-label">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                id="fullName"
                className="form-control"
                style={{
                  ...inputStyle,
                  ...(focused === "fullName" ? inputFocusStyle : {}),
                  width: "100%",
                  height: "48px",
                }}
                value={form.fullName}
                onChange={handleChange}
                onFocus={() => setFocused("fullName")}
                onBlur={() => setFocused("")}
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="form-control"
                style={{
                  ...inputStyle,
                  ...(focused === "email" ? inputFocusStyle : {}),
                  width: "100%",
                  height: "48px",
                }}
                value={form.email}
                onChange={handleChange}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused("")}
                required
              />
            </div>

            <div>
              <label htmlFor="status" className="form-label">
                Account Status
              </label>
              <input
                type="text"
                name="status"
                id="status"
                className="form-control"
                style={{
                  ...inputStyle,
                  ...(focused === "status" ? inputFocusStyle : {}),
                  width: "100%",
                  height: "48px",
                }}
                value={form.status}
                onChange={handleChange}
                onFocus={() => setFocused("status")}
                onBlur={() => setFocused("")}
                required
              />
            </div>

            <div className="d-flex justify-content-center">
              <button
                type="submit"
                className="btn"
                style={{
                  backgroundColor: "#00A99D",
                  color: "white",
                  borderRadius: "20px",
                  padding: "8px 24px",
                  border: "none",
                }}
              >
                Add Family Member
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default FamilyMembersForm;
