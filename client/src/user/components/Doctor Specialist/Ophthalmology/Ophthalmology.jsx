import Sidebar from "./Sidebar";
import React, { useState } from "react";
import MainContent from "./MainContent";
import Topbar from "../../../pages/Topbar/Topbar";
import { Outlet } from "react-router-dom";

function Cardiologist() {
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
      setIsSidebarOpen(prev => !prev);
    };
  
  return (
    <>
      <Topbar />
      <div>
        <div className="d-flex" style={{ paddingTop: "75px" }}>
          {/* <Sidebar
            selectedFilters={selectedFilters}
            setSelectedFilters={setSelectedFilters}
          /> */}
       <aside>
           <Sidebar
            selectedFilters={selectedFilters}
            setSelectedFilters={setSelectedFilters}
            className={isSidebarOpen ? "open" : ""}
            onClose={toggleSidebar}
            isOpen={isSidebarOpen} // pass the open state here
          />
       </aside>
          {/* <MainContent
            selectedFilters={selectedFilters}
            setSelectedFilters={setSelectedFilters}
            clearAllFilters={clearAllFilters}
          /> */}
          <MainContent
            selectedFilters={selectedFilters}
            setSelectedFilters={setSelectedFilters}
            clearAllFilters={clearAllFilters}
            onToggleSidebar={toggleSidebar} // <- this is the click handler
          />
        </div>
      </div>
      <Outlet />
    </>
  );
}

export default Cardiologist;
