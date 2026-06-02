import React, { useState } from "react";
import Topbar from "../pages/Topbar/Topbar";
import Sidebar from "./Doctor Specialist/cardiologist/Sidebar";
import { Outlet } from "react-router-dom";
import MainContent from "./Doctor Specialist/cardiologist/MainContent";

function DoctorsMainLayout() {

  return (
    <>
      <Topbar />
      <Outlet />
    </>
  );
}

export default DoctorsMainLayout;
