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

useEffect(() => {
  const doctorId = localStorage.getItem("doctorId"); // make sure this is correct
  if (!doctorId) return;

  async function fetchDoctorProfile() {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      const res = await axios.get(`${API_BASE_URL}/api/doctors/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const profile = res.data.profileImage;
      setProfileImage(profile);
      //console.log("Doctor profile fetched:", profile);
    } catch (err) {
      console.error("Error fetching doctor profile:", err);
    }
  }

  fetchDoctorProfile();

  // ✅ Join doctor's personal room
  socket.emit("joinDoctorProfileRoom", doctorId);
  //console.log(`Joined Doctor profile room: ${doctorId}`);

  // ✅ Handle profile image updates
  const handleProfileUpdate = (data) => {
   // console.log("Received profile image update:", data);

    if (data.DoctorId === doctorId) {
      const newImage = data.profileImage.cloudinaryUrl || data.profileImage;
      setProfileImage(newImage);
     // console.log("✅ Updated profile image in UI");
    }
  };

  socket.on("DoctorprofileImageUpdated", handleProfileUpdate);

  // Cleanup listener only, don't disconnect the socket
  return () => {
    socket.off("DoctorprofileImageUpdated", handleProfileUpdate);
    //console.log("✅ Removed Doctor profile listener");
  };
}, []);

// useEffect(() => {
//   async function fetchDoctorProfile() {
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         // console.warn("⚠️ No auth token found");
//         return;
//       }

//       const res = await axios.get(`${API_BASE_URL}/api/doctors/profile`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setProfileImage(res.data.profileImage)
//       console.log("✅ Doctor profile:", res.data);
//       // setDoctorId(res.data.)

//       // setDoctor(res.data.doctor); // example
//     } catch (err) {
//       console.error("Error fetching doctor profile:", err);
//     }
//   }

//   fetchDoctorProfile();

//    //  Join the user's personal room
//       socket.emit("joinDoctorProfileRoom",doctorId);
//       console.log(`Joined Doctor profile room: ${doctorId}`);
//       socket.on("DoctorprofileImageUpdated", (data) => {
//       console.log("Received profile image update:", data);

//       if (data.DoctorId === storedUser.id) {
//         const newImage = data.profileImage.cloudinaryUrl || data.profileImage;

//         setProfileImage(newImage);

//         // Update localStorage too
//         // const updatedUser = {
//         //   ...storedUser,
//         //   profileImage: { cloudinaryUrl: newImage },
//         // };
//         // localStorage.setItem("user", JSON.stringify(updatedUser));

//         console.log("✅ Updated profile image in UI + localStorage");
//       }
//     });

//     // 5️⃣ Cleanup on unmount
//     return () => {
//       socket.off("profileImageUpdated");
//       socket.disconnect();
//       console.log("Socket disconnected from Topbar");
//     };
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
