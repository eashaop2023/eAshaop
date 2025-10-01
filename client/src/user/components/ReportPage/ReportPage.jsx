import React from "react";
import { Modal, Button, Row, Col, Card } from "react-bootstrap";
import document from "../../assets/document-text.png";
import styles from '../../components/ReportPage/ReportPage.module.css'

const reports = {
  Today: [
    { title: "Blood test" },
    { title: "CT Scan" },
    { title: "MRI" },
    { title: "Prescription" },
    { title: "Diabetes" },
  ],
  Yesterday: [{ title: "Blood test" }, { title: "CT Scan" }, { title: "MRI" }],
  "24 June 2023": [
    { title: "Blood test" },
    { title: "CT Scan" },
    { title: "MRI" },
  ],
};

const ReportCard = ({ title }) => (
  <Card
    className={`cardsContainer ${styles.cardsContainer} mb-3`}
    style={{
      width: "100%",
      height: "102px",
      borderRadius: "28px",
      border: "1px solid #F7F7F7",
      padding: "16px 24px 16px 16px",
      boxShadow: "0px 1px 6px rgba(0,0,0,0.05)",
    }}
  >
    <Row className={`${styles.cardRow} h-100 w-100`}>
      <Col xs={2} className="d-flex align-items-center justify-content-center">
        <img src={document} height={40} width={40} alt="document" />
      </Col>
      <Col xs={10} className={`${styles.reportcardCol}`}>
        <div
          className="fw-medium"
          style={{ fontSize: "18px", color: "#252525" }}
        >
          {title}
        </div>
        <div
          className="text-regular"
          style={{ fontSize: "14px", color: "#6B7582" }}
        >
          Shylaja Lab, Hyderabad, Telangana
        </div>
        <div
          className="text-regular"
          style={{ fontSize: "14px", color: "#6B7582" }}
        >
          25 Jan 2025, 241 KB
        </div>
      </Col>
    </Row>
  </Card>
);


function ReportPage() {
    return (
    <div className= {`${styles.outerMainDiv}`}>
      <div
      style={{
        // marginTop:'120px',
        marginLeft:'352px',
        paddingTop:"120px",
        minHeight: "100vh",
        // width:"100%"
      }}
      className={`${styles.mainContainer}`}
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className={`${styles.headerOne}  fw-medium mb-2`} style={{ color: "#252525" }}>
          Reports & Scanning's
        </h2>
      </div>

      {Object.entries(reports).map(([section, items]) => (
        <div key={section} className={` ${styles.cardContainer} mb-4`} style={{ width: "98%" }}>
          <h4 className={` ${styles.headerFour} fw-medium mb-3`} style={{ color: "#494949" }}>
            {section}
          </h4>
          <Row xs={1} sm={2} lg={3} className={`${styles.rowContainer}`}>
            {items.map((item, idx) => (
              <Col key={idx} className={`${styles.colContainer}`}>
                <ReportCard title={item.title} />
              </Col>
            ))}
          </Row>
        </div>
      ))}
    </div>
    </div>
  );
}

export default ReportPage;
