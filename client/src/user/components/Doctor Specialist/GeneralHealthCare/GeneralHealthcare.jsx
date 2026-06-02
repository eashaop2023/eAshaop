import React, { useState } from "react";
import Sidebar from "../../Doctor Specialist/GeneralHealthCare/Sidebar";
import MainContent from "../../Doctor Specialist/GeneralHealthCare/MainContent";   // ✅ MainContent component
import "../../Doctor Specialist/GeneralHealthCare/MainContent.css";               // ✅ styles only
import { Outlet } from "react-router-dom";

function Orthopedic() {
  const [selectedFilters, setSelectedFilters] = useState({
    locations: [],
    fee: [],
    gender: [],
    language: [],
    rating: [],
    general: [],
  });

  const clearAllFilters = () => {
    setSelectedFilters({
      locations: [],
      fee: [],
      gender: [],
      language: [],
      rating: [],
      general: [],
    });
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <>
      <div>
        <div className="d-flex" style={{ paddingTop: "75px" }}>
          <aside>
            <Sidebar
              selectedFilters={selectedFilters}
              setSelectedFilters={setSelectedFilters}
              className={isSidebarOpen ? "open" : ""}
              onClose={toggleSidebar}
              isOpen={isSidebarOpen}
            />
          </aside>

          <MainContent
            selectedFilters={selectedFilters}
            setSelectedFilters={setSelectedFilters}
            clearAllFilters={clearAllFilters}
            onToggleSidebar={toggleSidebar}
          />
        </div>
      </div>
      <Outlet />
    </>
  );
}

export default Orthopedic;
