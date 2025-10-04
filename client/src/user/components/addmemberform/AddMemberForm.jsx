import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import calendarIcon from "../../assets/calendar.svg";
import { format, parse, isAfter, isValid } from "date-fns";
import styles from "../../components/addmemberform/AddMemberForm.module.css";

const AddMemberForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    mobileNumber: "",
    email: "",
    gender: "",
    relation: "",
    customRelation: "",
    address: "",
    pinCode: "",
  });

  const [errors, setErrors] = useState({});
  const [dobDate, setDobDate] = useState(null);

  // --- VALIDATION LOGIC ---
  const validateField = (name, value) => {
    switch (name) {
      case "fullName":
        if (!value) return "Full name is required.";
        if (!/^[a-zA-Z\s]+$/.test(value)) return "Name can only contain letters and spaces.";
        return "";
      case "dob":
        if (!value) return "Date of birth is required.";
        const parsedDate = parse(value, "dd-MM-yyyy", new Date());
        if (!isValid(parsedDate)) return "Invalid date format. Use DD-MM-YYYY.";
        if (isAfter(parsedDate, new Date())) return "Date of birth cannot be in the future.";
        return "";
      case "mobileNumber":
        if (!value) return "Mobile number is required.";
        if (!/^\d{10}$/.test(value)) return "Mobile number must be 10 digits.";
        return "";
      case "email":
        if (!value) return "Email is required.";
        if (!/\S+@\S+\.\S+/.test(value)) return "Email is invalid.";
        return "";
      case "gender":
        if (!value) return "Please select a gender.";
        return "";
      case "relation":
        if (!value) return "Please select a relation.";
        return "";
      case "customRelation":
        if (formData.relation === "other" && !value) return "Please specify the relation.";
        return "";
      case "address":
        if (!value) return "Address is required.";
        return "";
      case "pinCode":
        if (!value) return "Pin code is required.";
        if (!/^\d{6}$/.test(value)) return "Pin code must be 6 digits.";
        return "";
      default:
        return "";
    }
  };

  const formatDOBInput = (value) => {
    let cleaned = value.replace(/[^\d]/g, "");
    if (cleaned.length > 8) cleaned = cleaned.slice(0, 8); // Max 8 digits
    if (cleaned.length >= 5) {
      return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 4)}-${cleaned.slice(4, 8)}`;
    } else if (cleaned.length >= 3) {
      return `${cleaned.slice(0, 2)}-${cleaned.slice(2)}`;
    }
    return cleaned;
  };
  const handleChange = (e) => {
  let { name, value } = e.target;

  // DOB formatting
  if (name === "dob") {
    value = formatDOBInput(value);
  }

  // Pin code only numbers
  if (name === "pinCode") {
    value = value.replace(/\D/g, "");
  }

  // Update state
  setFormData(prev => ({ ...prev, [name]: value }));

  // Live email validation
  if (name === "email") {
    if (value && !/\S+@\S+\.\S+/.test(value)) {
      setErrors(prev => ({ ...prev, email: "Enter correct email" }));
    } else {
      setErrors(prev => ({ ...prev, email: "" }));
    }
  } else {
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  }

  // Handle relation
  if (name === "relation") {
    setFormData(prev => ({ ...prev, relation: value, customRelation: "" }));
    if (value !== "other") setErrors(prev => ({ ...prev, customRelation: "" }));
  }
};
  const handleDobChange = (date) => {
    if (date) {
      const formatted = format(date, "dd-MM-yyyy");
      setDobDate(date);
      setFormData((prev) => ({ ...prev, dob: formatted }));
      // Clear error on valid date selection
      setErrors((prev) => ({ ...prev, dob: "" }));
    } else {
        setDobDate(null);
        setFormData((prev) => ({ ...prev, dob: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isFormValid = validateForm();

    if (isFormValid) {
      const finalData = {
        ...formData,
        relation: formData.relation === "other" ? formData.customRelation : formData.relation,
      };
      delete finalData.customRelation; // Clean up the data before submission
      console.log("Form submitted successfully:", finalData);
      // Here you would typically call an API, etc.
      // onClose(); // Optionally close the modal on success
    } else {
      console.log("Form has validation errors.");
    }
  };

  return (
    <div className={`${styles.mainContainer} d-flex justify-content-center align-items-center vh-100`}>
      <div className="bg-white rounded-4 p-5" style={{ width: "90%", maxWidth: "800px" }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Add New Member</h5>
          <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="row g-4">
            {/* Full Name */}
            <div className="col-md-6">
              <label className="form-label">Full Name (as per Aadhar card)</label>
              <input
                type="text"
                className={`form-control rounded-pill ${errors.fullName ? 'is-invalid' : ''}`}
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
              />
              {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
            </div>

            {/* DOB */}
            <div className="col-md-6">
              <label className="form-label">Enter DOB</label>
              <div className={`input-group rounded-pill border px-2 ${errors.dob ? 'is-invalid' : ''}`}>
                <input
                  type="text"
                  name="dob"
                  className="form-control border-0 bg-transparent"
                  placeholder="dd-mm-yyyy"
                  value={formData.dob}
                  onChange={handleChange}
                />
                <DatePicker
                  selected={dobDate}
                  onChange={handleDobChange}
                  dateFormat="dd-MM-yyyy"
                  maxDate={new Date()}
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  customInput={
                    <span className="input-group-text border-0 bg-transparent" style={{ cursor: "pointer" }}>
                      <img src={calendarIcon} alt="calendar" width="20" height="20" />
                    </span>
                  }
                  popperPlacement="bottom-end"
                />
              </div>
               {errors.dob && <div className="invalid-feedback d-block">{errors.dob}</div>}
            </div>

            {/* Mobile Number */}
            <div className="col-md-6">
              <label className="form-label">Mobile Number</label>
              <input
                type="tel"
                className={`form-control rounded-pill ${errors.mobileNumber ? 'is-invalid' : ''}`}
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                maxLength="10"
              />
              {errors.mobileNumber && <div className="invalid-feedback">{errors.mobileNumber}</div>}
            </div>

            {/* Email */}
            <div className="col-md-6">
              <label className="form-label">Email</label>
              <input
                type="email"
                className={`form-control rounded-pill ${errors.email ? 'is-invalid' : ''}`}
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>

            {/* Gender */}
            <div className="col-md-6">
              <label className="form-label">Gender</label>
              <select
                className={`form-select rounded-pill ${errors.gender ? 'is-invalid' : ''}`}
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && <div className="invalid-feedback">{errors.gender}</div>}
            </div>

            {/* Relation */}
            <div className="col-md-6">
              <label className="form-label">Relation</label>
              <select
                className={`form-select rounded-pill ${errors.relation ? 'is-invalid' : ''}`}
                name="relation"
                value={formData.relation}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="spouse">Spouse</option>
                <option value="son">Son</option>
                <option value="daughter">Daughter</option>
                <option value="father">Father</option>
                <option value="mother">Mother</option>
                <option value="friend">Friend</option>
                <option value="other">Other</option>
              </select>
              {errors.relation && <div className="invalid-feedback">{errors.relation}</div>}

              {formData.relation === "other" && (
                <div className="mt-2">
                    <input
                    type="text"
                    className={`form-control rounded-pill ${errors.customRelation ? 'is-invalid' : ''}`}
                    name="customRelation"
                    value={formData.customRelation}
                    onChange={handleChange}
                    placeholder="Specify relation"
                  />
                  {errors.customRelation && <div className="invalid-feedback">{errors.customRelation}</div>}
                </div>
              )}
            </div>

            {/* Address */}
            <div className="col-md-6">
              <label className="form-label">Address</label>
              <input
                type="text"
                className={`form-control rounded-pill ${errors.address ? 'is-invalid' : ''}`}
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
              {errors.address && <div className="invalid-feedback">{errors.address}</div>}
            </div>

            {/* Pin Code */}
            <div className="col-md-6">
              <label className="form-label">Pin Code</label>
              <input
                type="text"
                className={`form-control rounded-pill ${errors.pinCode ? 'is-invalid' : ''}`}
                name="pinCode"
                value={formData.pinCode}
                onChange={handleChange}
                maxLength="6"
              />
              {errors.pinCode && <div className="invalid-feedback">{errors.pinCode}</div>}
            </div>
          </div>

          <div className="d-flex justify-content-center mt-4">
            <button type="submit" className="btn text-white rounded-pill px-5 py-2" style={{ backgroundColor: "#00A99D" }}>
              Add Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMemberForm;