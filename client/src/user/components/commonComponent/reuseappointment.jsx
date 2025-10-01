import React, { useState, useRef } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { BsFillTelephoneFill, BsChatDots } from "react-icons/bs";
import Profile from "../../assets/doctor.jpg"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Calender from "../../assets/calendar.svg";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import '../../components/css/Appointment.css'
const AppointmentPage = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState("09:30 am");
  const datePickerRef = useRef(null);
  const navigate = useNavigate();

  const timeSlots = [
    "08:30 am",
    "09:30 am",
    "10:00 am",
    "10:30 am",
    "11:00 am",
    "11:30 am",
    "12:30 pm",
  ];

  return (
    <Container
      fluid
      className="p-4"
      style={{ fontFamily: "Urbanist, sans-serif"}}
    >
      <Row className="align-items-start">
        {/* Left Column - Doctor Info */}
        <Col lg={4} className="pe-lg-5 mb-4 mb-lg-0" style={{width:'566px'}}>
          <div
            className="text-start"
            style={{
              padding: "0 16px 0 16px",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              marginTop:"80px",
              marginLeft:"40px"
            }}
          >
            <Link
            to="/category/cardiologist"
              className="text-decoration-none"
              style={{
                color: "#00A99D",
                fontWeight: "500",
                top: "120",
                height: "22",
                width: "88",
              }}
            >
              ← Doctors
            </Link>

            <div className="mb-3">
              <div className="d-flex justify-content-center mb-3">
                <img
                  src={Profile}
                  alt="Doctor"
                  className="rounded-circle"
                  height={100}
                />
              </div>
              <h5 className="mt-3 mb-0 fw-bold">
                Dr. Nithish Jagannatham{" "}
                <small className="fw-normal">MD, MBBS</small>
              </h5>
              <p className="text-muted mb-0">♡ Cardiologist</p>
              <div className="d-flex align-items-center gap-1 text-muted">
                <span style={{ color: "#FDCB02", fontSize: "16px" }}>★</span>
                <span>4.2 / 5</span>
              </div>
            </div>

            <div className="d-flex justify-content-between mb-3">
              <Button
                variant="outline"
                className="w-100 me-2"
                style={{
                  backgroundColor: "#EDFFFE",
                  color: "#00A99D",
                  borderRadius: "28px",
                  height: "72px",
                  width: "272px",
                }}
              >
                <BsFillTelephoneFill /> Call
              </Button>
            </div>

            <div>
              <h6 className="fw-medium">About</h6>
              <p className="text-muted small">
                Dr. Hayes is a board-certified cardiologist with over 15 years
                of experience in diagnosing and treating heart conditions.
              </p>

              <h6 className="fw-medium">Languages</h6>
              <p className="text-muted small">English, Hindi, Telugu</p>

              <h6 className="fw-medium">Areas of Expertise</h6>
              <div className="d-flex flex-wrap gap-2">
                {["General", "Cardiology", "Heart Failure", "Arrhythmias"].map(
                  (item) => (
                    <span
                      key={item}
                      className="badge bg-light text-dark  rounded-pill"
                      style={{
                        width: "81px",
                        height: "37px",
                        fontWeight: 400,
                        paddingTop: "10px",
                      }}
                    >
                      {item}
                    </span>
                  )
                )}
              </div>

              <h6 className="fw-medium mt-3">Certifications</h6>
              <p className="text-muted small">Board Certified in Cardiology</p>

              <h6 className="fw-medium">Education & Training</h6>
              <p className="text-muted small mb-1">
                Medical School: University of California, Los Angeles
              </p>
              <p className="text-muted small">Residency: City Hospital</p>
            </div>

            <div>
              <h6 className="fw-medium mt-3 mb-2">Reviews</h6>
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="border-bottom pb-3 mb-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-2">
                      <img
                        src={`https://i.pravatar.cc/30?img=${index + 1}`}
                        alt="avatar"
                        className="rounded-circle"
                        width={30}
                        height={30}
                      />
                      <strong className="small">Radha Andhira</strong>
                    </div>
                    <small className="text-muted">9 October 2024</small>
                  </div>
                  <div className="d-flex gap-1 mt-1 mb-1 text-warning small">
                    {"★".repeat(3)}
                    {"☆"}
                  </div>
                  <p className="text-muted small mb-0">
                    I was very satisfied with my consultation. The doctor
                    explained everything clearly and offered effective treatment
                    recommendations.
                  </p>
                  <a
                    href="#"
                    className="text-decoration-none small "
                    style={{ color: "#00A99D" }}
                  >
                    See More
                  </a>
                </div>
              ))}
            </div>
          </div>
        </Col>

        {/* Right Column - Booking */}
        <Col lg={8}>
          <div
            className="mx-auto"
            style={{
              maxWidth: 600,
              height: 604.5,
              position: "fixed",
              gap: "24px",
              left: "702px",
              top: "158px", //given 158px
            }}
          >
            <h5 className="fw-medium mb-3">Book Appointment</h5>

            <div className="mb-3">
              {[1, 2].map((_, idx) => (
                <div
                  key={idx}
                  className="d-flex justify-content-between align-items-center p-3 rounded-pill mb-3 border"
                >
                  <div>
                    <div className="fw-medium">Manoj malhotrea</div>
                    <div className="text-muted small">
                      Age - 21 | Sex - Male
                    </div>
                  </div>
                  <Form.Check
                    type="radio"
                    name="patient"
                    defaultChecked={idx === 1}
                    style={{ borderColor: "#00A99D" }}
                  />
                </div>
              ))}
              <a href="#" style={{ color: "#00A99D", fontSize: "0.9rem" }}>
                Add dependent
              </a>
            </div>

            <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap">
              <div className="d-flex gap-3">
                {[...Array(7)].map((_, i) => {
                  const isWednesday = i === 2;
                  return (
                    <div
                      key={i}
                      className="text-center rounded"
                      style={{
                        width: 40,
                        backgroundColor: isWednesday
                          ? "#00A99D"
                          : "transparent",
                        color: isWednesday ? "#fff" : "#000",
                        padding: "6px 5px",
                      }}
                    >
                      <div>
                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                      </div>
                      <div>{i + 1}</div>
                    </div>
                  );
                })}
              </div>
              <div className="d-flex flex-column align-items-center gap-0 text-muted  mt-2 mt-sm-0">
                <img
                  src={Calender}
                  alt="calendar"
                  style={{ width: 32, height: 32, cursor: "pointer" }}
                  onClick={() => datePickerRef.current.setOpen(true)}
                />
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#252525",
                    top:457,
                    
                  }}
                >
                  {startDate.toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>

                <DatePicker
                  ref={datePickerRef}
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  minDate={new Date()}
                  popperPlacement="bottom-start"
                  popperClassName="custom-datepicker-popper"
                  calendarClassName="calendar-wrapper"
                  showPopperArrow={false}
                  customInput={
                    <div
                      style={{
                        cursor: "pointer",
                        color: "#333",
                        minWidth: 100,
                        display: "none",
                      }}
                      onClick={() => datePickerRef.current.setOpen(true)}
                    >
                      {startDate.toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                  }
                />
              </div>
            </div>

            <div className="d-flex flex-wrap gap-3 mb-3">
              {timeSlots.map((slot) => (
                <div
                  key={slot}
                  className="px-3 py-2 rounded-pill"
                  style={{
                    backgroundColor:
                      selectedSlot === slot ? "#00A99D" : "#F0F0F0",
                    color: selectedSlot === slot ? "white" : "black",
                    cursor: "pointer",
                  }}
                  onClick={() => setSelectedSlot(slot)}
                >
                  {slot}
                </div>
              ))}
            </div>

            <div className="d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center gap-2 mb-3">
              <div
                className="d-flex align-items-center gap-2 px-3 py-2 border rounded-pill w-100"
                style={{ color: "#00A99D", border: "1px solid #00A99D" }}
              >
                <span>
                  {startDate.toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <div
                  style={{ width: 1, height: 20, backgroundColor: "#00A99D" }}
                ></div>
                <span>{selectedSlot}</span>
              </div>

              <Button
                style={{
                  backgroundColor: "#00A99D",
                  borderColor: "#00A99D",
                  borderRadius: 999,
                  padding: "6px 16px",
                  minWidth: 102,
                }}
                onClick={() => navigate("/confirmappointment")}
              >
                Book slot
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default AppointmentPage;
