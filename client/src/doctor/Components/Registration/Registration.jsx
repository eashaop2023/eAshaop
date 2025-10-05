import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../../api-config";

const PersonalDetailsForm = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(1);
  const [showPopup, setShowPopup] = useState(false);

  const availableLanguages = ["English", "Hindi", "Telugu", "Tamil", "Kannada"];

  const [formData, setFormData] = useState({
    firstName: "",
    age: "",
    hospitalAddress: "",
    hospitalName: "",
    qualification: "",
    university: "",
    experience: "",
    expertise: "",
    speciality: "",
    consultationFee: "",
    gender: "",
    consultantMode: "",
    phone: "",
    email: "",
    language: [], // multiple
    description: "",
    photo: null,
    photoPreview: null,
  });

  const [files, setFiles] = useState({
    license: null,
    idProof: null,
    qualification: null,
  });

  const [error, setError] = useState("");

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleChange("photo", file);
      handleChange("photoPreview", URL.createObjectURL(file));
    }
  };

  const validateStep1 = () => {
    for (let key in formData) {
      if (
        key !== "photo" &&
        key !== "photoPreview" &&
        key !== "language" &&
        !formData[key]
      ) {
        if (Array.isArray(formData[key]) && formData[key].length > 0) continue;
        setError("Please fill all required fields before continuing.");
        return false;
      }
    }
    setError("");
    return true;
  };

  const validateStep2 = () => {
    for (let key in files) {
      if (!files[key]) {
        setError("Please upload all required documents.");
        return false;
      }
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateStep2()) return;

  try {
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.firstName);
    formDataToSend.append("age", formData.age);
    formDataToSend.append("hospitalLocation", formData.hospitalAddress);
    formDataToSend.append("hospitalName", formData.hospitalName);
    formDataToSend.append("education", formData.qualification);
    formDataToSend.append("university", formData.university);
    formDataToSend.append("experience", formData.experience);
    formDataToSend.append("areaOfInterest", formData.expertise);
    formDataToSend.append("speciality", formData.speciality);
    formDataToSend.append("consultationFee", formData.consultationFee);
    formDataToSend.append("gender", formData.gender);
    formDataToSend.append("consultationMode", formData.consultantMode);
    formDataToSend.append("mobile", `+91${formData.phone}`);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("about", formData.description);
    formDataToSend.append("languages", formData.language.join(","));
    formDataToSend.append("verifyBy", "email"); // or "phone"

    // Files
    if (formData.photo) formDataToSend.append("profileImage", formData.photo);
    if (files.license) formDataToSend.append("medicalLicense", files.license);
    if (files.idProof) formDataToSend.append("govtId", files.idProof);
    if (files.qualification)
      formDataToSend.append("educationCertificate", files.qualification);

    const res = await fetch(`${API_BASE_URL}/api/doctors/register`, {
      method: "POST",
      body: formDataToSend,
    });

    const data = await res.json();
    console.log("Doctor data:", data.doctor);

    if (!res.ok) throw new Error(data.message || "Failed to register doctor");

    alert("Registered successfully! OTP has been sent to your email/phone.");
  navigate("/otp-register", { state: {
        doctorId: data.doctor._id,   // <-- Doctor's _id from backend
        identifier: data.doctor.email, // <-- Email from backend
        from: "signup",
      }, });
  } catch (error) {
    alert(error.message);
  }
};
  const handleOkClick = () => {
    setShowPopup(false);
    navigate("/login");
  };

  const UploadBox = ({ label, name }) => (
    <div className="mb-4">
      <label className="form-label fw-semibold">
        {label} <span className="text-danger">*</span>
      </label>
      <div
        className={`border border-2 border-dashed rounded-3 p-3 text-center ${
          files[name] ? "border-secondary bg-light" : "border-muted"
        }`}
      >
        <input
          type="file"
          name={name}
          className="form-control d-none"
          accept=".jpg,.jpeg,.png,.pdf"
          id={name}
         onChange={(e) =>
    setFiles((prev) => ({
      ...prev,
      [name]: e.target.files[0] || null, // store File object
    }))
  }

        />
        <label htmlFor={name} className="fw-bold text-primary cursor-pointer">
          Browse
        </label>
        <p className="text-muted small mt-2">Max Size: 2MB</p>
      </div>
{files[name] && (
  <p className="mt-2">
    Selected: <span className="fw-semibold">{files[name]?.name}</span>
  </p>
)}
    </div>
  );

  const isStep2Complete = Object.values(files).every((file) => file !== null);

  return (
    <div className="container my-5">
      {/* Steps on Top */}
      <div className="d-flex justify-content-center mb-5">
        {[1, 2].map((step) => (
          <div
            key={step}
            className={`d-flex align-items-center mx-4 ${
              activeStep === step ? "fw-bold" : "text-muted"
            }`}
            onClick={() => {
              if (step === 1 || validateStep1()) setActiveStep(step);
            }}
            style={{ cursor: "pointer" }}
          >
            <div
              className={`rounded-circle d-flex justify-content-center align-items-center me-2 ${
                activeStep === step
                  ? "text-white"
                  : "border border-secondary text-secondary"
              }`}
              style={{
                width: "36px",
                height: "36px",
                backgroundColor: activeStep === step ? "#00A99D" : "transparent",
                borderColor: activeStep === step ? "#00A99D" : undefined,
              }}
            >
              {step}
            </div>
            <span>Step {step}</span>
          </div>
        ))}
      </div>

      {/* Step 1 */}
      {activeStep === 1 && (
        <div className="mx-auto" style={{ maxWidth: "1000px" }}>
          <h2 className="mb-4">Personal & Professional Details</h2>

          {/* Upload photo */}
          <div className="d-flex justify-content-center mb-4">
            <div
              className="border rounded-circle d-flex flex-column justify-content-center align-items-center overflow-hidden upload-circle"
              style={{
                cursor: "pointer",
                position: "relative",
              }}
            >
              {formData.photoPreview ? (
                <img
                  src={formData.photoPreview}
                  alt="Profile Preview"
                  className="w-100 h-100 object-fit-cover"
                />
              ) : (
                <>
                  <span className="fs-4">⬆️</span>
                  <small>Upload</small>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                className="position-absolute top-0 start-0 w-100 h-100 opacity-0"
                onChange={handleImageUpload}
              />
            </div>
          </div>

          {/* Form */}
          <form className="row g-3">
            {[
              { name: "firstName", label: "First Name", type: "text", lettersOnly: true },
              { name: "age", label: "Age", type: "number" },
              { name: "hospitalAddress", label: "Hospital/Clinic Address" },
              { name: "hospitalName", label: "Hospital/Clinic Name" },
              { name: "qualification", label: "Qualification" },
              { name: "university", label: "University" },
              { name: "experience", label: "Years of Experience", type: "number" },
              { name: "expertise", label: "Areas of Expertise" },
              { name: "speciality", label: "Speciality" },
              { name: "consultationFee", label: "Consultation Fee", type: "number" },
            ].map(({ name, label, type, lettersOnly }) => (
              <div key={name} className="col-12 col-md-4">
                <label className="form-label">
                  {label} <span className="text-danger">*</span>
                </label>
                <input
                  className="form-control rounded-pill"
                  type={type || "text"}
                  value={formData[name]}
                  onChange={(e) => {
                    let val = e.target.value;
                    if (lettersOnly) val = val.replace(/[^a-zA-Z\s]/g, "");
                    handleChange(name, val);
                  }}
                />
              </div>
            ))}

            {/* Gender */}
            <div className="col-12 col-md-6">
              <label className="form-label">
                Gender <span className="text-danger">*</span>
              </label>
              <select
                className="form-select rounded-pill"
                value={formData.gender}
                onChange={(e) => handleChange("gender", e.target.value)}
              >
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            {/* Consultant Mode */}
            <div className="col-12 col-md-6">
              <label className="form-label">
                Consultant Mode <span className="text-danger">*</span>
              </label>
              <select
                className="form-select rounded-pill"
                value={formData.consultantMode}
                onChange={(e) => handleChange("consultantMode", e.target.value)}
              >
                <option value="">Select</option>
                <option>Video Consultation</option>
                <option>Clinic Visit</option>
                <option>Both</option>
              </select>
            </div>

            {/* Phone */}
            <div className="col-12 col-md-6">
              <label className="form-label">
                Phone Number <span className="text-danger">*</span>
              </label>
              <input
                type="tel"
                className="form-control rounded-pill"
                placeholder="+91"
                value={formData.phone}
                onChange={(e) =>
                  handleChange("phone", e.target.value.replace(/[^0-9]/g, ""))
                }
              />
            </div>

            {/* Email */}
            <div className="col-12 col-md-6">
              <label className="form-label">
                Email <span className="text-danger">*</span>
              </label>
              <input
                type="email"
                className="form-control rounded-pill"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>

            {/* Languages */}
            <div className="col-12">
              <label className="form-label">
                Languages Spoken <span className="text-danger">*</span>
              </label>
              <div className="d-flex flex-wrap gap-3">
                {availableLanguages.map((lang) => (
                  <div className="form-check" key={lang}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={lang}
                      checked={formData.language.includes(lang)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleChange("language", [...formData.language, lang]);
                        } else {
                          handleChange(
                            "language",
                            formData.language.filter((l) => l !== lang)
                          );
                        }
                      }}
                    />
                    <label className="form-check-label" htmlFor={lang}>
                      {lang}
                    </label>
                  </div>
                ))}
              </div>

              <div className="mt-2 d-flex flex-wrap gap-2">
                {formData.language.map((lang) => (
                  <span
                    key={lang}
                    className="badge rounded-pill text-white"
                    style={{ backgroundColor: "#00A99D" }}
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="col-12">
              <label className="form-label">
                Description <span className="text-danger">*</span>
              </label>
              <textarea
                className="form-control"
                rows={4}
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </div>
          </form>

          {error && <p className="text-danger mt-3">{error}</p>}

          <div className="d-flex justify-content-end gap-2 mt-4">
            <button className="btn btn-outline-secondary rounded-pill">
              Cancel
            </button>
            <button
              className="btn text-white rounded-pill"
              style={{ backgroundColor: "#00BFA6", borderColor: "#00A99D" }}
              onClick={(e) => {
                e.preventDefault();
                if (validateStep1()) setActiveStep(2);
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Step 2 */}
      {activeStep === 2 && (
        <div className="mx-auto" style={{ maxWidth: "1000px" }}>
          <h2 className="mb-4">Verification</h2>
          <UploadBox label="Upload Medical License" name="license" />
          <UploadBox label="Upload Government ID Proof" name="idProof" />
          <UploadBox
            label="Upload Qualification Certificates"
            name="qualification"
          />

          {error && <p className="text-danger mt-3">{error}</p>}

          <div className="d-flex justify-content-between mt-4">
            <button
              className="btn btn-outline-secondary rounded-pill"
              onClick={() => setActiveStep(1)}
            >
              Previous
            </button>
            <button
              className={`btn rounded-pill text-white ${
                isStep2Complete ? "" : "disabled"
              }`}
              style={{
                backgroundColor: isStep2Complete ? "#00BFA6" : "gray",
                borderColor: "#00A99D",
              }}
              onClick={handleSubmit}
              disabled={!isStep2Complete}
            >
              Submit
            </button>
          </div>
        </div>
      )}

      {/* Popup Modal */}
      {showPopup && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-4 text-center">
              <h3 className="mb-3">Thank You!</h3>
              <p className="text-muted mb-4">
                After verification, login credentials will be provided to you.
              </p>
              <button
                className="btn text-white rounded-pill"
                style={{ backgroundColor: "#00BFA6", borderColor: "#00A99D" }}
                onClick={handleOkClick}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          .upload-circle {
            width: 100px;
            height: 100px;
          }

          /* Dropdown color */
          select:focus {
            border-color: #00A99D !important;
            box-shadow: 0 0 0 0.25rem rgba(0,169,157,0.25) !important;
          }
          select option {
            background-color: #fff;
            color: #000;
          }
          select option:hover,
          select option:checked,
          select option:focus,
          select option:active {
            background-color: #00A99D !important;
            color: #fff !important;
          }
        `}
      </style>
    </div>
  );
};

export default PersonalDetailsForm;
