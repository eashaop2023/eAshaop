import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import calendarIcon from "../../assets/calendar.svg";
import { format, parse } from "date-fns";
import styles from '../../components/addmemberform/AddMemberForm.module.css'



const AddMemberForm = ({onClose}) => {
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

  const [dobDate, setDobDate] = useState(null);

  const formatDOBInput = (value) => {
    let cleaned = value.replace(/[^\d]/g, "");
    if (cleaned.length >= 5) {
      return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 4)}-${cleaned.slice(4, 8)}`;
    } else if (cleaned.length >= 3) {
      return `${cleaned.slice(0, 2)}-${cleaned.slice(2)}`;
    }
    return cleaned;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "dob") {
      const formatted = formatDOBInput(value);
      setFormData((prev) => ({ ...prev, dob: formatted }));

      const datePattern = /^(\d{2})-(\d{2})-(\d{4})$/;
      if (datePattern.test(formatted)) {
        try {
          const parsed = parse(formatted, "dd-MM-yyyy", new Date());
          if (!isNaN(parsed)) setDobDate(parsed);
        } catch (err) {
          console.error("Invalid date input:", err.message);
        }
      }
    } else if (name === "relation") {
      setFormData((prev) => ({
        ...prev,
        relation: value,
        customRelation: "",
      }));
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleDobChange = (date) => {
    if (!date) return;
    const formatted = format(date, "dd-MM-yyyy");
    setDobDate(date);
    setFormData((prev) => ({ ...prev, dob: formatted }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      relation:
        formData.relation === "other"
          ? formData.customRelation
          : formData.relation,
    };
    console.log("Form submitted:", finalData);
  };

  return (
    <div
      className={`${styles.mainContainer} d-flex justify-content-center align-items-center vh-100`}
      
    >
      <div
        className="bg-white rounded-4 p-5"
        style={{ width: "90%", maxWidth: "800px" }}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Add New Member</h5>
          <button
            type="button"
            className="bg-transparent border-0 fs-4"
            style={{ lineHeight: "1", padding: "0", margin: "0" }}
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Full Name (as per Aadhar card)</label>
              <input
                type="text"
                className="form-control rounded-pill"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Enter DOB</label>
              <div className="input-group rounded-pill border px-3">
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
                    <span
                      className="input-group-text border-0 bg-transparent"
                      style={{ cursor: "pointer" }}
                    >
                      <img
                        src={calendarIcon}
                        alt="calendar"
                        width="20"
                        height="20"
                      />
                    </span>
                  }
                  popperPlacement="bottom-start"
                  popperModifiers={[
                    { name: "offset", options: { offset: [0, 10] } },
                  ]}
                  withPortal={false}
                  openToDate={dobDate || new Date(2000, 0, 1)}
                />
              </div>
            </div>

            <div className="col-md-6">
              <label className="form-label">Mobile Number</label>
              <input
                type="tel"
                className="form-control rounded-pill"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control rounded-pill"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Gender</label>
              <select
                className="form-select rounded-pill"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">Relation</label>
              <select
                className="form-select rounded-pill"
                name="relation"
                value={formData.relation}
                onChange={handleChange}
                required
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

              {formData.relation === "other" && (
                <input
                  type="text"
                  className="form-control rounded-pill mt-2"
                  name="customRelation"
                  value={formData.customRelation}
                  onChange={handleChange}
                  placeholder="Specify relation"
                  required
                />
              )}
            </div>

            <div className="col-md-6">
              <label className="form-label">Address</label>
              <input
                type="text"
                className="form-control rounded-pill"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Pin Code</label>
              <input
                type="text"
                className="form-control rounded-pill"
                name="pinCode"
                value={formData.pinCode}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="d-flex justify-content-center mt-4">
            <button
              type="submit"
              className="btn text-white rounded-pill px-4"
              style={{ backgroundColor: "#00A99D" }}
            >
              Add Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMemberForm;
