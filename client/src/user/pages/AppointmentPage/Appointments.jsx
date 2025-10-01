import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Dp2 from "../../assets/icons/profile.png";
import stethoscope from "../../assets/icons/stethoscope.png";
import walkingIcon from "../../assets/walking_icon.svg";
import videoIcon from "../../assets/confirmappointmenticons/video.svg";
import calendarIcon from "../../assets/icons/calendar.png";
import styles from "../AppointmentPage/Appointments.module.css";
import profile from "../../assets/icons/profile.png";

const Appointments = () => {
  const [activeTab, setActiveTab] = useState("virtual");
  const [showPopup, setShowPopup] = useState(false);
  const [cancelTarget, setCancelTarget] = useState(null);
  const navigate = useNavigate();

  const handleCancelClick = (cardId) => {
    setCancelTarget(cardId);
    setShowPopup(true);
  };

  const confirmCancel = () => {
    setShowPopup(false);
    alert(`Appointment ${cancelTarget} cancelled!`);
  };

  const renderCard = (status, isPast = false, id) => {
    const isCancelled = status === "cancelled";
    const isJoined = status === "joined";
    const isDisabled = status === "disabled";

    return (
      <div className="col-md-4 mb-3 mt-3" key={id}>
        <div
          className={`${styles.secWrapper} p-3 border h-100`}
          style={{
            borderRadius: "18px",
            borderColor: "#F7F7F7",
            minHeight: "190px",
          }}
        >
          <div style={{ opacity: isCancelled ? 0.5 : 1 }}>
            {/* Doctor Info */}
            <div
              className="d-flex justify-content-between align-items-center mb-2 "
              style={{ fontSize: "18px" }}
            >
              <div>
                <div className="fw-bold">Dr. Jacob Jone</div>
                <div
                  className="d-flex align-items-center"
                  style={{ fontSize: "14px", color: "#888" }}
                >
                  <img
                    src={stethoscope}
                    alt="stethoscope"
                    width={14}
                    className="me-1"
                  />
                  MD. Physiotherapist
                </div>
              </div>
              <div
                className={` h-[50px] w-[55px] sm:h-[45px] xl:h-[55px] rounded-full flex items-center justify-center bg-[#F7F7F7]`}
              >
                <img src={profile} alt="" className="h-[32px] w-[32px]" />
              </div>
            </div>

            {/* Consultation Type */}
            <div
              className="d-flex align-items-center mb-2"
              style={{ fontSize: "0.9rem", color: "#666" }}
            >
              <img
                src={videoIcon}
                alt="video"
                width={20}
                className="me-2"
                style={{
                  filter: activeTab === "virtual" ? "invert(1)" : "invert(0)",
                }}
              />
              Virtual consultation
            </div>

            {/* Date */}
            <div
              className="d-flex align-items-center mb-3"
              style={{ fontSize: "0.9rem", color: "#666" }}
            >
              <img
                src={calendarIcon}
                alt="calendar"
                width={16}
                className="me-2"
              />
              Today 10:20 am | 26 July 2025
            </div>
          </div>

          {/* Buttons */}
          {isPast ? (
            <div className="d-flex justify-content-end">
              <button
                className="btn"
                style={{
                  backgroundColor: "#00a9a4",
                  color: "#fff",
                  border: "none",
                  borderRadius: "28px",
                }}
              >
                Reschedule
              </button>
            </div>
          ) : isCancelled ? (
            <div className="text-end">
              <span style={{ color: "#f70820ff", marginRight: "15px" }}>
                Cancelled
              </span>
            </div>
          ) : (
            <div className="d-flex justify-content-end gap-4">
              <button
                className="btn text-muted p-0"
                onClick={() => handleCancelClick(id)}
              >
                Cancel
              </button>
              <button
                className="btn"
                style={{
                  backgroundColor: isDisabled ? "#8E8E8E" : "#00a9a4",
                  color: "#fff",
                  border: "none",
                  padding: "6px 16px",
                  borderRadius: "28px",
                }}
                disabled={!isJoined}
                onClick={() => navigate("/user/virtual-appointment")}
              >
                Join
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className={`${styles.mainContainer} d-flex`}>
        <div className="flex-grow-1 px-3">
          <h5 className={`${styles.headerOne}  mb-3`} style={{ fontSize: "24px" }}>
            Upcoming appointments
          </h5>

         {/* Toggle Buttons */}
<div
  className={`${styles.btnContainer} d-inline-flex flex-row mb-4 p-1`} // force flex-row
  style={{
    border: "1px solid #00A99D",
    borderRadius: "28px",
    backgroundColor: "#fff",
  }}
>
  <button
    className={`btn d-flex align-items-center rounded-pill px-3 py-2 ${
      activeTab === "virtual" ? "text-white" : "text-dark"
    } ${styles.toggleBtn}`}   // added toggleBtn class
    style={{
      backgroundColor: activeTab === "virtual" ? "#00a9a4" : "#fff",
      border: "none",
    }}
    onClick={() => setActiveTab("virtual")}
  >
    <img
      src={videoIcon}
      alt="video"
      width={20}
      className="me-2"
      style={{
        filter: activeTab === "virtual" ? "invert(1)" : "invert(0)",
      }}
    />
    Virtual Consultant
  </button>

  <button
    className={`btn d-flex align-items-center rounded-pill px-3 py-2 ${
      activeTab === "clinic" ? "text-white" : "text-dark"
    } ${styles.toggleBtn}`}  // added toggleBtn class
    style={{
      backgroundColor: activeTab === "clinic" ? "#00a9a4" : "#fff",
      border: "none",
    }}
    onClick={() => setActiveTab("clinic")}
  >
    <img
      src={walkingIcon}
      alt="walk"
      width={20}
      className="me-2"
      style={{
        filter: activeTab === "clinic" ? "invert(1)" : "invert(0)",
      }}
    />
    Clinic visit
  </button>
</div>


          {/* Upcoming Cards */}
          <div className={`${styles.rowContainer}  row `}>
            {renderCard("joined", false, 1)}
            {renderCard("disabled", false, 2)}
            {renderCard("cancelled", false, 3)}
          </div>

          {/* Previous Appointments */}
          <h5 className="mb-4 mt-4" style={{ fontSize: "24px" }}>
            Previous appointments
          </h5>
          <div className="row">
            {renderCard("reschedule", true, 4)}
            {renderCard("reschedule", true, 5)}
            {renderCard("reschedule", true, 6)}
          </div>
        </div>
      </div>

      {/* Popup Confirmation Modal */}
      {showPopup && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 1050 }}
        >
          <div
            className="bg-white p-4 rounded shadow position-relative"
            style={{ width: "450px", height: "250px", textAlign: "center" }}
          >
            <button
              onClick={() => setShowPopup(false)}
              style={{
                position: "absolute",
                top: "0px",
                right: "20px",
                border: "none",
                fontSize: "30px",
                color: "#252525",
                cursor: "pointer",
                background: "transparent",
              }}
              aria-label="Close"
            >
              &times;
            </button>

            <h4 className="mb-4 mt-4 fw-bold">Cancel Appointment</h4>
            <p>Are you sure you want to cancel this appointment?</p>

            <div className="d-flex justify-content-center gap-3 mt-4">
              <button
                className="btn"
                style={{
                  border: "2px solid #00A99D",
                  backgroundColor: "transparent",
                  color: "#00A99D",
                  borderRadius: "28px",
                }}
                onClick={() => setShowPopup(false)}
              >
                No, keep appointment
              </button>

              <button
                className="btn btn-danger"
                style={{ borderRadius: "28px" }}
                onClick={confirmCancel}
              >
                Yes, cancel appointment
              </button>
            </div>
          </div>
          <Outlet />
        </div>
      )}
    </>
  );
};

export default Appointments;
