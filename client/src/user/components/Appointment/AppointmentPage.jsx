import React, { useState, useRef, useEffect } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { BsFillTelephoneFill, BsChatDots } from "react-icons/bs";
import Profile from "../../assets/confirmappointmenticons/doctor.jpg"
import Call from "../../assets/confirmappointmenticons/call.svg"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Calender from "../../assets/calendar.svg";
import { useNavigate,useLocation } from "react-router-dom";
    import axios from 'axios';
// import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
// import '../../components/Appointment/AppointmentPage.css';
import AddMemberForm from "../addmemberform/AddMemberForm";
import Arrowleft from "../../assets/confirmappointmenticons/arrow-left.svg";
import { API_BASE_URL } from "../../../api-config";

export default function AppointmentPage() {
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [selectedSlot, setSelectedSlot] = useState("09:30 am");
  const datePickerRef = useRef(null);
  const [showAddMember, setShowAddMember] = useState(false);
  const navigate = useNavigate();
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const scrollTargetRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1020);
  const [doctor, setDoctor] = useState(null);

  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1020);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const location = useLocation();
  const doctorId = location.state?.doctorId;
 useEffect(() => {
    if (doctorId) {
      const fetchDoctor = async () => {
        try {
          const res = await axios.get(`${API_BASE_URL}/api/doctors/${doctorId}`);
          setDoctor(res.data);
        } catch (err) {
          console.error("Error fetching doctor:", err);
        }
      };
      fetchDoctor();
    }
  }, [doctorId]);
  const timeSlots = [
    "08:30 am",
    "09:30 am",
    "10:00 am",
    "10:30 am",
    "11:00 am",
    "11:30 am",
    "12:30 pm",
  ];

  
  const dateToIndex = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const diff = Math.round((d - today) / 86400000); 
    return diff >= 0 && diff < 7 ? diff : null;
  };

 
  const handleDateChange = (date) => {
    if (!date) return;
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    setStartDate(normalized);
    const idx = dateToIndex(normalized);
    setSelectedDateIndex(idx === null ? null : idx);
  };

  const handleCalendarClick = () => {
    if (datePickerRef.current) datePickerRef.current.setOpen(true);

    setTimeout(() => {
      window.scrollBy({ top: -120, behavior: "smooth" });
    }, 120);
  };

  const buildWeekDays = () => {
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const weekDays = buildWeekDays();

  return (
    <Container
      fluid
      className="p-4 doctor-details-container main-container"
      style={{ fontFamily: "Urbanist, sans-serif" }}
    >
      <Row className="doctor-info">
        <Col xs={12} lg={4} className="pe-lg-5 mb-4 mb-lg-0 doctor-details">
          <div
            className="colInsideContainer md:ml-[0%]"
            style={{ padding: "0 16px",width: "100%",  display: "flex", flexDirection: "column", gap: "24px", marginTop: "80px", marginLeft: "40px" }}
          >
                      <button
                        onClick={() => navigate(-1)}
                        className="btn btn-link d-flex align-items-lg-center text-decoration-none mb-3 d-inline-block book-btn"
                        style={{
                          color: "#00A99D",
                          fontWeight: "500",
                          fontSize: "18px",
                          paddingTop: "10px",
                          marginLeft:"0px"
                        }}
                      >
                        <img
                          src={Arrowleft}
                          alt="Back"
                          style={{
                            width: "24px",
                            height: "24px",
                            marginRight: "8px",
                            verticalAlign: "middle",
                          }}
                        />
                        Doctors
                      </button>
                          
                          {/* Doctor Profile Header */}
<div className="mb-3 doctor-img-data w-100 ">
  <div className="d-flex justify-content-center w-100 bottom-2 mb-3">
  <img 
    src={doctor?.profileImage || Profile} 
    alt={`Dr. ${doctor?.name}`} 
    className="rounded-circle appointment-image" 
    style={{ 
      height: '120px', 
      width: '120px', 
      objectFit: 'cover' 
    }} 
  />
</div>
  <div className="doctor-data d-flex flex-column gap-2">
    {/* DYNAMIC: Doctor's name and education */}
    <h5 className="mt-3 mb-0 fw-bold text-[22px] ">{doctor?.name} <small className="fw-medium text-[18px]">{doctor?.education}</small></h5>
    {/* DYNAMIC: Doctor's speciality */}
    <p className="text-muted fw-medium text-[18px] mb-0">♡ {doctor?.speciality}</p>
    {/* DYNAMIC: Doctor's average rating */}
    <div className="d-flex align-items-center fw-medium text-[18px] gap-1 text-muted"><span style={{ color: "#FDCB02", fontSize: "16px" }}>★</span><span>{doctor?.averageRating} / 5</span></div>
  </div>
</div>

{/* Call Button (Static) */}
<div className="d-flex w-100 justify-content-between mb-3 button-group-mobile">
  <Button variant="outline" className="w-100 fw-normal text-[18px] call-btn" style={{ backgroundColor: "#EDFFFE", color: "#00A99D", borderRadius: "28px", height: "72px", width: "272px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
    <img src={Call} alt="call" className="h-8 w-8 text-[18px]" /> <span className="fw-normal text-[20px]">Call</span>
  </Button>
</div>

{/* Detailed Information Section */}
<div className="heading w-100">
  {/* DYNAMIC: About section */}
  <h6 className="fw-bold w-100" style={{fontSize:"18px", fontWeight:"bold"}}>About</h6>
  <p className="text-muted small w-100" style={{fontSize:"17px", fontWeight:"normal"}}>{doctor?.about}</p>

  {/* DYNAMIC: Languages spoken */}
  <h6 className="fw-bold" style={{fontSize:"18px", fontWeight:"normal"}}>Languages</h6>
  <p className="text-muted small" style={{fontSize:"17px", fontWeight:"normal"}}>{doctor?.languages?.join(', ')}</p>

  {/* DYNAMIC: Areas of Expertise, split from a string */}
  <h6 className="fw-bold" style={{fontSize:"18px", fontWeight:"normal"}}>Areas of Expertise</h6>
  <div className="d-flex flex-wrap gap-3"style={{fontSize:"18px", fontWeight:"normal"}}> 
    {doctor?.areaOfInterest?.split(',').map(item => (
      <span key={item} className="badge bg-light text-dark rounded-pill" style={{ width: 'auto', padding: '10px 15px', height: '37px', fontWeight: 400 }}>{item}</span>
    ))}
  </div>
{/* DYNAMIC: Displaying a filtered list of certificate links */}
{/* <h6 className="fw-bold mt-3" style={{fontSize:"18px", fontWeight:"normal"}}>Certifications</h6>
<div>
  {doctor?.medicalCertificates
    ?.filter(cert => cert.type !== 'Medical License')
    .map((cert) => (
      <p key={cert._id} className="text-muted small mb-1" style={{fontSize:"17px", fontWeight:"normal"}}>
        <a 
          href={cert.fileUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ color: '#00A99D' }}
        >
          View {cert.type}
        </a>
      </p>
  ))}
</div> */}
  {/* STATIC: Kept as is, since no 'certifications' field exists in the data
  <h6 className="fw-bold mt-3" style={{fontSize:"18px", fontWeight:"normal"}}>Certifications</h6>
  <p className="text-muted small" style={{fontSize:"17px", fontWeight:"normal"}}>Board Certified in Cardiology</p> */}

  {/* DYNAMIC: Education details */}
  <h6 className="fw-bold" style={{fontSize:"18px", fontWeight:"normal"}}>Education & Training</h6>
  <p className="text-muted small mb-1" style={{fontSize:"17px", fontWeight:"normal"}}>
    Degree: {doctor?.education} from {doctor?.university}
  </p>
  <p className="text-muted small" style={{fontSize:"17px", fontWeight:"normal"}}>
    Works at: {doctor?.hospitalName}
  </p>
</div>

{/* Dynamic Reviews Section */}
<div className="heading-reviews">
  <h6 className="fw-bold mt-3 mb-2" style={{fontSize:"18px", fontWeight:"normal"}}>Reviews</h6>
  <div className="review-Container pl-0 pb-2 d-flex gap-3 justify-content-between">
    <input type="text" placeholder="Write review" className="border rounded-5 p-2 w-100" />
    <button className="btn border rounded-5" style={{backgroundColor: "#8E8E8E", color:'white'}} >Post</button>
  </div>
  
  {/* Logic handles the empty 'reviews' array correctly */}
  {doctor?.reviews && doctor?.reviews.length > 0 ? (
    doctor?.reviews.map((review, index) => (
      <div key={review._id || index} className="border-bottom pb-3 mb-3">
        {/* Review content would go here */}
      </div>
    ))
  ) : (
    <p className="text-muted small">No reviews yet.</p>
  )}
</div>
            {/* <div className="mb-3 doctor-img-data w-100 ">
              <div className="d-flex justify-content-center w-100  bottom-2 mb-3">
                <img src={Profile} alt="Doctor" className="rounded-circle appointment-image" height={100} />
              </div>
              <div className="doctor-data d-flex flex-column gap-2">
                <h5 className="mt-3 mb-0 fw-bold text-[22px] ">Dr. Nithish Jagannatham <small className="fw-medium text-[18px]">MD, MBBS</small></h5>
                <p className="text-muted fw-medium text-[18px] mb-0">♡ Cardiologist</p>
                <div className="d-flex align-items-center fw-medium text-[18px] gap-1 text-muted"><span style={{ color: "#FDCB02", fontSize: "16px" }}>★</span><span>4.2 / 5</span></div>
              </div>
            </div>

            <div className="d-flex w-100 justify-content-between mb-3 button-group-mobile">
              <Button variant="outline" className="w-100 fw-normal text-[18px] call-btn" style={{ backgroundColor: "#EDFFFE", color: "#00A99D", borderRadius: "28px", height: "72px", width: "272px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                <img src={Call} alt="call" className="h-8 w-8 text-[18px]" /> <span className="fw-normal text-[20px]">Call</span>
              </Button>

            </div>

            <div className="heading w-100">
              <h6 className="fw-bold w-100" style={{fontSize:"18px", fontWeight:"bold"}}>About</h6>
              <p className="text-muted small w-100" style={{fontSize:"17px", fontWeight:"normal"}}>Dr. Hayes is a board-certified cardiologist with over 15 years of experience in diagnosing and treating heart conditions.</p>

              <h6 className="fw-bold" style={{fontSize:"18px", fontWeight:"normal"}}>Languages</h6>
              <p className="text-muted small" style={{fontSize:"17px", fontWeight:"normal"}}>English, Hindi, Telugu</p>

              <h6 className="fw-bold" style={{fontSize:"18px", fontWeight:"normal"}}>Areas of Expertise</h6>
              <div className="d-flex flex-wrap gap-3"style={{fontSize:"18px", fontWeight:"normal"}}> 
                {['General','Cardiology','Heart Failure','Arrhythmias'].map(item => (
                  <span key={item} className="badge bg-light text-dark rounded-pill" style={{ width: '81px', height: '37px', fontWeight: 400, paddingTop: '10px' }}>{item}</span>
                ))}
              </div>

              <h6 className="fw-bold mt-3" style={{fontSize:"18px", fontWeight:"normal"}}>Certifications</h6>
              <p className="text-muted small" style={{fontSize:"17px", fontWeight:"normal"}}>Board Certified in Cardiology</p>

              <h6 className="fw-bold" style={{fontSize:"18px", fontWeight:"normal"}}>Education & Training</h6>
              <p className="text-muted small mb-1" style={{fontSize:"17px", fontWeight:"normal"}}>Medical School: University of California, Los Angeles</p>
              <p className="text-muted small" style={{fontSize:"17px", fontWeight:"normal"}}>Residency: City Hospital</p>
            </div>

            <div className="heading-reviews">
              <h6 className="fw-bold mt-3 mb-2" style={{fontSize:"18px", fontWeight:"normal"}}>Reviews</h6>
              <div className="review-Container pl-0 pb-2 d-flex gap-3 justify-content-between">
                <input type="text" placeholder="Write review" className="border rounded-5 p-2 w-100" />
                <button className="btn border rounded-5" style={{backgroundColor: "#8E8E8E", color:'white'}} >Post</button>
              </div>

              {[1,2,3].map((_, index) => (
                <div key={index} className="border-bottom pb-3 mb-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-2">
                      <img src={`https://i.pravatar.cc/30?img=${index+1}`} alt="avatar" className="rounded-circle" width={30} height={30} />
                      <strong className="small">Radha Andhira</strong>
                    </div>
                    <small className="text-muted">9 October 2024</small>
                  </div>
                  <div className="d-flex gap-1 mt-1 mb-1 text-warning small">{"★".repeat(3)}{"☆"}</div>
                  <p className="text-muted small mb-0" style={{fontSize:"16px", fontWeight:"normal"}}>I was very satisfied with my consultation. The doctor explained everything clearly and offered effective treatment recommendations.</p>
                  <a href="#" className="text-decoration-none small" style={{ color: '#00A99D' }}>See More</a>
                </div>
              ))}
            </div> */}
          </div>
        </Col>

          <Col xs={12} lg={8} className="appointment-section"
            style={{display:"flex", alignItems: "center", justifyContent:"center"}}
          >
            <div
              ref={scrollTargetRef}
              className="appointment-div mx-auto fixed lg:static md-w-[400px] sm:w-[100%] lg:w-[600px]"
              style={{
                
                height: 604.5,
                position: isMobile ? "static" : "fixed",
                top: isMobile ? "auto" : "60px",
                gap: "24px",
              }}
            >
              <h5 className="fw-medium mb-3">Book Appointment</h5>

              <div className="mb-3">
                {[1,2].map((_, idx) => (
                  <div key={idx} className="d-flex justify-content-between align-items-center p-3 rounded-pill mb-3 border dependent">
                    <div>
                      <div className="fw-medium">Manoj malhotrea</div>
                      <div className="text-muted small">Age - 21 | Sex - Male</div>
                    </div>
                    <Form.Check type="radio" name="patient" defaultChecked={idx === 0} />
                  </div>
                ))}
                <a href="#" onClick={(e) => { e.preventDefault(); setShowAddMember(true); }} style={{ color: '#00A99D', fontSize: '0.9rem' }}>Add dependent</a>
              </div>
              <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap calendar-days-container">
                {isMobile ? (
                  <>
                    <div className="d-flex flex-column align-items-center gap-0 text-muted mt-0">
                      <img src={Calender} alt="calendar" style={{ width: 18, height: 18, cursor: 'pointer' }} onClick={handleCalendarClick} />
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
                        popperModifiers={[
                          { name: 'offset', options: { offset: [0, -10] } },
                          { name: 'preventOverflow', options: { altAxis: true } },
                        ]}
                        customInput={<div style={{ display: 'none' }} />}
                      />
                    </div>

                    <div className="d-flex gap-2">
                      {weekDays.map((day, i) => {
                        const isSelected = day.toDateString() === startDate.toDateString();
                        return (
                          <div key={i} className="text-center rounded" style={{ width: 40, backgroundColor: isSelected ? '#00A99D' : 'transparent', color: isSelected ? '#fff' : '#000', padding: '6px 0px', cursor: 'pointer' }} onClick={() => handleDateChange(day)}>
                            <div>{["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][day.getDay()]}</div>
                            <div>{day.getDate()}</div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="d-flex gap-3">
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
                        popperModifiers={[
                          { name: 'offset', options: { offset: [0, -10] } },
                          { name: 'preventOverflow', options: { altAxis: true } },
                        ]}
                        customInput={<div style={{ display: 'none' }} />}
                      />
                    </div>
                  </>
                )}
              </div>
              <div className="d-flex flex-wrap gap-3 mb-3 slot-section">
                {timeSlots.map((slot) => (
                  <div key={slot} className="px-3 py-2 rounded-pill slot-time" style={{ backgroundColor: selectedSlot === slot ? '#00A99D' : '#F0F0F0', color: selectedSlot === slot ? 'white' : 'black', cursor: 'pointer' }} onClick={() => setSelectedSlot(slot)}>
                    {slot}
                  </div>
                ))}
              </div>

              <div className="d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center gap-2 mb-3 book-button">
                <div className="d-flex align-items-center gap-2 px-3 py-2 border rounded-pill w-100 book-time" style={{ color: '#00A99D', border: '1px solid #00A99D' }}>
                  <span>{startDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  <div style={{ width: 1, height: 20, backgroundColor: '#00A99D' }} />
                  <span>{selectedSlot}</span>
                </div>

                <Button style={{ backgroundColor: '#00A99D', borderColor: '#00A99D', borderRadius: 999, padding: '6px 16px', minWidth: 102 }} onClick={() => navigate('/user/category/confirmappointment')}>
                  Book slot
                </Button>
              </div>
            </div>

            <div ref={scrollTargetRef} style={{ height: '100px' }} />
          </Col>
        </Row>

      {showAddMember && (
        <>
          <div className='outerAddmember' style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000 }} />
          <div style={{ position: 'fixed', top: 50, left: 0, width: '100vw', height: '100vh', zIndex: 1001, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AddMemberForm onClose={() => setShowAddMember(false)} />
          </div>
        </>
      )}
    </Container>
  );
}
