import React from "react";
import Topbar from "../../pages/Topbar/Topbar";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../categorypage/Sidebar";

function LabTopbarLayout() {

  return (
    <div>
      <Topbar />
      <div>
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default LabTopbarLayout;
