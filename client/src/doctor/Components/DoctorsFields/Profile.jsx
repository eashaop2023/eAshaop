import React, { useState } from "react";
import { Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PersonalDetailsForm = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(1);

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
    phone: "",
    email: "",
    language: "",
    description: "",
  });

  const [files, setFiles] = useState({
    license: null,
    idProof: null,
    qualification: null,
  });

  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const handleOkClick = () => {
    setShowPopup(false);
    navigate("/login");
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateStep1 = () => {
    for (let key in formData) {
      if (!formData[key]) {
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

  const UploadBox = ({ label, name }) => (
    <div className="flex flex-col mb-6">
      <label className="text-sm text-gray-700 mb-2">
        {label} <span className="text-red-500">*</span>
      </label>
      <label
        className={`border-2 border-dashed rounded-xl flex flex-col justify-center items-center 
        p-4 w-full cursor-pointer transition 
        ${
          files[name]
            ? "border-gray-500 bg-gray-50"
            : "border-gray-400 hover:bg-gray-50"
        }`}
      >
        <input
          type="file"
          name={name}
          className="hidden"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={(e) =>
            setFiles((prev) => ({
              ...prev,
              [name]: e.target.files[0]?.name || null,
            }))
          }
        />
        <Upload className="text-gray-500 mb-1" size={28} />
        <p className="text-gray-700 text-sm">
          <span className="text-teal-500 cursor-pointer">Browse</span>
        </p>
        <p className="text-xs text-gray-500 mt-1">Max Size: 2MB</p>
      </label>
      {files[name] && (
        <p className="text-sm mt-2 break-words">
          Selected: <span className="font-medium">{files[name]}</span>
        </p>
      )}
    </div>
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep2()) {
      setShowPopup(true);
    }
  };

  const isStep2Complete = Object.values(files).every((file) => file !== null);
  const isStep1Complete = Object.values(formData).every((val) => val !== "");

  return (
    <div className="min-h-screen font-urbanist flex flex-col">
      {/* Content shifted beside sidebar */}
      <div className="flex-1 px-4 mt-[80px] ml-0 lg:ml-[250px]">
        {/* Stepper */}
        <div className="flex justify-center gap-10 mb-8 flex-wrap">
          {[1, 2].map((step) => {
            const isClickable = step === 1 || isStep1Complete;
            return (
              <div
                key={step}
                className={`flex items-center gap-3 transition ${
                  isClickable
                    ? "cursor-pointer"
                    : "cursor-not-allowed opacity-50"
                }`}
                onClick={() => {
                  if (isClickable) setActiveStep(step);
                }}
              >
                <div
                  className={`w-8 h-8 rounded-full flex justify-center items-center font-bold transition ${
                    activeStep === step
                      ? "bg-[#003366] text-white"
                      : "border border-gray-400 text-gray-500"
                  }`}
                >
                  {step}
                </div>
                <div>
                  <p className="text-sm">Step {step}</p>
                  <p className="text-xs text-gray-500">
                    {step === 1 ? "Your Info" : "Verification"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Form Container */}
        <div className="w-full max-w-6xl bg-white p-6 sm:p-8 md:p-10 rounded-lg shadow-sm mx-auto">
          {/* Step 1 */}
          {activeStep === 1 && (
            <>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-600 mb-6">
                Personal & Professional Details
              </h2>

              {/* Upload Photo */}
              <div className="flex justify-start mb-6">
                <label className="w-20 h-20 rounded-full border-2 border-gray-300 flex flex-col justify-center items-center text-gray-500 text-xs sm:text-sm cursor-pointer hover:bg-gray-100 transition">
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleChange("photo", e.target.files[0])}
                  />
                  <span className="text-lg sm:text-xl mb-1">⬆️</span>
                  Upload
                </label>
              </div>

              {/* Form Fields */}
              <form className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: "firstName", label: "First Name" },
                  { name: "age", label: "Age" },
                  { name: "hospitalAddress", label: "Hospital/Clinic Address" },
                  { name: "hospitalName", label: "Hospital/Clinic Name" },
                  { name: "qualification", label: "Qualification" },
                  { name: "university", label: "University" },
                  { name: "experience", label: "Years of Experience" },
                  { name: "expertise", label: "Areas of Expertise" },
                  { name: "speciality", label: "Speciality" },
                  { name: "consultationFee", label: "Consultation Fee" },
                ].map(({ name, label }) => (
                  <div key={name} className="flex flex-col">
                    <label className="text-sm text-gray-700 mb-1">
                      {label} <span className="text-red-500">*</span>
                    </label>
                    <input
                      className="w-full h-[40px] rounded-full border border-gray-300 px-3 focus:outline-[#00A99D] focus:ring-0 text-sm"
                      value={formData[name]}
                      onChange={(e) => handleChange(name, e.target.value)}
                    />
                  </div>
                ))}

                {/* Gender */}
                <div className="flex flex-col">
                  <label className="text-sm text-gray-700 mb-1">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full h-[40px] rounded-full border border-gray-300 px-3 focus:outline-[#00A99D] focus:ring-0 text-sm"
                    value={formData.gender}
                    onChange={(e) => handleChange("gender", e.target.value)}
                  >
                    <option value="">Select</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>

                {/* Phone */}
                <div className="flex flex-col">
                  <label className="text-sm text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    placeholder="+91"
                    type="tel"
                    className="w-full h-[40px] rounded-full border border-gray-300 px-3 focus:outline-[#00A99D] focus:ring-0 text-sm"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col">
                  <label className="text-sm text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    className="w-full h-[40px] rounded-full border border-gray-300 px-3 focus:outline-[#00A99D] focus:ring-0 text-sm"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </div>

                {/* Language */}
                <div className="flex flex-col">
                  <label className="text-sm text-gray-700 mb-1">
                    Languages Spoken <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full h-[40px] rounded-full border border-gray-300 px-3 focus:outline-[#00A99D] focus:ring-0 text-sm"
                    value={formData.language}
                    onChange={(e) => handleChange("language", e.target.value)}
                  >
                    <option value="">Select</option>
                    <option>English</option>
                    <option>Hindi</option>
                    <option>Telugu</option>
                  </select>
                </div>

                {/* Description */}
                <div className="flex flex-col col-span-1 sm:col-span-2 lg:col-span-3">
                  <label className="text-sm text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-[#00A99D] focus:ring-0 text-sm"
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                  />
                </div>
              </form>

              {error && <p className="text-red-500 mt-4">{error}</p>}

              {/* Buttons */}
              <div className="flex flex-wrap justify-end gap-3 sm:gap-4 mt-6">
                <button className="px-5 sm:px-6 py-2 rounded-full border border-gray-400 text-gray-600 hover:bg-gray-100 transition text-sm sm:text-base">
                  Cancel
                </button>
                <button
                  className="px-5 sm:px-6 py-2 rounded-full bg-[#00BFA6] text-white hover:bg-[#00A99D] transition border border-[#00A99D] text-sm sm:text-base"
                  onClick={(e) => {
                    e.preventDefault();
                    if (validateStep1()) setActiveStep(2);
                  }}
                >
                  Next
                </button>
              </div>
            </>
          )}

          {/* Step 2 */}
          {activeStep === 2 && (
  <div className="flex flex-col justify-center items-center py-16">
    <h2 className="text-2xl sm:text-3xl font-bold text-gray-700">
      Verification Pending
    </h2>
    <p className="text-gray-500 mt-3 text-sm sm:text-base">
      Your details are submitted successfully. Please wait until admin verifies your account.
    </p>
  </div>
)}

        </div>
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 px-4">
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg w-full max-w-sm sm:max-w-md md:max-w-lg text-center">
            <h3 className="text-lg sm:text-xl font-semibold mb-4">Thank You!</h3>
            <p className="text-gray-600 mb-6 text-sm sm:text-base">
              After verification, login credentials will be provided to you.
            </p>
            <button
              className="px-5 sm:px-6 py-2 bg-[#00BFA6] text-white rounded-full hover:bg-[#009e8a] transition border border-[#00A99D] text-sm sm:text-base"
              onClick={handleOkClick}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalDetailsForm;
