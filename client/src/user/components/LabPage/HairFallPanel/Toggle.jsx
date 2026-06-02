import React, { useState } from "react";
import About from "../../../assets/panel/About.png";
import TestTube from "../../../assets/panel/Test Tube.svg"
import Message from "../../../assets/panel/message-question.svg";
import Health from "../../../assets/panel/Health.svg"

export default function TestTabs() {
  const [activeTab, setActiveTab] = useState("about");

  const tabs = [
    { key: "about", label: "About the test", icon: About, target: "about" },
    { key: "process", label: "Test Process", icon: TestTube, target: "process" },
    { key: "faq", label: "FAQs", icon: Message, target: "faq" },
    { key: "similar", label: "Similar health Package", icon: Health, target: "similar" },
  ];

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <style>
        {`
          /* Mobile only: add horizontal scroll */
          @media (max-width: 768px) {
            .test-tabs-container {
              width: 100% !important;
              margin-left: 0 !important;
              overflow-x: auto;
              white-space: nowrap;
              scrollbar-width: thin;
              scrollbar-color: #00A99D transparent;
              margin-top:120px !important
            }
            .test-tabs-container::-webkit-scrollbar {
              height: 6px;
            }
            .test-tabs-container::-webkit-scrollbar-thumb {
              background: #00A99D;
              border-radius: 999px;
            }
            .test-tabs-container::-webkit-scrollbar-track {
              background: transparent;
            }
            .test-tab-item {
              flex: 0 0 auto;
            }
          }
        `}
      </style>

      <div
        className="d-flex justify-content-between test-tabs-container"
        style={{
          width: "1007px",
          marginLeft: "400px",
          fontFamily: "'Urbanist', sans-serif",
          borderRadius: "999px",
          backgroundColor: "#fff",
          padding: "8px",
          border: "1px solid #00A99D",
          marginBottom: "50px",
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <div
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                scrollToSection(tab.target);
              }}
              className="d-flex align-items-center justify-content-center test-tab-item"
              style={{
                flex: 1,
                padding: "10px 16px",
                borderRadius: "999px",
                cursor: "pointer",
                color: isActive ? "#fff" : "#333",
                backgroundColor: isActive ? "#00A99D" : "transparent",
                fontWeight: isActive ? 500 : 400,
                transition: "all 0.3s ease",
                gap: "8px",
                fontSize: "18px",
              }}
            >
              <img
                src={tab.icon}
                alt={tab.label}
                style={{
                  width: "24px",
                  height: "24px",
                  filter: isActive ? "brightness(0) invert(1)" : "none",
                }}
              />
              {tab.label}
            </div>
          );
        })}
      </div>
    </>
  );
}
