import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../.././assets/eAshalogo.png"; 
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_BASE_URL } from "../../api-config";


const ContactForm = () => {
  const [formData, setFormData] = useState({
    role: "user",
    name: "",
    number: "",
    message: "",
    notRobot: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "number") {
      const numbersOnly = value.replace(/\D/g, "");
      const truncatedNumber = numbersOnly.slice(0, 10);
      setFormData((prev) => ({
        ...prev,
        [name]: truncatedNumber,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.number.length !== 10) {
    toast.error("Mobile number must be exactly 10 digits");
    return;
  }

    try{
      const res=await fetch(`${API_BASE_URL}/api/contact`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(formData),
       });
       const data=await res.json();
       if(!res.ok) throw new Error(data.message || "Failed to send message");
       toast.success(data.message || "Message sent successfully!");
       setFormData({
        role: "user",
        name: "", 
        number: "",
        message: "",
        notRobot: false,
       });
    } catch(err){
      toast.error(err.message);
    }
  };

  return (
    <>
      <style>{`
        .custom-checkbox {
          width: 16px;
          height: 16px;
        }

        @media (max-width: 768px) {
          .logo-top {
            margin-top: 40px;  /* extra top margin only in mobiles */
            max-width: 160px;
          }
        }

        @media (min-width: 769px) {
          .logo-top {
            margin-top: 20px;
            max-width: 200px;
          }
        }
      `}</style>

      <div
        className="container d-flex flex-column align-items-center justify-content-center"
        style={{ minHeight: "100vh", maxWidth: "500px" }}
      >
        {/* Logo always on top */}
        <div className="text-center mb-2">
          <img src={logo} alt="Logo" className="img-fluid logo-top" />
        </div>

        {/* Form */}
        <div className="w-100">
          <div className="card border-0" style={{ borderRadius: "12px" }}>
            <div className="card-body p-4">
              <h1 className="text-center mb-2" style={{ fontWeight: "600" }}>
                Contact us
              </h1>
              <form onSubmit={handleSubmit}>
                <div className="mb-2">
  <label htmlFor="role" className="form-label" style={{ fontWeight: "400", color: "#494949" }}>
    I am a:
  </label>
  <select
    id="role"
    name="role"
    className="form-select"
    value={formData.role || "user"}
    onChange={handleChange}
    required
    style={{ borderRadius: "12px", border: "1px solid #8E8E8E" }}
  >
    <option value="user">User</option>
    <option value="doctor">Doctor</option>
  </select>
</div>

                <div className="mb-2">
                  <label
                    style={{ fontWeight: "400", color: "#494949" }}
                    htmlFor="name"
                    className="form-label"
                  >
                    Full Name (as per aadhar)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    style={{
                      borderRadius: "12px",
                      border: "1px solid #8E8E8E",
                    }}
                    required
                  />
                </div>

                <div className="mb-2">
                  <label
                    style={{ fontWeight: "400", color: "#494949" }}
                    htmlFor="number"
                    className="form-label"
                  >
                    Mobile Number
                  </label>
                  <div className="input-group">
                    <span
                      className="input-group-text"
                      style={{
                        borderRadius: "12px 0 0 12px",
                        border: "1px solid #8E8E8E",
                      }}
                    >
                      +91
                    </span>
                    <input
                      type="tel"
                      className="form-control"
                      id="number"
                      name="number"
                      value={formData.number}
                      onChange={handleChange}
                      maxLength="10"
                      inputMode="numeric"
                      style={{
                        borderRadius: "0 12px 12px 0",
                        border: "1px solid #8E8E8E",
                      }}
                      required
                    />
                  </div>
                </div>

                <div className="mb-2">
                  <label
                    style={{ fontWeight: "400", color: "#494949" }}
                    htmlFor="message"
                    className="form-label"
                  >
                    Message
                  </label>
                  <textarea
                    className="form-control"
                    id="message"
                    name="message"
                    rows="3"
                    value={formData.message}
                    onChange={handleChange}
                    style={{
                      borderRadius: "12px",
                      border: "1px solid #8E8E8E",
                    }}
                    required
                  />
                </div>

                <div className="mb-2 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input custom-checkbox"
                    id="robotCheck"
                    name="notRobot"
                    checked={formData.notRobot}
                    onChange={handleChange}
                    style={{
                      border: "1px solid #8E8E8E",
                      borderRadius: "3px",
                    }}
                    required
                  />
                  <label
                    style={{ fontWeight: "400", color: "#494949" }}
                    className="form-check-label"
                    htmlFor="robotCheck"
                  >
                    I'm not a robot
                  </label>
                </div>

                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn"
                    style={{
                      borderRadius: "28px",
                      backgroundColor: "#00A99D",
                      color: "#ffff",
                      border: "none",
                      padding: "10px",
                      fontWeight: "500",
                    }}
                  >
                    Send message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactForm;
