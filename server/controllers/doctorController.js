const Doctor = require("../models/doctorModel");
const mongoose = require("mongoose");
const {generateToken} = require("../utils/generateToken");
const Category = require("../models/categoryModel");
const { uploadToCloudinary } = require("../utils/cloudinaryUpload"); 
const { generateOTP, sendOTP } = require("../utils/otpHelper");


// @desc    Register a doctor
// @route   POST /api/doctors/register
// @access  Public
const registerDoctor = async (req, res) => {
  try {
    const {
      name,
      mobile,
      password,
      gender,
      age,
      speciality,
      consultationMode,
      hospitalName,
      hospitalLocation,
      about,
      languages,
      location,
      experience,
      university,
      consultationFee,
      verifyBy, 
      email,
      areaOfInterest,
      education,
      certification
    } = req.body;
    const doctorName = name.startsWith("Dr.") ? name : `Dr. ${name}`;

    // Check if doctor exists
    const existingDoctor = await Doctor.findOne({ mobile });
    
    if (existingDoctor) {
      // If doctor is already verified, they can't register again
      if (existingDoctor.isVerified) {
        return res.status(400).json({ 
          message: "Doctor already exists. Please login instead." 
        });
      }
      
      // If doctor exists but is not verified, allow them to resend OTP
      // First, handle category
      let category = await Category.findOne({
        name: { $regex: `^${speciality.trim()}$`, $options: "i" }
      });

      if (!category) {
        try {
          category = await Category.create({ name: speciality.trim() });
        } catch (err) {
          if (err.code === 11000) {
            category = await Category.findOne({
              name: { $regex: `^${speciality.trim()}$`, $options: "i" }
            });
          } else {
            throw err;
          }
        }
      }

      // Validate consultation mode requirements
      if (
        (consultationMode === "Clinic Visit" || consultationMode === "Both") &&
        (!hospitalName || !hospitalLocation)
      ) {
        return res.status(400).json({
          message: "Hospital name and location are required for Clinic Visit mode"
        });
      }

      // Handle uploaded files
      const files = req.files || {};
      let medicalCertificates = existingDoctor.medicalCertificates || [];
      let profileImage = existingDoctor.profileImage || "";

      if (files?.govtId) {
        const url = await uploadToCloudinary(files.govtId[0].buffer, "doctors/govtId");
        const existingIndex = medicalCertificates.findIndex(cert => cert.type === "Govt ID");
        if (existingIndex !== -1) {
          medicalCertificates[existingIndex].fileUrl = url;
        } else {
          medicalCertificates.push({ type: "Govt ID", fileUrl: url });
        }
      }
      if (files?.medicalLicense) {
        const url = await uploadToCloudinary(files.medicalLicense[0].buffer, "doctors/licenses");
        const existingIndex = medicalCertificates.findIndex(cert => cert.type === "Medical License");
        if (existingIndex !== -1) {
          medicalCertificates[existingIndex].fileUrl = url;
        } else {
          medicalCertificates.push({ type: "Medical License", fileUrl: url });
        }
      }
      if (files?.educationCertificate) {
        const url = await uploadToCloudinary(files.educationCertificate[0].buffer, "doctors/certificates");
        const existingIndex = medicalCertificates.findIndex(cert => cert.type === "Education Certificate");
        if (existingIndex !== -1) {
          medicalCertificates[existingIndex].fileUrl = url;
        } else {
          medicalCertificates.push({ type: "Education Certificate", fileUrl: url });
        }
      }
      if (files?.additionalCertificate) {
        for (let i = 0; i < files.additionalCertificate.length; i++) {
          const url = await uploadToCloudinary(files.additionalCertificate[i].buffer, "doctors/additionalCertificates");
          medicalCertificates.push({ type: "Additional Certificate", fileUrl: url });
        }
      }
      if (files?.profileImage) {
        profileImage = await uploadToCloudinary(files.profileImage[0].buffer, "doctors/profileImages");
      }

      // Generate new OTP and update the existing record
      const otp = generateOTP();
      existingDoctor.verificationCode = otp;
      existingDoctor.verificationCodeExpire = Date.now() + 10 * 60 * 1000; // 10 mins
      
      // Update doctor information
      existingDoctor.name = doctorName;
      existingDoctor.email = email;
      existingDoctor.password = password; // will be hashed in pre-save hook
      existingDoctor.gender = gender;
      existingDoctor.age = age;
      existingDoctor.speciality = category.name;
      existingDoctor.consultationMode = consultationMode;
      existingDoctor.medicalCertificates = medicalCertificates;
      existingDoctor.profileImage = profileImage;
      existingDoctor.about = about;
      existingDoctor.languages = languages;
      existingDoctor.location = location;
      existingDoctor.experience = experience;
      existingDoctor.consultationFee = consultationFee;
      existingDoctor.university = university;
      existingDoctor.areaOfInterest = areaOfInterest;
      existingDoctor.education = education;
      existingDoctor.certification = certification;
      
      if (consultationMode === "Clinic Visit" || consultationMode === "Both") {
        existingDoctor.hospitalName = hospitalName;
        existingDoctor.hospitalLocation = hospitalLocation;
      }
      
      await existingDoctor.save();
      
      // Update category
      await Category.findByIdAndUpdate(
        category._id,
        { $addToSet: { doctors: existingDoctor._id } },
        { new: true }
      );
      
      // Send OTP
      await sendOTP({
        verifyBy,
        mobile: existingDoctor.mobile,
        email: existingDoctor.email,
        otp,
      });
      
      return res.status(200).json({
        message: "Registration updated. OTP resent successfully. Please verify your account.",
        doctor: {
          _id: existingDoctor._id,
          name: existingDoctor.name,
          email: existingDoctor.email,
          isVerified: existingDoctor.isVerified
        }
      });
    }

let category = await Category.findOne({
  name: { $regex: `^${speciality.trim()}$`, $options: "i" } // case-insensitive search
});

if (!category) {
  try {
    category = await Category.create({ name: speciality.trim() });
  } catch (err) {
    if (err.code === 11000) {
      category = await Category.findOne({
        name: { $regex: `^${speciality.trim()}$`, $options: "i" }
      });
    } else {
      throw err;
    }
  }
}


    if (
      (consultationMode === "Clinic Visit" || consultationMode === "Both") &&
      (!hospitalName || !hospitalLocation)
    ) {
      return res.status(400).json({
        message: "Hospital name and location are required for Clinic Visit mode"
      });
    }

    // Handle uploaded files
    const files = req.files || {};
    let medicalCertificates = [];
    let profileImage = "";

    if (files?.govtId) {
      const url = await uploadToCloudinary(files.govtId[0].buffer, "doctors/govtId");
      medicalCertificates.push({ type: "Govt ID", fileUrl: url });
    }
    if (files?.medicalLicense) {
      const url = await uploadToCloudinary(files.medicalLicense[0].buffer, "doctors/licenses");
      medicalCertificates.push({ type: "Medical License", fileUrl: url });
    }
    if (files?.educationCertificate) {
      const url = await uploadToCloudinary(files.educationCertificate[0].buffer, "doctors/certificates");
      medicalCertificates.push({ type: "Education Certificate", fileUrl: url });
    }
    if (files?.additionalCertificate) {
  for (let i = 0; i < files.additionalCertificate.length; i++) {
    const url = await uploadToCloudinary(files.additionalCertificate[i].buffer, "doctors/additionalCertificates");
    medicalCertificates.push({ type: "Additional Certificate", fileUrl: url });
  }
}
    if (files?.profileImage) {
      profileImage = await uploadToCloudinary(files.profileImage[0].buffer, "doctors/profileImages");
    }


    // Create doctor object
    const doctorData = {
      name:doctorName,
      mobile,
      email, // save email also
      password,
      age,
      gender,
      speciality: category.name,
      consultationMode,
      medicalCertificates,
      profileImage,
      about,
      languages,
      location,
      experience,
      consultationFee,
      university,
      areaOfInterest,
      education,
      certification
    };

    if (consultationMode === "Clinic Visit" || consultationMode === "Both") {
      doctorData.hospitalName = hospitalName;
      doctorData.hospitalLocation = hospitalLocation;
    }

    const doctor = await Doctor.create(doctorData);

    const otp = generateOTP();
    doctor.verificationCode = otp;
    doctor.verificationCodeExpire = Date.now() + 10 * 60 * 1000; // 10 mins
    doctor.isVerified = false;
    await doctor.save();

    await sendOTP({
      verifyBy,
      mobile: doctor.mobile,
      email: doctor.email,
      otp,
    });

    await Category.findByIdAndUpdate(
      category._id,
      { $addToSet: { doctors: doctor._id } },
      { new: true }
    );
    res.status(201).json({
      message: "Doctor registered successfully. OTP sent.",
      doctor: {
        _id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        isVerified: doctor.isVerified
      }
    });
  }

   catch (error) {
    console.error(error);
    res.status(500).json({ message: `${error}` });
  }
};

