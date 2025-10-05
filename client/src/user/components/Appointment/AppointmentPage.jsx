import React, { useState, useRef, useEffect } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Profile from "../../assets/confirmappointmenticons/doctor.jpg";
import Call from "../../assets/confirmappointmenticons/call.svg";
import Calender from "../../assets/calendar.svg";
import Arrowleft from "../../assets/confirmappointmenticons/arrow-left.svg";
import AddMemberForm from "../addmemberform/AddMemberForm";

export default function AppointmentPage() {
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedMemberIndex, setSelectedMemberIndex] = useState(0);
  const [showAddMember, setShowAddMember] = useState(false);
  const [doctor, setDoctor] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1020);

  const datePickerRef = useRef(null);
  const bottomRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { doctorId, consultationType } = location.state || {};

  // Responsive
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1020);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch doctor details
  useEffect(() => {
    if (!doctorId) return;

    const fetchDoctor = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/doctors/${doctorId}`);
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
        const res = await axios.get(`http://localhost:5000/api/doctors/${doctorId}/availability/${dateStr}`);
        let slots = res.data.slots || [];

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        slots = slots.filter(slot => {
          const [hour, minute] = slot.start.split(":").map(Number);
          const slotTime = new Date(startDate);
          slotTime.setHours(hour, minute, 0, 0);

          return startDate.toDateString() === today.toDateString()
            ? slotTime >= new Date()
            : true;
        });

        slots = slots.slice(0, 8); // Limit next 8 slots
        setAvailableSlots(slots);
        setSelectedSlot(slots.length > 0 ? slots[0].start : null);
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

  // Load user & dependents from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

    const user = JSON.parse(storedUser);
//     const calculateAge = dob => {
//   if (!dob) return "Not Provided"; // handle missing DOB
//   const birthDate = new Date(dob);
//   if (isNaN(birthDate.getTime())) return "Not Provided"; // invalid date
//   const today = new Date();
//   let age = today.getFullYear() - birthDate.getFullYear();
//   const monthDiff = today.getMonth() - birthDate.getMonth();
//   if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
//   return age;
// };


    const mainUser = {
  name: user.full_name || user.name || "Unknown Patient",
  age: user.age || "Not Provided", // use age from localStorage
  sex: user.gender || user.sex || "Not Provided", // fallback to stored gender
  isUser: true,
  _id: user._id || user.id
};


    setMembers([mainUser, ...(user.dependents || [])]);

    console.log("Loaded user from localStorage:", user);
  console.log("Main user object used in appointment page:", mainUser)
  }, []);

  // Handle adding a dependent
  const handleAddMember = memberData => {
    const [day, month, year] = memberData.dob.split("-");
    const dobDate = new Date(year, month - 1, day);
    const age = Math.floor((Date.now() - dobDate.getTime()) / 31557600000);

    const newMember = { name: memberData.fullName, age, sex: memberData.gender, isUser: false };
    setMembers(prev => {
      const updated = [...prev, newMember];
      const storedUser = JSON.parse(localStorage.getItem("user")) || {};
      const dependents = storedUser.dependents || [];
      const isDuplicate = dependents.some(d => d.name === newMember.name && d.age === newMember.age && d.sex === newMember.sex);
      if (!isDuplicate) {
        storedUser.dependents = [...dependents, newMember];
        localStorage.setItem("user", JSON.stringify(storedUser));
      }
      return updated;
    });
    setShowAddMember(false);
  };

  // Remove a dependent
  const removeDependent = index => {
    setMembers(prev => {
      const updated = prev.filter((m, i) => i !== index || m.isUser);
      const storedUser = JSON.parse(localStorage.getItem("user")) || {};
      storedUser.dependents = updated.filter(m => !m.isUser);
      localStorage.setItem("user", JSON.stringify(storedUser));

      if (selectedMemberIndex === index) setSelectedMemberIndex(0);
      return updated;
    });
  };

  // Handle date change
  const handleDateChange = date => {
    if (!date) return;
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    setStartDate(normalized);
  };

  const handleCalendarClick = () => {
    if (datePickerRef.current) datePickerRef.current.setOpen(true);
    setTimeout(() => window.scrollBy({ top: -120, behavior: "smooth" }), 120);
  };

  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + i);
    return d;
  });

  const mainUser = members.find(m => m.isUser);
  const selectedMember = members[selectedMemberIndex];

  return (
    <Container fluid className="p-4 doctor-details-container main-container" style={{ fontFamily: "Urbanist, sans-serif" }}>
      <Row className="doctor-info">
        {/* Left Column: Doctor Details */}
        <Col xs={12} lg={4} className="pe-lg-5 mb-4 mb-lg-0 doctor-details">
          <div style={{ padding: "0 16px", width: "100%", display: "flex", flexDirection: "column", gap: "24px", marginTop: "80px", marginLeft: "40px" }}>
            <button onClick={() => navigate(-1)} className="btn btn-link d-flex align-items-lg-center text-decoration-none mb-3 d-inline-block book-btn" style={{ color: "#00A99D", fontWeight: 500, fontSize: "18px", paddingTop: "10px", marginLeft: "0px" }}>
              <img src={Arrowleft} alt="Back" style={{ width: "24px", height: "24px", marginRight: "8px", verticalAlign: "middle" }} />
              Doctors
            </button>

            <div className="mb-3 doctor-img-data w-100">
              <div className="d-flex justify-content-center w-100 bottom-2 mb-3">
                <img src={doctor?.profileImage || Profile} alt={`Dr. ${doctor?.name}`} className="rounded-circle appointment-image" style={{ height: '120px', width: '120px', objectFit: 'cover' }} />
              </div>
              <div className="doctor-data d-flex flex-column gap-2">
                <h5 className="mt-3 mb-0 fw-bold text-[22px]">{doctor?.name} <small className="fw-medium text-[18px]">{doctor?.education}</small></h5>
                <p className="text-muted fw-medium text-[18px] mb-0">♡ {doctor?.speciality}</p>
                <div className="d-flex align-items-center fw-medium text-[18px] gap-1 text-muted"><span style={{ color: "#FDCB02", fontSize: "16px" }}>★</span><span>{doctor?.averageRating} / 5</span></div>
              </div>
            </div>

            <div className="d-flex w-100 justify-content-between mb-3 button-group-mobile">
              <Button variant="outline" className="w-100 fw-normal text-[18px] call-btn" style={{ backgroundColor: "#EDFFFE", color: "#00A99D", borderRadius: "28px", height: "72px", width: "272px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                <img src={Call} alt="call" className="h-8 w-8 text-[18px]" /> <span className="fw-normal text-[20px]">Call</span>
              </Button>
            </div>

            <div className="heading w-100">
              <h6 className="fw-bold w-100" style={{ fontSize: "18px" }}>About</h6>
              <p className="text-muted small w-100" style={{ fontSize: "17px" }}>{doctor?.about}</p>

              <h6 className="fw-bold" style={{ fontSize: "18px" }}>Languages</h6>
              <p className="text-muted small" style={{ fontSize: "17px" }}>{doctor?.languages?.join(', ')}</p>

              <h6 className="fw-bold" style={{ fontSize: "18px" }}>Areas of Expertise</h6>
              <div className="d-flex flex-wrap gap-3" style={{ fontSize: "18px" }}>
                {doctor?.areaOfInterest?.split(',').map(item => (
                  <span key={item} className="badge bg-light text-dark rounded-pill" style={{ width: 'auto', padding: '10px 15px', height: '37px', fontWeight: 400 }}>{item}</span>
                ))}
              </div>

              <h6 className="fw-bold" style={{ fontSize: "18px" }}>Education & Training</h6>
              <p className="text-muted small mb-1" style={{ fontSize: "17px" }}>Degree: {doctor?.education} from {doctor?.university}</p>
              <p className="text-muted small" style={{ fontSize: "17px" }}>Works at: {doctor?.hospitalName}</p>
            </div>
          </div>
        </Col>

        {/* Right Column: Appointment Section */}
        <Col xs={12} lg={8} className="appointment-section" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="appointment-div mx-auto fixed lg:static md-w-[400px] sm:w-[100%] lg:w-[600px]" style={{ height: 604.5, position: isMobile ? "static" : "fixed", top: isMobile ? "auto" : "60px", gap: "24px" }}>
            <h5 className="fw-medium mb-3">Book Appointment</h5>

            {/* Members */}
            <div className="mb-3">
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

              <a href="#" onClick={e => { e.preventDefault(); setShowAddMember(true); }} style={{ color: '#00A99D', fontSize: '0.9rem' }}>Add dependent</a>
            </div>

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
                  popperClassName="custom-datepicker-popper"
                  calendarClassName="calendar-wrapper"
                  showPopperArrow={false}
                  popperModifiers={[{ name: 'offset', options: { offset: [0, -10] } }, { name: 'preventOverflow', options: { altAxis: true } }]}
                  customInput={<div style={{ display: 'none' }} />}
                />
              </div>
            </div>

            {/* Slots */}
            <div className="d-flex flex-wrap gap-3 mb-3 slot-section">
              {availableSlots.length > 0 ? (
                availableSlots.map(slot => (
                  <div key={`${slot.start}-${slot.end}`} className="px-3 py-2 rounded-pill slot-time" style={{ backgroundColor: selectedSlot === slot.start ? "#00A99D" : "#F0F0F0", color: selectedSlot === slot.start ? "white" : "black", cursor: "pointer" }} onClick={() => setSelectedSlot(slot.start)}>
                    {slot.start} - {slot.end}
                  </div>
                ))
              ) : <p className="text-muted">No slots available for this date.</p>}
            </div>

            {/* Book Button */}
            <div className="d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center gap-2 mb-3 book-button">
              <div className="d-flex align-items-center gap-2 px-3 py-2 border rounded-pill w-100 book-time" style={{ color: '#00A99D', border: '1px solid #00A99D' }}>
                <span>{startDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                <div style={{ width: 1, height: 20, backgroundColor: '#00A99D' }} />
                <span>{selectedSlot || "Select slot"}</span>
              </div>

<Button
  style={{ backgroundColor: "#00A99D", borderColor: "#00A99D", borderRadius: 999, padding: "6px 16px", minWidth: 102 }}
  onClick={async () => {
    if (!selectedMember) return alert("Please select a patient.");
    if (!selectedSlot) return alert("Please select a time slot.");

    try {
      // Check if slot is already booked
  //     const res = await axios.post("http://localhost:5000/api/doctors/check-slot", {
  //       doctorId,
  // date: startDate.toISOString().split("T")[0], // YYYY-MM-DD
  //       slot: availableSlots.find(s => s.start === selectedSlot)
  //     });

  //     if (res.data.exists) {
  //       return alert("This slot is already reserved. Please select another slot.");
  //     }

      // Navigate to confirm/payment page
      navigate("/user/category/confirmappointment", {
        state: { 
          member: selectedMember, 
          slot: selectedSlot, 
          date: startDate, 
          doctorId, 
          amount: doctor?.consultationFee, 
          patient: selectedMember, 
          consultationType, 
          doctor, 
          mainUser 
        }
      });

      // Optionally, remove slot locally so user can't click again
      setAvailableSlots(prev => prev.filter(s => s.start !== selectedSlot));
      setSelectedSlot(null);
    } catch (err) {
      console.error("Slot check error:", err);
      alert("Failed to check slot availability. Please try again.");
    }
  }}
>
  Book slot
</Button>
            </div>

            <div ref={bottomRef} style={{ height: '100px' }} />
          </div>
        </Col>
      </Row>

      {showAddMember && (
        <>
          <div className='outerAddmember' style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000 }} />
          <div style={{ position: 'fixed', top: 50, left: 0, width: '100vw', height: '100vh', zIndex: 1001, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AddMemberForm onClose={() => setShowAddMember(false)} onAdd={handleAddMember} />
          </div>
        </>
      )}
    </Container>
  );
}
