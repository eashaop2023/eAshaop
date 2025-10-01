import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const DoctorsLayout = () => {
  return (
    <div className="font-urbanist h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <div className="hidden lg:block w-60 bg-white border-r">
          <Sidebar />
        </div>
        <div className="flex-1 p-4 overflow-y-auto pt-[56px] sm:pt-[64px] md:pt-[72px] lg:pt-4">
          {/* Nested routes render here */}
          <Outlet />
        </div>
      </div>
      <div className="lg:hidden">
        <Sidebar />
      </div>
    </div>
  );
};

export default DoctorsLayout;
