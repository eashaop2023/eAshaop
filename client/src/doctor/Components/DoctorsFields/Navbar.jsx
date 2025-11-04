import React, { useEffect, useState } from "react";
import { Bell, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo from "../../../assets/eAshalogo.png";
import axios from "axios";
import { API_BASE_URL } from "../../../api-config";
import socket from "../../../common/socket";

const Navbar = () => {
  const navigate = useNavigate();
  const [profileImage,setProfileImage]=useState(0)
  const [doctorId,setDoctorId]=useState("");

  const handleUserClick = () => {
  navigate("/doctor/doctorprofile"); 
};
  // ✅ Step 1: Load doctorId first
  useEffect(() => {
    const storedId = localStorage.getItem("doctorId");
    if (storedId) {
      setDoctorId(storedId);
    }
  }, []);

  // ✅ Step 2: Fetch profile & join socket only when doctorId is available
  useEffect(() => {
    if (!doctorId) return;

    async function fetchDoctorProfile() {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        const res = await axios.get(`${API_BASE_URL}/api/doctors/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProfileImage(res.data.profileImage);
      } catch (err) {
        console.error("Error fetching doctor profile:", err);
      }
    }

    fetchDoctorProfile();

    // ✅ Join doctor socket room
    socket.emit("joinDoctorProfileRoom", doctorId);

    // ✅ Listen for profile updates
    const handleProfileUpdate = (data) => {
      if (data.DoctorId === doctorId) {
        const newImage = data.profileImage.cloudinaryUrl || data.profileImage;
        setProfileImage(newImage);
      }
    };

    socket.on("DoctorprofileImageUpdated", handleProfileUpdate);

    return () => {
      socket.off("DoctorprofileImageUpdated", handleProfileUpdate);
    };
  }, [doctorId]); // 👈 Runs whenever doctorId is set
// useEffect(() => {
//   const doctorId = localStorage.getItem("doctorId"); // make sure this is correct
//   if (!doctorId) return;

//   async function fetchDoctorProfile() {
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) return;

//       const res = await axios.get(`${API_BASE_URL}/api/doctors/profile`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const profile = res.data.profileImage;
//       setProfileImage(profile);
//     } catch (err) {
//       console.error("Error fetching doctor profile:", err);
//     }
//   }

//   fetchDoctorProfile();

//   // ✅ Join doctor's personal room
//   socket.emit("joinDoctorProfileRoom", doctorId);
//   //console.log(`Joined Doctor profile room: ${doctorId}`);

 
//   const handleProfileUpdate = (data) => {
   

//     if (data.DoctorId === doctorId) {
//       const newImage = data.profileImage.cloudinaryUrl || data.profileImage;
//       setProfileImage(newImage);
//      // console.log("✅ Updated profile image in UI");
//     }
//   };

//   socket.on("DoctorprofileImageUpdated", handleProfileUpdate);

//   // Cleanup listener only, don't disconnect the socket
//   return () => {
//     socket.off("DoctorprofileImageUpdated", handleProfileUpdate);

//   };
// }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-16 flex items-center justify-between px-6 border-b border-[#F7F7F7] shadow-sm bg-white z-50">
      {/* Left Section: Logo */}
      <img src={Logo} alt="Logo" className="w-16 h-auto" />

      {/* Right Section: Icons */}
      <div className="flex items-center gap-4 mr-[40px]">
        <button className="p-1 bg-transparent border-none">
          <Bell className="w-6 h-6" />
        </button>
          <img
          src={profileImage}
          alt="DoctorImage"
          className="rounded-circle hover:cursor-pointer"
          style={{ width: '48px', height: '48px', objectFit: 'cover' }}
          onClick={handleUserClick}
        />
        {/* ✅ Clicking this goes to Registration */}
     
      </div>
    </div>
  );
};

export default Navbar;
