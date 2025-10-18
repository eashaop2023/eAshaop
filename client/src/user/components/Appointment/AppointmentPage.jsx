import React, { useState, useRef, useEffect } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { API_BASE_URL } from "../../../api-config";
import "./AppointmentFirst.css";

import Profile from "../../assets/confirmappointmenticons/doctor.jpg";
import Call from "../../assets/confirmappointmenticons/call.svg";
import Calender from "../../assets/calendar.svg";
import Arrowleft from "../../assets/confirmappointmenticons/arrow-left.svg";
import AddMemberForm from "../addmemberform/AddMemberForm";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AppointmentPage() {
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [selectedSlot, setSelectedSlot] = useState(() => {
    return sessionStorage.getItem("selectedSlot") || null;
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedMemberIndex, setSelectedMemberIndex] = useState(0);
  const [showAddMember, setShowAddMember] = useState(false);
  const [doctor, setDoctor] = useState(null);

  const datePickerRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { doctorId, consultationType } = location.state || {};

  // Fetch doctor
  useEffect(() => {
    if (!doctorId) return;
    const fetchDoctor = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/doctors/${doctorId}`);
        setDoctor(res.data);
      } catch (err) {
        console.error("Error fetching doctor:", err);
      }
    };
    fetchDoctor();
  }, [doctorId]);

  // Fetch available slots
  useEffect(() => {
    if (!doctorId || !startDate) return;

    const fetchSlots = async () => {
      try {
        const dateStr = startDate.toLocaleDateString("en-CA");
        const res = await axios.get(
          `${API_BASE_URL}/api/doctors/${doctorId}/availability/${dateStr}`
        );
        let slots = res.data.slots || [];

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        slots = slots.filter((slot) => {
          const [hour, minute] = slot.start.split(":").map(Number);
          const slotTime = new Date(startDate);
          slotTime.setHours(hour, minute, 0, 0);
          return startDate.toDateString() === today.toDateString()
            ? slotTime >= new Date()
            : true;
        });

        // slots = slots.slice(0, 8);
        setAvailableSlots(slots);
        setSelectedSlot((prev) => (!prev && slots.length > 0 ? slots[0].start : prev));
      } catch (err) {
        console.error("Error fetching slots:", err);
        setAvailableSlots([]);
        setSelectedSlot(null);
      }
    };

    fetchSlots();
    const interval = setInterval(fetchSlots, 60 * 1000);
    return () => clearInterval(interval);
  }, [doctorId, startDate]);

  // Load user & dependents
useEffect(() => {
  const fetchUserAndDependents = async () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) return;

    const mainUser = {
      name: storedUser.full_name || storedUser.name || "Unknown Patient",
      age: storedUser.age || "Not Provided",
      sex: storedUser.sex || storedUser.gender || "Not Provided",
      isUser: true,
      _id: storedUser._id || storedUser.id,
    };

    try {
      // Call backend to fetch dependents
      const res = await axios.get(`${API_BASE_URL}/api/user/${mainUser._id}`);
      const dependents = (res.data.userDependent || []).map(dep => ({
        name: dep.full_name,
        age: Math.floor((Date.now() - new Date(dep.dob).getTime()) / 31557600000),
        sex: dep.gender,
        isUser: false,
        _id: dep._id,
      }));

      setMembers([mainUser, ...dependents]);
      setSelectedMemberIndex(0);
    } catch (err) {
      console.error("Error fetching dependents:", err);
      setMembers([mainUser]); // fallback
    }
  };

  fetchUserAndDependents();
}, []);

  // Add member
  const handleAddMember = async (memberData) => {
    try {

       if (members.length >= 5) {
      return toast.error("You can add a maximum of 4 dependents per user.");
    }
const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
const userId = storedUser._id || storedUser.id;

if (!userId) return toast.error("User not found");

 if (!memberData.address || memberData.address.length < 10) {
      return toast.error("Address must be at least 10 characters long");
    }

     // Convert DOB from "DD-MM-YYYY" to Date object
    const [day, month, year] = memberData.dob.split("-");
    const dobDate = new Date(year, month - 1, day);
    if (isNaN(dobDate.getTime())) {
      return toast.error("Invalid date of birth");
    }

      const payload = {
        userId,
        full_name: memberData.fullName,
        phone_number: memberData.mobileNumber,
        gender: memberData.gender,
        email: memberData.email,
        dob: dobDate,
        relation: memberData.relation,
        address: memberData.address,
        pincode: memberData.pinCode,
      };

      const res = await axios.post(`${API_BASE_URL}/api/user/dependent`, payload);
      toast.success(res.data.message);

      const age = Math.floor((Date.now() - dobDate.getTime()) / 31557600000);

      const newMember = {
        name: memberData.fullName,
        age,
        sex: memberData.gender,
        isUser: false,
        _id: res.data.dependentId || null,
      };

      setMembers((prev) => [...prev, newMember]);
      setShowAddMember(false);
    } catch (err) {
      console.error("Error adding dependent:", err);
      toast.error(err.response?.data?.message || "Failed to add dependent");
    }
  };

  // Remove dependent
// Remove dependent
const removeDependent = async (index) => {
  const dep = members[index];
  if (!dep || dep.isUser) return;

  try {
    console.log("Removing dependent:", dep);

    const res = await axios.post(
      `${API_BASE_URL}/api/user/dependent`, // endpoint
      { _id: dep._id },                     // body
      { params: { removeDependent: true } } // query params
    );

    // Update state
    setMembers((prev) => prev.filter((_, i) => i !== index));
    if (selectedMemberIndex === index) setSelectedMemberIndex(0);

    toast.success(res.data.message || "Dependent removed successfully");
  } catch (err) {
    console.error("Error removing dependent:", err);
    toast.error(err.response?.data?.message || "Failed to remove dependent");
  }
};


  const handleDateChange = (date) => {
    if (!date) return;
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    setStartDate(normalized);
  };

  const handleCalendarClick = () => {
    if (datePickerRef.current) datePickerRef.current.setOpen(true);
  };

  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + i);
    return d;
  });

  useEffect(() => {
    if (selectedSlot) sessionStorage.setItem("selectedSlot", selectedSlot);
  }, [selectedSlot]);

  const selectedMember = members[selectedMemberIndex];

  return (
    <Container fluid className="p-4 doctor-details-container main-container" style={{ fontFamily: "Urbanist, sans-serif" }}>
      <Row className="doctor-info">
        {/* Left: Doctor Details */}
        <Col xs={12} lg={4} className=" mb-4 mb-lg-0 doctor-details" style={{width:'100%'}}>
          <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: "24px", marginTop: "80px", marginLeft: "40px" }}>
            <button onClick={() => navigate(-1)} className="btn btn-link d-flex align-items-center text-decoration-none mb-3" style={{ color: "#00A99D", fontWeight: 500, fontSize: "18px" }}>
              <img src={Arrowleft} alt="Back" style={{ width: "24px", height: "24px", marginRight: "8px" }} />
              Doctors
            </button>

            <div className="doctor-img-data w-100">
              <div className="d-flex justify-content-center w-100 mb-3">
                <img src={doctor?.profileImage || Profile} alt={doctor?.name} className="rounded-circle appointment-image" style={{ height: '120px', width: '120px', objectFit: 'cover' }} />
              </div>
              <div className="doctor-data d-flex flex-column gap-2">
                <h5 className="mt-3 mb-0 fw-bold text-[22px]">{doctor?.name} <small className="fw-medium text-[18px]">{doctor?.education}</small></h5>
                <p className="text-muted fw-medium text-[18px] mb-0">♡ {doctor?.speciality}</p>
                <div className="d-flex align-items-center fw-medium text-[18px] gap-1 text-muted">
                  <span style={{ color: "#FDCB02", fontSize: "16px" }}>★</span><span>{doctor?.averageRating} / 5</span>
                </div>
              </div>
            </div>

            <div className="d-flex w-100 justify-content-between mb-3">
<Button variant="outline" className="w-100 fw-normal text-[18px] call-btn" style={{ backgroundColor: "#EDFFFE", color: "#00A99D", borderRadius: "28px", height: "72px", width: "272px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                <img src={Call} alt="call" className="h-8 w-8 text-[18px]" /> <span className="fw-normal text-[20px]">Call</span>
              </Button>
            </div>

            <div className="heading w-100">
              <h6 className="fw-bold" style={{ fontSize: "18px" }}>About</h6>
              <p className="text-muted small doctor-about" style={{ fontSize: "17px" }}>{doctor?.about}</p>
              <h6 className="fw-bold" style={{ fontSize: "18px" }}>Languages</h6>
              <p className="text-muted small" style={{ fontSize: "17px" }}>{doctor?.languages?.join(", ")}</p>
              <h6 className="fw-bold" style={{ fontSize: "18px" }}>Areas of Expertise</h6>
              <div className="d-flex flex-wrap gap-3">
                {doctor?.areaOfInterest?.split(",").map((item) => (
                  <span key={item} className="badge bg-light text-dark rounded-pill" style={{ padding: '10px 15px', height: '37px', fontWeight: 400,fontSize:'14px' }}>{item}</span>
                ))}
              </div>
            </div>

            <div className="education-section">
              <h6 className="fw-bold education-heading" style={{ fontSize: "18px" }}>Education & Training</h6>
              <p className="text-muted small mb-1" style={{ fontSize: "17px" }}>Degree: {doctor?.education} from {doctor?.university}</p>
              <p className="text-muted small" style={{ fontSize: "17px" }}>Works at: {doctor?.hospitalName}</p>

            </div>
          </div>
        </Col>

        {/* Right: Appointment */}
        <Col xs={12} lg={8} className="appointment-section d-flex justify-content-center">
          <div className="appointment-div mx-auto" style={{ gap: "24px", marginTop: "80px" }}>
            <h5 className="fw-medium mb-3">Book Appointment</h5>

            {/* Members */}
            <div className="mb-3 dependents-container">
              {members.map((member, idx) => (
                <div key={idx} className="d-flex justify-content-between align-items-center p-3 rounded-pill mb-3 border dependent">
                  <div>
                    <div className="fw-medium">{member.name}</div>
                    <div className="text-muted small">Age - {member.age} | Sex - {member.sex}</div>
                  </div>
                  {!member.isUser && <button onClick={() => removeDependent(idx)}>Remove</button>}
                  <Form.Check type="radio" name="patient" checked={selectedMemberIndex === idx} onChange={() => setSelectedMemberIndex(idx)} />
                </div>
              ))}
            </div>
                          <a href="#" onClick={(e) => { e.preventDefault(); setShowAddMember(true); }} style={{ color: '#00A99D', fontSize: '0.9rem' }}>Add dependent</a>



            {/* Calendar */}
            <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap calendar-days-container">
              <div className="d-flex gap-2">
                {weekDays.map((day, i) => {
                  const isSelected = day.toDateString() === startDate.toDateString();
                  return (
                    <div key={i} className="text-center rounded" style={{ width: 40, backgroundColor: isSelected ? '#00A99D' : 'transparent', color: isSelected ? '#fff' : '#000', padding: '6px 5px', cursor: 'pointer' }} onClick={() => handleDateChange(day)}>
                      <div>{["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][day.getDay()]}</div>
                      <div>{day.getDate()}</div>
                    </div>
                  );
                })}
              </div>

              <div className="d-flex flex-column align-items-center gap-0 text-muted mt-2 mt-sm-0">
                <img src={Calender} alt="calendar" style={{ width: 32, height: 32, cursor: 'pointer' }} onClick={handleCalendarClick} />
                <div style={{ fontSize: '14px', fontWeight: 500, color: '#252525' }}>{startDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                <DatePicker
                  ref={datePickerRef}
                  selected={startDate}
                  onChange={handleDateChange}
                  minDate={new Date()}
                  popperPlacement="top-start"
                  showPopperArrow={false}
                  popperClassName="custom-datepicker-popper"
                  calendarClassName="calendar-wrapper"
                  customInput={<div style={{ display: 'none' }} />}
                />
              </div>
            </div>

            {/* Slots */}
            <div className="d-flex flex-wrap gap-3 mb-3 slot-section">
              {availableSlots.length > 0 ? (
                availableSlots.map(slot => (
                  <div key={`${slot.start}-${slot.end}`} className="px-3 py-2 rounded-pill slot-time" style={{ backgroundColor: selectedSlot === slot.start ? "#00A99D" : "#F0F0F0", color: selectedSlot === slot.start ? "white" : "black" }} onClick={() => setSelectedSlot(slot.start)}>
                    {slot.start} - {slot.end}
                  </div>
                ))
              ) : <p className="text-muted">No slots available for this date.</p>}
            </div>

<div className="d-flex align-items-center gap-2 mb-3 book-button" style={{ flexWrap: "nowrap" }}>
              <div className="d-flex align-items-center gap-2 px-3 py-2 border rounded-pill w-100 book-time" style={{ color: '#00A99D', border: '1px solid #00A99D' }}>
                <span>{startDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                <div style={{ width: 1, height: 20, backgroundColor: '#00A99D' }} />
                <span>{selectedSlot || "Select slot"}</span>
              </div>

<Button
  style={{
    backgroundColor: "#00A99D",
    borderColor: "#00A99D",
    borderRadius: 999,
    padding: "6px 10px",
    flexShrink: 0,
  }}
  onClick={() => {
    try {
      if (!selectedMember) return toast.error("Please select a patient.");
      if (!selectedSlot) return toast.error("Please select a time slot.");

      const appointmentDateTime = new Date(startDate);
      const [hours, minutes] = selectedSlot.split(":").map(Number);
      appointmentDateTime.setHours(hours, minutes, 0, 0);

      const appointmentData = {
        member: selectedMember,
        slot: selectedSlot,
        date: appointmentDateTime.toISOString(),
        doctor,
        amount: doctor?.consultationFee,
        consultationType,
      };

      localStorage.setItem("appointmentData", JSON.stringify(appointmentData));

      toast.success(`Selected slot at ${selectedSlot} Redirecting...`, {
        autoClose: 1000,
        position: "top-center",
      });

      setTimeout(
        () => navigate("/user/category/confirmappointment", { state: appointmentData }),
        1000
      );

      setAvailableSlots((prev) => prev.filter((s) => s.start !== selectedSlot));
      setSelectedSlot(null);
    } catch (err) {
      console.error("Slot check error:", err);
      toast.error("Failed to process appointment. Please try again.");
    }
  }}
>
  Book slot
</Button>
            </div>
          </div>
        </Col>
      </Row>

      {showAddMember && (
        <>
          <div className='outerAddmember' style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000 }} />
          <div style={{ position: 'fixed', top: 50, left: 0, width: '100vw', height: '100vh', zIndex: 1001, overflowY: 'auto' }}>
<AddMemberForm onClose={() => setShowAddMember(false)} onAdd={handleAddMember} />
          </div>
        </>
      )}
    </Container>
  );
}
