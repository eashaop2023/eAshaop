import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Topbar from "../Topbar/Topbar";
import Sidebar from "../../components/categorypage/Sidebar";

function PharmacyLayout() {
  const location = useLocation();
  
    // location.pathname === "/pharmacy/filter" || "/pharmacy/details";

  const hideSidebarRoutes = [
    "/pharmacy/filter",
    "/pharmacy/details",
    "/pharmacy/mycart",
    "/pharmacy/address",
    "/pharmacy/payment",
  ];
  const hideSidebar =  hideSidebarRoutes.includes(location.pathname)

  return (
    <>
      <Topbar />
      {!hideSidebar && <Sidebar />}
      <Outlet />
    </>
  );
}

export default PharmacyLayout;
