import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import VirtualDoc from "../../assets/VirtualDoc.png";
import camera from "../../assets/icons/camera.svg";
import patient from "../../assets/patient.png";
import IconB from "../../assets/icons/IconB.svg";
import IconBOne from "../../assets/icons/IconBOne.svg";
import IconBTwo from "../../assets/icons/IconBTwo.svg";
import IconBThree from "../../assets/icons/IconBThree.svg";
import IconBFive from "../../assets/IconBFive.svg";
import mediaIcon from "../../assets/mediaicon.png";
import send from "../../assets/send.png";


const callIcons = [
  { iconurl: IconB },
  { iconurl: IconBOne },
  { iconurl: IconBTwo },
  { iconurl: IconBThree },
  { iconurl: IconBFive },
];

function VirtualAppointment() {
  const [showUpload, setShowUpload] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "doctor",
      name: "Jackob jone",
      text: "Hi Mahitha! How can I assist you today?",
    },
  ]);

  const handleClosePopup = () => {
    setShowUpload(!showUpload);
  };

  const handleSend = () => {
    if (userInput.trim() === "") return;
    setMessages([
      ...messages,
      {
        sender: "user",
        name: "Mahitha",
        text: userInput.trim(),
      },
    ]);
    setUserInput("");
  };

  return (
    <div className="container w-100 h-100  mt-5 d-flex align-items-center">
      {/* Doctor video section */}
      <div
        className={` ${styles.secContainer} position-relative d-flex flex-column align-items-center`}
        style={{ width: "3800px", height: "710px" }}
      >
        <img
          src={VirtualDoc}
          alt="docImage"
          className="h-full w-full"
          style={{ borderRadius: "28px", marginRight: "150px" }}
        />
        <div className="d-flex flex-column">
          <img src={camera} alt="" className="position-absolute top-10 right-28" />
          <img src={patient} alt="" className="position-absolute bottom-2.5 right-22" />
        </div>

        <div
          className="d-flex align-items-center justify-content-center gap-2"
          style={{
            height: "68px",
            width: "310px",
            borderRadius: "75px",
            padding: "11px",
            backgroundColor: "#ffffff6c",
            marginTop: "-80px",
          }}
        >
          {callIcons.map((icon, ind) => (
            <img src={icon.iconurl} alt="" key={ind} />
          ))}
        </div>
      </div>

      {/* Chat section */}
      <div
        style={{
          backgroundColor: "white",
          color: "white",
          height: "710px",
          width: "1000px",
          borderRadius: "30px",
          padding: "16px",
          position: "relative",
          marginRight: "-80px",
        }}
        className="border"
      >
        <div className="d-flex flex-column text-black mb-2">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2
                style={{
                  fontWeight: "700",
                  marginBottom: "0",
                  fontSize: "24px",
                  color: "#494949",
                }}
              >
                Jackob jone <span style={{ color: "limegreen" }}>●</span>
              </h2>
              <p style={{ color: "#8E8E8E", fontSize: "16px", fontWeight: "400" }}>
                MD. Physiotherapist
              </p>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="d-flex flex-column overflow-auto" style={{ maxHeight: "500px" }}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`d-flex flex-column ${
                msg.sender === "user" ? "align-items-end" : "align-items-start"
              }`}
            >
              <p
                style={{
                  fontWeight: "400",
                  fontSize: "14px",
                  color: "#494949",
                }}
              >
                {msg.name}
              </p>
              <div
                style={{
                  backgroundColor: "#f1f1f1",
                  color: msg.sender === "user" ? "#222" : "#494949",
                  borderRadius: "25px",
                  padding: "10px 20px",
                  maxWidth: "280px",
                  marginTop: "5px",
                  fontWeight: "400",
                  fontSize: "18px",
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input Area */}
        <div className="d-flex align-items-center justify-content-between position-absolute start-0 bottom-0 w-100 px-3 pb-3">
          <div
            className="d-flex align-items-center w-100"
            style={{
              backgroundColor: "#f8f8f8",
              borderRadius: "40px",
              padding: "8px 16px",
            }}
          >
            <button
              className="btn p-0 border-0 bg-transparent"
              style={{ marginRight: "10px" }}
              onClick={handleClosePopup}
            >
              <img src={mediaIcon} alt="Attach" style={{ width: "20px", height: "15px" }} />
            </button>
            <input
              type="text"
              placeholder="Type here..."
              className="form-control border-0 shadow-none"
              style={{
                backgroundColor: "transparent",
                color: "#555",
                fontSize: "16px",
                fontWeight: "400",
                outline: "none",
              }}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
            />
            <button
              className="btn d-flex align-items-center justify-content-center"
              onClick={handleSend}
              disabled={userInput.trim() === ""}
              style={{
                borderRadius: "50%",
                padding: "0",
                marginLeft: "0px",
                cursor: userInput.trim() === "" ? "not-allowed" : "pointer",
              }}
            >
              <img src={send} alt="Send" />
            </button>
          </div>
          {showUpload && <UploadPopup onClose={handleClosePopup} />}
        </div>
      </div>
    </div>
  );
}

// Embedded UploadPopup Component
const UploadPopup = ({ onClose }) => {
  const navigate = useNavigate();

  const handleReportsClick = (e) => {
    e.preventDefault();
    navigate("/reports");
  };

  return (
    <div
      className="position-absolute bottom-22 start-50 translate-middle-x d-flex flex-column align-items-center justify-content-center"
      style={{
        width: "280px",
        height: "120px",
        backgroundColor: "#e8fbf9",
        borderRadius: "28px",
        border: "2px dashed #00b4a8",
        zIndex: 1055,
      }}
    >
      <button
        className="btn-close position-absolute top-2 end-2"
        onClick={onClose}
        aria-label="Close"
      />
      <a href="#" className="text-decoration-none text-success mb-1">
        Drag and drop to upload file
      </a>
      <span className="text-black">Or</span>
      <a
        href="/reports"
        className="text-decoration-none text-success"
        onClick={handleReportsClick}
      >
        <span className="text-black">Share</span> My reports
      </a>
    </div>
  );
};

export default VirtualAppointment;
