import { Outlet } from "react-router-dom";
import Sidebar from "./Doctor Specialist/cardiologist/Sidebar";
import { useState } from "react";
import Topbar from "../pages/Topbar/Topbar";

const DoctorsWithSidebarLayout = () => {
     const [selectedFilters, setSelectedFilters] = useState({
        locations: [],
        fee: [],
        gender: [],
        language: [],
        rating: [],
        general: [],
      });

  return (
     <>
      <Topbar />
      <div className="d-flex" style={{ paddingTop: "75px" }}>
        <Sidebar
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
        />
      </div>
      <Outlet />
    </>
  );
};

export default DoctorsWithSidebarLayout;
