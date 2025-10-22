import React from 'react'
import { Container, Row, Col, Badge } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Pill from "../../assets/icons/paracetamol.png";
import Treat from "../../assets/icons/treat.svg";
import styles from '../../components/Medications/Medication.module.css'
import { useEffect } from 'react';
import { useState } from 'react';

function Medication() {
          const timeSlots = [
    {
      title: "Morning",
      meds: [
        { status: "missed", name: "Paracetamol 325 mg" },
        { status: "completed", name: "Paracetamol 325 mg" },
        {
          status: "upcoming",
          time: "9:20 am, Today",
          name: "Paracetamol 325 mg",
        },
        { status: "completed", name: "Paracetamol 325 mg" },
      ],
    },
    {
      title: "Afternoon",
      meds: [
        { status: "missed", name: "Paracetamol 325 mg" },
        { status: "completed", name: "Paracetamol 325 mg" },
        { status: "completed", name: "Paracetamol 325 mg" },
      ],
    },
    {
      title: "Night",
      meds: [
        { status: "missed", name: "Paracetamol 325 mg" },
        { status: "completed", name: "Paracetamol 325 mg" },
        { status: "completed", name: "Paracetamol 325 mg" },
      ],
    },
  ];

  const getStatusBadge = (status, time) => {
  const baseStyle = {
    borderRadius: "0 24px 0 32px",
    fontSize: "14px",
    fontWeight: "400px",
    color: "white",
    padding:"2px 0px 2px 0px",
    position: "absolute",
    top: 0,
    right: 0,
    width: "128px",
    height: "24px",
    zIndex: 1,
    textAlign: "center",
  };

  if (status === "missed") {
    return (
      <div
        style={{
          ...baseStyle,
          backgroundColor: "#E23F3F",
        }}
      >
        Missed
      </div>
    );
  }

 
   
  if (status === "completed") {
    return (
      <div
        style={{
          ...baseStyle,
          backgroundColor: "#57AC57",
        }}
      >
        Completed ✓
      </div>
    );
  }

  if (status === "upcoming") {
    return (
      <div
        style={{
          ...baseStyle,
          backgroundColor: "#E23F3F",
        }}
      >
        {time}
      </div>
    );
  }
};

 const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  
    useEffect(() => {
  
      const handleResize = () => {
        const mobile = window.innerWidth < 992;
        setIsMobile(mobile);
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);
  
    useEffect(() => {
      const mobile = window.innerWidth < 992;
      setIsMobile(mobile);
      //setIsOpen(!mobile);
    }, []);


  return (
    <Container
      // style={{
      //   marginLeft: isMobile ? "10px" : "100px",
      //   // marginTop: "53px",
      //   overflowX: "hidden",
      //   width: "calc(100%)",
      //   backgroundColor: "#ffffff",
      //   minHeight: "100vh",
      // }}
      style={{
        fontFamily: "Urbanist, sans-serif",
        // marginTop: "120px",
        paddingTop:"115px",
        marginLeft: "335px",
        maxWidth: "1108px",
           marginLeft: isMobile ? "10px" : "100px",
      //   // marginTop: "53px",
      //   overflowX: "hidden",
      //   width: "calc(100%)",
      //   backgroundColor: "#ffffff",
      //   minHeight: "100vh",
  //      display: "flex",
  //  flexDirection: "column",
  //  alignItems: "center",
  //   position: "relative",
  //   marginBottom: "0.5rem ",
  //   paddingTop: "110px" 
      }}

      // className={`${styles.mainContainer}`}
    >

      <h1 style={{ fontSize: "31px", fontWeight: 500, color: "#252525" }}
          className={`${styles.firstHeader}`}>
        Medications
        
      </h1>

     <div className={`${styles.bottomContainer}`}>
       {timeSlots.map((slot) => (
        <div key={slot.title} className="mt-4">
          <h5
            style={{
              fontWeight: 500,
              color: "#494949",
              fontSize: "20px",
              marginBottom: "12px",
              width:"100%"
            }}
          >
            {slot.title}
          </h5>
          <Row className={`${styles.rowContainer}  gx-4 gy-4`}>
            {slot.meds.map((med, idx) => (
              <Col key={idx}  className={`${styles.coloumns}`} >
                <div
                  style={{
                    position: "relative",
                    backgroundColor: "#fff",
                    borderRadius: "18px",
                    width: "350px",
                    height: "88px",
                    padding: "10px 12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    border: "1px solid #dee2e6",
                  }}
                >
                  {/* Icon inside light rounded square */}
                  <div
                    style={{
                      borderRadius: "12px",
                      padding: "16px",
                      width: "56px",
                      height: "55px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#EDFFFE",
                      top: "17px",
                    }}
                  >
                    <img
                      src={Pill}
                      alt="pill"
                      style={{ width: "24px", height: "24px" }}
                    />
                  </div>

                  {/* Text block */}
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: "18px",
                        color: "#252525",
                        marginTop: "17px",
                        gap:"4px",
                        left:"96px"
                      }}
                    >
                      {med.name}
                    </div>
                    <div style={{ fontSize: "12px", color: "#777" }}>
                      <img
                        src={Treat}
                        alt="treat"
                        style={{ width: "14px", height: "14px" }}
                      />{" "}
                      1 Pill
                    </div>
                  </div>

                  {/* Status badge */}
                  {getStatusBadge(med.status, med.time)}
                </div>
              </Col>
            ))}
          </Row>
        </div>
      ))}
     </div>
    </Container>
  );

}

export default Medication;