// @desc    Verify doctor OTP after registration or forgot password
// @route   POST /api/doctors/verify-otp
// @access  Public
const verifyDoctorOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    const doctorId = req.headers["doctorid"]; 

    console.log("OTP Verification Request:", { 
      doctorId, 
      otp, 
      otpType: typeof otp,
      headers: Object.keys(req.headers)
    });

    if (!doctorId) {
      return res.status(400).json({ message: "Doctor ID missing" });
    }

    if (!otp) {
      return res.status(400).json({ message: "OTP is required" });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    if (!doctor.verificationCode) {
      return res.status(400).json({ message: "No OTP found. Please request a new OTP." });
    }

    // Convert both to strings and trim whitespace for comparison
    const storedOtp = String(doctor.verificationCode).trim();
    const enteredOtp = String(otp).trim();

    console.log("OTP Comparison:", {
      storedOtp,
      enteredOtp,
      storedType: typeof doctor.verificationCode,
      enteredType: typeof otp,
      match: storedOtp === enteredOtp,
      expiryTime: doctor.verificationCodeExpire,
      currentTime: Date.now(),
      isExpired: doctor.verificationCodeExpire < Date.now()
    });

    if (
      storedOtp !== enteredOtp ||
      doctor.verificationCodeExpire < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    doctor.isVerified = true;
    doctor.verificationCode = undefined;
    doctor.verificationCodeExpire = undefined;
    await doctor.save();

    res.json({
      message: "Doctor verified successfully. Please wait for admin approval.",
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Resend OTP for doctor verification
// @route   POST /api/doctors/resend-otp
// @access  Public
const resendDoctorOtp = async (req, res) => {
  try {
    const { doctorId, verifyBy } = req.body;

    if (!doctorId) {
      return res.status(400).json({ message: "Doctor ID is required" });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    if (doctor.isVerified) {
      return res.status(400).json({ message: "Doctor already verified" });
    }

    // Generate new OTP
    const otp = generateOTP();
    doctor.verificationCode = otp;
    doctor.verificationCodeExpire = Date.now() + 10 * 60 * 1000; // 10 mins
    await doctor.save();

    await sendOTP({
      verifyBy,
      mobile: doctor.mobile,
      email: doctor.email,
      otp,
    });

    res.json({ message: `OTP resent to your ${verifyBy}` });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// @desc    Login doctor
// @route   POST /api/doctors/login
// @access  Public
const loginDoctor = async (req, res) => {
  try {
const { email, mobile, password } = req.body;
const doctor = email 
    ? await Doctor.findOne({ email }) 
    : await Doctor.findOne({ mobile });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    if (!doctor.isVerified) {
      return res.status(401).json({ message: "Please verify your account first." });
    }

    if (!doctor.isApproved) {
      return res.status(403).json({ message: "Your account is pending admin approval." });
    }

    const isMatch = await doctor.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    doctor.isActive = true;
    doctor.lastActiveAt = Date.now();  
    await doctor.save();

    res.json({
      token: generateToken(doctor._id,"doctor"),
      doctor: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        gender: doctor.gender,
        age: doctor.age,
        speciality: doctor.speciality,
        consultationMode: doctor.consultationMode,
        hospitalName: doctor.hospitalName,
        hospitalLocation: doctor.hospitalLocation,
        about: doctor.about,
        languages: doctor.languages,
        location: doctor.location,
        certification: doctor.certification,
        education: doctor.education,
        university: doctor.university,
        experience: doctor.experience,
        consultationFee: doctor.consultationFee,
        profileImage: doctor.profileImage,
        medicalCertificates: doctor.medicalCertificates,
        areaOfInterest:doctor.areaOfInterest,
        education:doctor.education,
        createdAt: doctor.createdAt,
        updatedAt: doctor.updatedAt,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



const requestLoginOTP = async (req, res) => {
  try {
    const { verifyBy, value } = req.body;

    let doctor = null;

    if (verifyBy === "email") {
      doctor = await Doctor.findOne({
        email: { $regex: `^${value.trim()}$`, $options: "i" },
      });
    } else if (verifyBy === "mobile") {
      doctor = await Doctor.findOne({ mobile: value.trim() });
    }

    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    if (!doctor.isVerified) return res.status(401).json({ message: "Please verify your account first." });
    if (!doctor.isApproved) return res.status(403).json({ message: "Pending admin approval." });

    const otp = generateOTP();
    doctor.loginOTP = otp;
    doctor.loginOTPExpire = Date.now() + 10 * 60 * 1000;
    await doctor.save();

    await sendOTP({
      verifyBy,
      mobile: doctor.mobile,
      email: doctor.email,
      otp,
    });

    res.json({ message: `OTP sent to your ${verifyBy}`,doctorId: doctor._id });
  } catch (error) {
    console.error("Error in requestLoginOTP:", error);
    res.status(500).json({ message: "Server error" });
  }
};



const resendLoginOTP = async (req, res) => {
  try {
    const { doctorId, verifyBy } = req.body;

    if (!doctorId) return res.status(400).json({ message: "Doctor ID is required" });

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    if (!doctor.isVerified) return res.status(401).json({ message: "Please verify your account first." });
    if (!doctor.isApproved) return res.status(403).json({ message: "Pending admin approval." });

    const otp = generateOTP();
    doctor.loginOTP = otp;
    doctor.loginOTPExpire = Date.now() + 10 * 60 * 1000;
    await doctor.save();

    await sendOTP({ verifyBy, mobile: doctor.mobile, email: doctor.email, otp });

    res.json({ message: `Login OTP resent to your ${verifyBy}` });
  } catch (error) {
    console.error("Resend Login OTP error:", error);
    res.status(500).json({ message: "Server error" });
  }
};



const verifyLoginOTP = async (req, res) => {
  try {
    const { otp } = req.body;
    const doctorId = req.headers.doctorid; 

    if (!doctorId) {
      return res.status(400).json({ message: "Doctor ID missing" });
    }

    if (!otp) {
      return res.status(400).json({ message: "OTP is required" });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    if (!doctor.loginOTP) {
      return res.status(400).json({ message: "No OTP found. Please request a new OTP." });
    }

    // Convert both to strings and trim whitespace for comparison
    const storedOtp = String(doctor.loginOTP).trim();
    const enteredOtp = String(otp).trim();

    if (storedOtp !== enteredOtp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    if (doctor.loginOTPExpire < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }
    doctor.loginOTP = undefined;
    doctor.loginOTPExpire = undefined;
    doctor.lastActiveAt = Date.now(); 
    await doctor.save();

    res.json({
      token: generateToken(doctor._id,"doctor"),
      doctor: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        gender: doctor.gender,
        age: doctor.age,
        speciality: doctor.speciality,
        consultationMode: doctor.consultationMode,
        hospitalName: doctor.hospitalName,
        hospitalLocation: doctor.hospitalLocation,
        about: doctor.about,
        languages: doctor.languages,
        location: doctor.location,
        certification: doctor.certification,
        education: doctor.education,
        university: doctor.university,
        experience: doctor.experience,
        consultationFee: doctor.consultationFee,
        profileImage: doctor.profileImage,
        medicalCertificates: doctor.medicalCertificates,
        createdAt: doctor.createdAt,
        updatedAt: doctor.updatedAt,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


const requestForgotPasswordOTP = async (req, res) => {
  try {
    const { verifyBy, value } = req.body;

    if (!verifyBy || !value)
      return res.status(400).json({ message: "verifyBy and value are required" });

    const method = verifyBy.toLowerCase();

    let doctor;
    if (method === "email") doctor = await Doctor.findOne({ email: value });
    else if (method === "mobile") doctor = await Doctor.findOne({ mobile: value });

    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    // Generate OTP
    const otp = generateOTP();
    doctor.resetOTP = otp;
    doctor.resetOTPExpire = Date.now() + 10 * 60 * 1000;
    doctor.resetOTPVerified = false;
    await doctor.save();

    await sendOTP({ verifyBy: method, mobile: doctor.mobile, email: doctor.email, otp });

    res.status(200).json({ message: `OTP sent to your ${method}`, doctorId: doctor._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


const resendForgotPasswordOTP = async (req, res) => {
  try {
    const { doctorId, verifyBy } = req.body;

    if (!doctorId) return res.status(400).json({ message: "Doctor ID is required" });

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    if (!doctor.isVerified) return res.status(401).json({ message: "Please verify your account first." });

    const otp = generateOTP();
    doctor.resetOTP = otp;
    doctor.resetOTPExpire = Date.now() + 10 * 60 * 1000;
    await doctor.save();

    await sendOTP({ verifyBy, mobile: doctor.mobile, email: doctor.email, otp });

    res.json({ message: `Forgot Password OTP resent to your ${verifyBy}` });
  } catch (error) {
    console.error("Resend Forgot Password OTP error:", error);
    res.status(500).json({ message: "Server error" });
  }
};



const verifyForgotPasswordOTP = async (req, res) => {
  try {
    const doctorId = req.headers['doctorid'];
    const { otp } = req.body;

    if (!doctorId) {
      return res.status(400).json({ message: "doctorId missing in headers" });
    }

    if (!otp) {
      return res.status(400).json({ message: "OTP is required" });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    if (!doctor.resetOTP) {
      return res.status(400).json({ message: "No OTP found. Please request a new OTP." });
    }

    // Convert both to strings and trim whitespace for comparison
    const storedOtp = String(doctor.resetOTP).trim();
    const enteredOtp = String(otp).trim();

    if (storedOtp !== enteredOtp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (doctor.resetOTPExpire < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    doctor.resetOTPVerified = true;
    await doctor.save();

    res.json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Server error" });
  }
};


const resetPassword = async (req, res) => {
  try {
    const doctorId = req.headers['doctorid']; 
    const { newPassword } = req.body;

    if (!doctorId) {
      return res.status(400).json({ message: "doctorId missing in headers" });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    if (!doctor.resetOTPVerified) {
      return res.status(400).json({ message: "OTP not verified" });
    }

    doctor.password = newPassword; // hashed in pre-save hook
    doctor.resetOTP = undefined;
    doctor.resetOTPExpire = undefined;
    doctor.resetOTPVerified = undefined;
    await doctor.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Server error" });
  }
};





// @desc    Logout doctor (stateless JWT)
// @route   POST /api/doctors/logout
// @access  Private (optional)
const logoutDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.doctor._id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    // Mark inactive when logging out
    doctor.isActive = false;
doctor.lastActiveAt = new Date(0); 
await doctor.save();


    res.status(200).json({
      message: "Doctor logged out successfully",
      doctorId: doctor._id,
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging out doctor" });
  }
};



const getDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.doctor._id);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json({
      _id: doctor._id,
      shortId: doctor.shortId,
      name: doctor.name,
      mobile: doctor.mobile,
      gender: doctor.gender,
      age: doctor.age,
      email: doctor.email,
      areaOfInterest: doctor.areaOfInterest,
      speciality: doctor.speciality,
      consultationMode: doctor.consultationMode,
      hospitalName: doctor.hospitalName,
      hospitalLocation: doctor.hospitalLocation,
      about: doctor.about,
      languages: doctor.languages,
      location: doctor.location,
      certification: doctor.certification,
      education: doctor.education,
      experience: doctor.experience,
      consultationFee: doctor.consultationFee,
      profileImage: doctor.profileImage,
      medicalCertificates: doctor.medicalCertificates,
      university: doctor.university,
      isActive: doctor.isActive,
      lastActiveAt: doctor.lastActiveAt,
      createdAt: doctor.createdAt,
      updatedAt: doctor.updatedAt,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};




// @desc    Toggle doctor active status
// @route   PUT /api/doctors/toggle-active
// @access  Private (doctor)
const toggleDoctorActive = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.doctor._id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    doctor.isActive = !doctor.isActive;
if (!doctor.isActive) doctor.lastActiveAt = new Date(0); 
await doctor.save();


    res.json({ message: `Doctor is now ${doctor.isActive ? "active" : "inactive"}`, isActive: doctor.isActive });
  } catch (error) {
    console.error("Error toggling active status:", error);
    res.status(500).json({ message: "Server error" });
  }
};



// @desc    Get doctor by ID
// @route   GET /api/doctors/:id
// @access  Public (patients/admins can view doctors)
const getDoctorById = async (req, res) => {
  try {
    let { id } = req.params;
    id = id.trim();
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid doctor ID format" });
    }
    const doctor = await Doctor.findById(id).select("-password");
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.json(doctor);
  } catch (error) {
    console.error("Error fetching doctor by ID:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// @desc    Update doctor profile
// @route   PUT /api/doctors/profile
// @access  Private
// const updateDoctorProfile = async (req, res) => {
//   try {
//     const doctor = await Doctor.findById(req.doctor._id);
//     if (!doctor) return res.status(404).json({ message: "Doctor not found" });

//     doctor.medicalCertificates = doctor.medicalCertificates || [];
//     const medicalCertificates = doctor.medicalCertificates;

//     const editableFields = [
//       "age",
//       "email",
//       "mobile",
//       "about",
//       "languages",
//       "location",
//       "certification",
//       "education",
//       "university",
//       "experience",
//       "consultationFee",
//       "consultationMode",
//       "hospitalName",
//       "hospitalLocation",
//       "areaOfInterest"
//     ];

//     const forbiddenFields = Object.keys(req.body).filter(f => !editableFields.includes(f));
//     if (forbiddenFields.length > 0) {
//       return res.status(400).json({ message: `Cannot edit fields: ${forbiddenFields.join(", ")}` });
//     }

//     editableFields.forEach(field => {
//       if (req.body[field] !== undefined) {
//         if (field === "languages") {
//           if (Array.isArray(req.body.languages)) {
//             doctor.languages = req.body.languages;
//           } else {
//             doctor.languages = req.body.languages.split(",").map(lang => lang.trim());
//           }
//         } else {
//           doctor[field] = req.body[field];
//         }
//       }
//     });

//     if (req.body.consultationMode) {
//       doctor.consultationMode = req.body.consultationMode;
//       if (["Clinic Visit", "Both"].includes(req.body.consultationMode)) {
//         if (!req.body.hospitalName || !req.body.hospitalLocation) {
//           return res.status(400).json({ message: "Hospital name and location are required for Clinic Visit mode" });
//         }
//         doctor.hospitalName = req.body.hospitalName;
//         doctor.hospitalLocation = req.body.hospitalLocation;
//       } else {
//         doctor.hospitalName = undefined;
//         doctor.hospitalLocation = undefined;
//       }
//     }

//     const files = req.files || {};

//     const uploadFile = async (fileArray, type, folder) => {
//       if (!fileArray || fileArray.length === 0) return;
//       try {
//         const url = await uploadToCloudinary(fileArray[0].buffer, folder);
//         const index = medicalCertificates.findIndex(cert => cert.type === type);
//         if (index !== -1) {
//           medicalCertificates[index].fileUrl = url;
//         } else {
//           medicalCertificates.push({ type, fileUrl: url });
//         }
//       } catch (err) {
//         console.error(`Failed to upload ${type}:`, err);
//         throw new Error(`Failed to upload ${type}`);
//       }
//     };

//     await Promise.all([
//       uploadFile(files.govtId, "Govt ID", "doctors/govtId"),
//       uploadFile(files.medicalLicense, "Medical License", "doctors/licenses"),
//       uploadFile(files.educationCertificate, "Education Certificate", "doctors/certificates"),
//       files.additionalCertificate && files.additionalCertificate.length > 0
//     ? Promise.all(
//         files.additionalCertificate.map(file =>
//           uploadToCloudinary(file.buffer, "doctors/additionalCertificates").then(url => {
//             medicalCertificates.push({ type: "Additional Certificate", fileUrl: url });
//           })
//         )
//       )
//     : null,
//       files.profileImage && files.profileImage.length > 0
//         ? uploadToCloudinary(files.profileImage[0].buffer, "doctors/profileImages").then(url => doctor.profileImage = url)
//         : null
//     ]);

//     const updatedDoctor = await doctor.save();
//     res.json(updatedDoctor);

//   } catch (error) {
//     console.error("Error updating doctor profile:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };


const updateDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.doctor._id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    doctor.medicalCertificates = doctor.medicalCertificates || [];
    const medicalCertificates = doctor.medicalCertificates;

    // Fields allowed to update
    const editableFields = [
      "backgroundImage",
      "profileImage",
      "medicalCertificates",
      "Govt ID",
      "Medical License",
      "Education Certificate",
      "age",
      "email",
      "mobile",
      "about",
      "languages",
      "location",
      "certification",
      "education",
      "university",
      "experience",
      "consultationFee",
      "consultationMode",
      "hospitalName",
      "hospitalLocation",
      "areaOfInterest",
    ];

    // Block unwanted fields
    const forbiddenFields = Object.keys(req.body).filter(
      (f) => !editableFields.includes(f)
    );
    if (forbiddenFields.length > 0) {
      return res
        .status(400)
        .json({ message: `Cannot edit fields: ${forbiddenFields.join(", ")}` });
    }

    // Update editable fields
    editableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === "languages") {
          doctor.languages = Array.isArray(req.body.languages)
            ? req.body.languages
            : req.body.languages.split(",").map((lang) => lang.trim());
        } else {
          doctor[field] = req.body[field];
        }
      }
    });

    // Handle consultation mode / hospital requirement
    if (req.body.consultationMode) {
      doctor.consultationMode = req.body.consultationMode;
      if (["Clinic Visit", "Both"].includes(req.body.consultationMode)) {
        if (!req.body.hospitalName || !req.body.hospitalLocation) {
          return res.status(400).json({
            message: "Hospital name and location are required for Clinic Visit mode",
          });
        }
        doctor.hospitalName = req.body.hospitalName;
        doctor.hospitalLocation = req.body.hospitalLocation;
      } else {
        doctor.hospitalName = req.body.hospitalName;
        doctor.hospitalLocation = req.body.hospitalLocation;
      }
    }

    // Files (skip if empty / not uploaded)
    const files = req.files || {};

    const uploadFile = async (fileArray, type, folder) => {
      if (!fileArray || fileArray.length === 0) return; // nothing uploaded
      if (!fileArray[0].buffer) return; // skip invalid
      try {
        const url = await uploadToCloudinary(fileArray[0].buffer, folder);
        const index = medicalCertificates.findIndex((cert) => cert.type === type);
        if (index !== -1) {
          medicalCertificates[index].fileUrl = url;
        } else {
          medicalCertificates.push({ type, fileUrl: url });
        }
      } catch (err) {
        console.error(`Failed to upload ${type}:`, err);
        throw new Error(`Failed to upload ${type}`);
      }
    };

    await Promise.all([
      files.govtId && files.govtId.length > 0
        ? uploadFile(files.govtId, "Govt ID", "doctors/govtId")
        : null,
      files.medicalLicense && files.medicalLicense.length > 0
        ? uploadFile(files.medicalLicense, "Medical License", "doctors/licenses")
        : null,
      files.educationCertificate && files.educationCertificate.length > 0
        ? uploadFile(files.educationCertificate, "Education Certificate", "doctors/certificates")
        : null,
      files.additionalCertificate && files.additionalCertificate.length > 0
        ? Promise.all(
            files.additionalCertificate.map((file) =>
              uploadToCloudinary(file.buffer, "doctors/additionalCertificates").then(
                (url) => {
                  medicalCertificates.push({
                    type: "Additional Certificate",
                    fileUrl: url,
                  });
                }
              )
            )
          )
        : null,
      files.profileImage && files.profileImage.length > 0
        ? uploadToCloudinary(files.profileImage[0].buffer, "doctors/profileImages").then(
            (url) => (doctor.profileImage = url)
          )
        : null,
         files.backgroundImage && files.backgroundImage.length > 0
        ? uploadToCloudinary(files.backgroundImage[0].buffer, "doctors/backgroundImages").then(
            (url) => (doctor.backgroundImage = url)
          )
        : null,
    ]);

    const updatedDoctor = await doctor.save();
    res.json(updatedDoctor);
  } catch (error) {
    console.error("Error updating doctor profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// @desc    Get doctors by category (speciality)
// @route   GET /api/doctors/category/:id
// @access  Public
const getDoctorsByCategory = async (req, res) => {
  try {
const doctors = await Doctor.find({
  speciality: { $regex: new RegExp(`^${req.params.id}$`, "i") },
  isActive: true,
  lastActiveAt: { $gte: new Date(Date.now() - 1000 * 60 * 5) }
});
   

    if (doctors.length === 0) {
      return res.json({
        speciality: req.params.id,
        message: "No doctors are present in this speciality",
      });
    }

    res.json({
      speciality: doctors[0].speciality,
      doctors,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @route   GET /api/doctors/filter
// @access  Public
const filterDoctors = async (req, res) => {
  try {
    const filters = {};

if (req.query.hospitalLocation) {
  const locations = Array.isArray(req.query.hospitalLocation)
    ? req.query.hospitalLocation
    : [req.query.hospitalLocation];

  filters.hospitalLocation = { $in: locations };
}


    if (req.query.gender) {
      const genders = Array.isArray(req.query.gender)
        ? req.query.gender
        : [req.query.gender];
      filters.gender = { $in: genders };
    }

    if (req.query.languages) {
      const langs = Array.isArray(req.query.languages)
        ? req.query.languages
        : [req.query.languages];
      filters.languages = { $in: langs };
    }

    if (req.query.consultationFee) {
      const fees = Array.isArray(req.query.consultationFee)
        ? req.query.consultationFee.map(Number)
        : [Number(req.query.consultationFee)];
      filters.consultationFee = { $in: fees };
    }

    console.log("Applied Filters:", filters); 


    // Always filter only active doctors
    // filters.isActive = true;
    // filters.lastActiveAt = { $gte: new Date(Date.now() - 1000 * 60 * 5) }; 


    const doctors = await Doctor.find(filters);
    res.json(doctors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete a doctor by ID (Admin only)
// @route   DELETE /api/doctors/:id
// @access  Private/Admin
const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    await doctor.deleteOne();
    res.status(200).json({ message: "Doctor deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};



// @desc    Get all doctors (all fields except sensitive ones, with id)
// @route   GET /api/doctors
// @access  Public
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().select(
      "-password -verificationCode -loginOTP -resetOTP -__v"
    );

    if (!doctors || doctors.length === 0) {
      return res.status(404).json({ message: "No doctors found" });
    }

    // Map to rename _id -> id
    const formattedDoctors = doctors.map((doc) => ({
      id: doc._id,
      ...doc.toObject(),
      _id: undefined, // Remove _id field
    }));

    res.json({ count: formattedDoctors.length, doctors: formattedDoctors });
  } catch (error) {
    console.error("Error fetching all doctors:", error);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
  registerDoctor,
  verifyDoctorOtp,
  requestLoginOTP,
  resendLoginOTP,
  verifyLoginOTP,
  resendDoctorOtp,
  requestForgotPasswordOTP,
  resendForgotPasswordOTP,
  verifyForgotPasswordOTP,
  resetPassword,
  loginDoctor,
  toggleDoctorActive,
  updateDoctorProfile,
  getDoctorsByCategory,
  getDoctorProfile,
  getDoctorById,
  filterDoctors,
  logoutDoctor,
  deleteDoctor,getAllDoctors
};
