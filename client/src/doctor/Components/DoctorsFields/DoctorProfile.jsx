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
hospitalName: data.hospitalName || data.hospital?.name || "",        qualification: data.education || "",
        university: data.university || "",
        experience: data.experience || "",
  expertise: data.areaOfInterest || "",  // mapping backend -> frontend
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
  };


const handleSubmit = async (e) => {
  e.preventDefault();
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

    if (!res.ok) throw new Error(data.message || "Failed to update profile");

    toast.success("Profile updated successfully!");
    fetchProfile();
  } catch (err) {
    console.error(err);
    setError(err.message);
  }
};


 if (loading) return <p>Loading profile...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container my-5">
      <h2 className="mb-4">Doctor Profile</h2>
      <form onSubmit={handleSubmit}>
        {/* Profile Image */}
{/* Profile Image */}
<div className="mb-4 text-center position-relative" style={{ width: 100, margin: "0 auto" }}>
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

  {/* Small edit button in bottom-right corner */}
  <label
    htmlFor="profilePhotoInput"
    className="position-absolute bottom-0 end-0 bg-secondary text-white rounded-circle p-1"
    style={{ cursor: "pointer",width:20,height:20,fontSize:10  }}
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

        {/* Personal & Professional Details */}
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">First Name</label>
            <input className="form-control" value={formData.firstName} onChange={e => handleChange("firstName", e.target.value)} />
          </div>
          <div className="col-md-4">
            <label className="form-label">Age</label>
            <input type="number" className="form-control" value={formData.age} onChange={e => handleChange("age", e.target.value)} />
          </div>
          <div className="col-md-4">
            <label className="form-label">Phone</label>
            <input type="tel" className="form-control" value={formData.phone} onChange={e => handleChange("phone", e.target.value.replace(/[^0-9]/g, ""))} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" value={formData.email} onChange={e => handleChange("email", e.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Gender</label>
            <select className="form-select" value={formData.gender} onChange={e => handleChange("gender", e.target.value)}>
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Consultation Mode</label>
            <select className="form-select" value={formData.consultantMode} onChange={e => handleChange("consultantMode", e.target.value)}>
              <option value="">Select</option>
              <option>Video Consultation</option>
              <option>Clinic Visit</option>
              <option>Both</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Hospital Name</label>
            <input className="form-control" value={formData.hospitalName} onChange={e => handleChange("hospitalName", e.target.value)} />
          </div>
          <div className="col-md-12">
            <label className="form-label">Hospital Address</label>
            <input className="form-control" value={formData.hospitalAddress} onChange={e => handleChange("hospitalAddress", e.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Qualification</label>
            <input className="form-control" value={formData.qualification} onChange={e => handleChange("qualification", e.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="form-label">University</label>
            <input className="form-control" value={formData.university} onChange={e => handleChange("university", e.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Years of Experience</label>
            <input type="number" className="form-control" value={formData.experience} onChange={e => handleChange("experience", e.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Speciality</label>
            <input className="form-control" value={formData.speciality} onChange={e => handleChange("speciality", e.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Consultation Fee</label>
            <input type="number" className="form-control" value={formData.consultationFee} onChange={e => handleChange("consultationFee", e.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Areas of Expertise</label>
            <input className="form-control" value={formData.expertise} onChange={e => handleChange("expertise", e.target.value)} />
          </div>

          {/* Languages */}
          <div className="col-12">
            <label className="form-label">Languages Spoken</label>
            <div className="d-flex flex-wrap gap-3">
              {availableLanguages.map(lang => (
                <div className="form-check" key={lang}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={lang}
                    checked={formData.language.includes(lang)}
                    onChange={e => {
                      if (e.target.checked) handleChange("language", [...formData.language, lang]);
                      else handleChange("language", formData.language.filter(l => l !== lang));
                    }}
                  />
                  <label className="form-check-label" htmlFor={lang}>{lang}</label>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="col-12">
            <label className="form-label">Description</label>
            <textarea className="form-control" rows={3} value={formData.description} onChange={e => handleChange("description", e.target.value)} />
          </div>

          {/* Certificates */}
          {["medicalLicense", "govtId", "educationCertificate"].map(fileKey => (
            <div className="col-md-4" key={fileKey}>
              <label className="form-label">{fileKey.replace(/([A-Z])/g, ' $1')}</label>
              <input type="file" className="form-control" onChange={e => handleImageUpload(e, fileKey)} />
              {files[fileKey] && (
                <div className="mt-2">
                  <a href={typeof files[fileKey] === "string" ? files[fileKey] : URL.createObjectURL(files[fileKey])} target="_blank" rel="noopener noreferrer">
                    View
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
