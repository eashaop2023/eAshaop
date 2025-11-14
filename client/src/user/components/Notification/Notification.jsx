import React, { useState, useEffect } from "react";
import { Alert, AlertTitle, IconButton, Slide } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const Notification = ({showNotification,setShowNotification,notifications}) => {
//   const [openNotification, setOpenNotification] = useState(false); 

  const handleClose = () => {
    setShowNotification(false);
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 9999,
        marginLeft:"1rem"
      }}
    >
      <Slide direction="up" in={showNotification} mountOnEnter unmountOnExit>
        <Alert
          severity="success"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={handleClose}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{
            boxShadow: 3,
            borderRadius: "12px",
            minWidth: "320px",
            backgroundColor: "#e8f5e9",
          }}
        >
          <AlertTitle>Updates</AlertTitle>

          {/* Map through all notifications */}
          {notifications.map((item, index) => (
            <div key={index} style={{ marginBottom: "8px" }}>
              <strong>{item.header}:</strong> {item.title}
            </div>
          ))}
        </Alert>
      </Slide>
    </div>
  );
};

export default Notification;
