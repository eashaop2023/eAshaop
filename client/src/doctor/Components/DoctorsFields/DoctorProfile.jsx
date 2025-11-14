import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_BASE_URL } from "../../../api-config";

const DoctorProfilePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({}); // State to hold validation errors

  useEffect(() => {
    const original = document.body.style.overflowX;
    document.body.style.overflowX = "hidden";
    return () => {
      document.body.style.overflowX = original; // restore on unmount
    };
  }, []);

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
    language: [],
    description: "",
    photo: null,
    photoPreview: null,
  });

  const [files, setFiles] = useState({
    medicalLicense: null,
    govtId: null,
    educationCertificate: null,
  });

  // Fetch doctor profile
  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/doctors/profile`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch profile");

      // Fill form data
      setFormData({
        firstName: data.name || "",
        age: data.age || "",
        hospitalAddress: data.hospitalLocation || data.hospital?.location || "",
        hospitalName: data.hospitalName || data.hospital?.name || "",
        qualification: data.education || "",
        university: data.university || "",
        experience: data.experience || "",
        expertise: data.areaOfInterest || "", // mapping backend -> frontend
        speciality: data.speciality || "",
        consultationFee: data.consultationFee || "",
        gender: data.gender || "",
        consultantMode: data.consultationMode || "",
        phone: data.mobile ? data.mobile.replace("+91", "") : "",
        email: data.email || "",
        language: data.languages || [],
        description: data.about || "",
        photo: null,
        photoPreview: data.profileImage || null,
      });

      // Fill files
      const certificates = data.medicalCertificates || [];
      setFiles({
        medicalLicense: certificates.find(c => c.type === "Medical License")?.fileUrl || null,
        govtId: certificates.find(c => c.type === "Govt ID")?.fileUrl || null,
        educationCertificate: certificates.find(c => c.type === "Education Certificate")?.fileUrl || null,
      });

      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for the field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleImageUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      if (field === "photo") {
        setFormData(prev => ({
          ...prev,
          photo: file,
          photoPreview: URL.createObjectURL(file),
        }));
      } else {
        setFiles(prev => ({ ...prev, [field]: file }));
      }
    }
    if (file) {
      if (field === "banner") {
        setFormData(prev => ({
          ...prev,
          backgroundPhoto: file,
          backgroundPhotoPreview: URL.createObjectURL(file),
        }));
      } else {
        setFiles(prev => ({ ...prev, [field]: file }));
      }
    }
  };

  // --- Form Validation ---
  const validateForm = () => {
    const newErrors = {};

    // Required text fields
    if (!formData.hospitalName.trim()) newErrors.hospitalName = "Hospital name is required.";
    if (!formData.hospitalAddress.trim()) newErrors.hospitalAddress = "Hospital address is required.";
    if (!formData.qualification.trim()) newErrors.qualification = "Qualification is required.";
    if (!formData.university.trim()) newErrors.university = "University is required.";
    if (!formData.expertise.trim()) newErrors.expertise = "Areas of expertise are required.";
    if (!formData.description.trim()) newErrors.description = "Description is required.";

    // Required selection fields
    if (!formData.consultantMode) newErrors.consultantMode = "Consultation mode is required.";
    if (formData.language.length === 0) newErrors.language = "At least one language must be selected.";

    // --- UPDATED NUMERIC AND PHONE VALIDATIONS ---

    // Age validation: Must be a number between 18 and 100.
    if (!formData.age) {
      newErrors.age = "Age is required.";
    } else if (isNaN(formData.age) || Number(formData.age) < 18 || Number(formData.age) > 100) {
      newErrors.age = "Age must be between 18 and 100.";
    }

    // Experience validation: Must be a number between 0 and 99.
    if (!formData.experience && formData.experience !== 0) {
      newErrors.experience = "Years of experience are required.";
    } else if (isNaN(formData.experience) || Number(formData.experience) < 0 || Number(formData.experience) >= 100) {
      newErrors.experience = "Experience must be between 0 and 99 years.";
    }

    // Consultation Fee validation: Must be a non-negative number.
    if (!formData.consultationFee && formData.consultationFee !== 0) {
      newErrors.consultationFee = "Consultation fee is required.";
    } else if (isNaN(formData.consultationFee) || Number(formData.consultationFee) < 0) {
      newErrors.consultationFee = "Fee cannot be negative.";
    }

    // Phone number validation: Must contain exactly 10 digits.
    if (!formData.phone) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be exactly 10 digits.";
    }

    return newErrors;
  };
  // const validateForm = () => {
  //   const newErrors = {};

  //   // Required text fields
  //   if (!formData.hospitalName.trim()) newErrors.hospitalName = "Hospital name is required.";
  //   if (!formData.hospitalAddress.trim()) newErrors.hospitalAddress = "Hospital address is required.";
  //   if (!formData.qualification.trim()) newErrors.qualification = "Qualification is required.";
  //   if (!formData.university.trim()) newErrors.university = "University is required.";
  //   if (!formData.expertise.trim()) newErrors.expertise = "Areas of expertise are required.";
  //   if (!formData.description.trim()) newErrors.description = "Description is required.";

  //   // Required selection fields
  //   if (!formData.consultantMode) newErrors.consultantMode = "Consultation mode is required.";
  //   if (formData.language.length === 0) newErrors.language = "At least one language must be selected.";

  //   // Numeric fields
  //   if (!formData.age) newErrors.age = "Age is required.";
  //   else if (isNaN(formData.age) || Number(formData.age) <= 0) newErrors.age = "Please enter a valid age.";

  //   if (!formData.experience && formData.experience !== 0) newErrors.experience = "Years of experience are required.";
  //   else if (isNaN(formData.experience) || Number(formData.experience) < 0) newErrors.experience = "Experience cannot be negative.";

  //   if (!formData.consultationFee && formData.consultationFee !== 0) newErrors.consultationFee = "Consultation fee is required.";
  //   else if (isNaN(formData.consultationFee) || Number(formData.consultationFee) < 0) newErrors.consultationFee = "Fee cannot be negative.";

  //   // Phone number
  //   if (!formData.phone) newErrors.phone = "Phone number is required.";
  //   else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = "Phone number must be 10 digits.";

  //   return newErrors;
  // };


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form before submitting
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      toast.error("Please fix the errors before submitting.");
      return;
    }
    setErrors({}); // Clear errors if validation passes

    try {
      const formDataToSend = new FormData();

      // --- Text fields ---
      formDataToSend.append("age", formData.age);
      formDataToSend.append("hospitalLocation", formData.hospitalAddress);
      formDataToSend.append("hospitalName", formData.hospitalName);
      formDataToSend.append("education", formData.qualification);
      formDataToSend.append("university", formData.university);
      formDataToSend.append("experience", formData.experience);
      formDataToSend.append("areaOfInterest", formData.expertise);
      formDataToSend.append("consultationFee", formData.consultationFee);
      formDataToSend.append("consultationMode", formData.consultantMode);
      formDataToSend.append("mobile", `+91${formData.phone}`);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("about", formData.description);
      formDataToSend.append("languages", formData.language.join(","));

      // --- Files (append ONLY if a real file is chosen) ---
      if (formData.photo instanceof File) {
        formDataToSend.append("profileImage", formData.photo);
      }

      if(formData.backgroundPhoto instanceof File){
        formDataToSend.append("backgroundImage", formData.backgroundPhoto);
      }

      if (files.medicalLicense instanceof File) {
        formDataToSend.append("medicalLicense", files.medicalLicense);
      }

      if (files.govtId instanceof File) {
        formDataToSend.append("govtId", files.govtId);
      }

      if (files.educationCertificate instanceof File) {
        formDataToSend.append("educationCertificate", files.educationCertificate);
      }

      // --- API call ---
      const res = await fetch(`${API_BASE_URL}/api/doctors/profile`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: formDataToSend,
      });

      let data;
      try {
        data = await res.json();
      } catch {
        const text = await res.text();
        data = { message: text };
      }
      console.log(data)
      if (!res.ok) {
        toast.error(data.error)
        return;
      }

      toast.success("Profile updated successfully!");
      fetchProfile(); // Re-fetch to get the latest data
    } catch (err) {
      console.error(err.message);
      toast.error(err.message || "An error occurred while updating.");
      setError(err.message);
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (error && !formData.firstName) return <p className="text-danger">{error}</p>;

  return (
    <div className="container my-5">
      <h2 className="mb-4">Doctor Profile</h2>
      <form onSubmit={handleSubmit} noValidate>
        {/* Profile Image */}
        <div className="mb-4 text-center position-relative" style={{ width: "100%", margin: "0 auto" }}>
          <div style={{ textAlign: "center", position: "relative", marginBottom: "80px" }}>
            <img
              src={formData.backgroundPhotoPreview || "https://img.freepik.com/free-vector/hospital-healthcare-service-sale-banner_23-2150394136.jpg"}
              alt="Banner"
              style={{
                width: "100%",
                height: "150px",
                objectFit: "cover",
                borderRadius: "30px",
                boxSizing: "border-box",
              }}
            />
            <label
              htmlFor="bannerPhotoInput"
              className="position-absolute end-2 bottom-1 bg-secondary text-white rounded-circle p-1"
              style={{ cursor: "pointer", width: 25, height: 25, fontSize: 12 }}
              title="Change Banner"
            >
              <i className="bi bi-pencil-fill"></i>
            </label>
            <input
              type="file"
              id="bannerPhotoInput"
              accept="image/*"
              className="d-none"
              onChange={e => handleImageUpload(e, "banner")}
            />

            {formData.photoPreview ? (
              <img
                src={formData.photoPreview}
                alt="Profile"
                style={{
                  height: "120px",
                  width: "120px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "3px solid white",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                  position: "absolute",
                  bottom: "-60px",
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              />
            ) : (
              <div
                className="d-flex justify-content-center align-items-center bg-light text-muted"
                style={{
                  height: "120px",
                  width: "120px",
                  borderRadius: "50%",
                  border: "3px solid white",
                  position: "absolute",
                  bottom: "-60px",
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              >
                Upload
              </div>
            )}
            <label
              htmlFor="profilePhotoInput"
              className="position-absolute bg-secondary text-white rounded-circle p-1"
              style={{
                bottom: "-60px",
                // left: "50%",
                right:"48%",
                transform: "translateX(40%)",
                color: "white",
                // border: "3px solid white",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                borderRadius: "50%",
                cursor: "pointer",
                width: 25,
                height: 25,
                fontSize: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              title="Change Photo"
            >
              <i className="bi bi-pencil-fill"></i>
            </label>
            <input
              type="file"
              id="profilePhotoInput"
              accept="image/*"
              className="d-none"
              onChange={e => handleImageUpload(e, "photo")}
            />
          </div>
        </div>
        {/* <div className="mb-4 text-center position-relative" style={{ width: 100, margin: "0 auto" }}>
          <div className="border rounded-circle overflow-hidden" style={{ width: 100, height: 100 }}>
            {formData.photoPreview ? (
              <img
                src={formData.photoPreview}
                alt="Profile"
                className="w-100 h-100 object-fit-cover"
              />
            ) : (
              <div className="d-flex justify-content-center align-items-center w-100 h-100 bg-light text-muted">
                Upload
              </div>
            )}
          </div>
          <label
            htmlFor="profilePhotoInput"
            className="position-absolute bottom-0 end-0 bg-secondary text-white rounded-circle p-1"
            style={{ cursor: "pointer", width: 20, height: 20, fontSize: 10 }}
            title="Change Photo"
          >
            <i className="bi bi-pencil-fill"></i>
          </label>
          <input
            type="file"
            id="profilePhotoInput"
            accept="image/*"
            className="d-none"
            onChange={e => handleImageUpload(e, "photo")}
          />
        </div> */}

        {/* Personal & Professional Details */}
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">First Name</label>
            <input className="form-control" value={formData.firstName} onChange={e => handleChange("firstName", e.target.value)} disabled />
          </div>
          <div className="col-md-4">
            <label className="form-label">Age</label>
            <input type="number" className={`form-control ${errors.age ? 'is-invalid' : ''}`} value={formData.age} onChange={e => handleChange("age", e.target.value)} />
            {errors.age && <div className="invalid-feedback">{errors.age}</div>}
          </div>
          <div className="col-md-4">
            <label className="form-label">Phone</label>
            <input type="tel" className={`form-control ${errors.phone ? 'is-invalid' : ''}`} value={formData.phone} onChange={e => handleChange("phone", e.target.value.replace(/[^0-9]/g, ""))} disabled />
            {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
          </div>
          <div className="col-md-6">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" value={formData.email} onChange={e => handleChange("email", e.target.value)} disabled />
          </div>
          <div className="col-md-6">
            <label className="form-label">Gender</label>
            <select className="form-select" value={formData.gender} onChange={e => handleChange("gender", e.target.value)} disabled>
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Consultation Mode</label>
            <select className={`form-select ${errors.consultantMode ? 'is-invalid' : ''}`} value={formData.consultantMode} onChange={e => handleChange("consultantMode", e.target.value)}>
              <option value="">Select</option>
              <option>Video Consultation</option>
              <option>Clinic Visit</option>
              <option>Both</option>
            </select>
            {errors.consultantMode && <div className="invalid-feedback">{errors.consultantMode}</div>}
          </div>
          <div className="col-md-6">
            <label className="form-label">Hospital Name</label>
            <input className={`form-control ${errors.hospitalName ? 'is-invalid' : ''}`} value={formData.hospitalName} onChange={e => handleChange("hospitalName", e.target.value)} />
            {errors.hospitalName && <div className="invalid-feedback">{errors.hospitalName}</div>}
          </div>
          <div className="col-md-12">
            <label className="form-label">Hospital Address</label>
            <input className={`form-control ${errors.hospitalAddress ? 'is-invalid' : ''}`} value={formData.hospitalAddress} onChange={e => handleChange("hospitalAddress", e.target.value)} />
            {errors.hospitalAddress && <div className="invalid-feedback">{errors.hospitalAddress}</div>}
          </div>
          <div className="col-md-6">
            <label className="form-label">Qualification</label>
            <input className={`form-control ${errors.qualification ? 'is-invalid' : ''}`} value={formData.qualification} onChange={e => handleChange("qualification", e.target.value)} />
            {errors.qualification && <div className="invalid-feedback">{errors.qualification}</div>}
          </div>
          <div className="col-md-6">
            <label className="form-label">University</label>
            <input className={`form-control ${errors.university ? 'is-invalid' : ''}`} value={formData.university} onChange={e => handleChange("university", e.target.value)} />
            {errors.university && <div className="invalid-feedback">{errors.university}</div>}
          </div>
          <div className="col-md-6">
            <label className="form-label">Years of Experience</label>
            <input type="number" className={`form-control ${errors.experience ? 'is-invalid' : ''}`} value={formData.experience} onChange={e => handleChange("experience", e.target.value)} />
            {errors.experience && <div className="invalid-feedback">{errors.experience}</div>}
          </div>
          <div className="col-md-6">
            <label className="form-label">Speciality</label>
            <input className="form-control" value={formData.speciality} onChange={e => handleChange("speciality", e.target.value)} disabled />
          </div>
          <div className="col-md-6">
            <label className="form-label">Consultation Fee</label>
            <input type="number" className={`form-control ${errors.consultationFee ? 'is-invalid' : ''}`} value={formData.consultationFee} onChange={e => handleChange("consultationFee", e.target.value)} />
            {errors.consultationFee && <div className="invalid-feedback">{errors.consultationFee}</div>}
          </div>
          <div className="col-md-6">
            <label className="form-label">Areas of Expertise</label>
            <input className={`form-control ${errors.expertise ? 'is-invalid' : ''}`} value={formData.expertise} onChange={e => handleChange("expertise", e.target.value)} />
            {errors.expertise && <div className="invalid-feedback">{errors.expertise}</div>}
          </div>

          {/* Languages */}
          <div className="col-12">
            <label className="form-label">Languages Spoken</label>
            <div className={`d-flex flex-wrap gap-3 p-2 rounded ${errors.language ? 'is-invalid' : ''}`}>
              {availableLanguages.map(lang => (
                <div className="form-check" key={lang}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={lang}
                    checked={formData.language.includes(lang)}
                    onChange={e => {
                      const newLanguages = e.target.checked
                        ? [...formData.language, lang]
                        : formData.language.filter(l => l !== lang);
                      handleChange("language", newLanguages);
                    }}
                  />
                  <label className="form-check-label" htmlFor={lang}>{lang}</label>
                </div>
              ))}
            </div>
            {errors.language && <div className="invalid-feedback">{errors.language}</div>}
          </div>

          {/* Description */}
          <div className="col-12">
            <label className="form-label">Description</label>
            <textarea className={`form-control ${errors.description ? 'is-invalid' : ''}`} rows={3} value={formData.description} onChange={e => handleChange("description", e.target.value)} />
            {errors.description && <div className="invalid-feedback">{errors.description}</div>}
          </div>

          {/* Certificates */}
          {["medicalLicense", "govtId", "educationCertificate"].map(fileKey => (
            <div className="col-md-4" key={fileKey}>
              <label className="form-label text-capitalize">{fileKey.replace(/([A-Z])/g, ' $1')}</label>
              <input type="file" className="form-control" onChange={e => handleImageUpload(e, fileKey)} />
              {files[fileKey] && (
                <div className="mt-2">
                  <a href={typeof files[fileKey] === "string" ? files[fileKey] : URL.createObjectURL(files[fileKey])} target="_blank" rel="noopener noreferrer">
                    View Current File
                  </a>
                </div>
              )}
            </div>
          ))}

        </div>

        <div className="mt-4">
          <button className="btn btn-success" type="submit">Update Profile</button>
        </div>
      </form>
    </div>
  );
};

export default DoctorProfilePage;