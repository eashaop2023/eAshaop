import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Topbar from "../../pages/Topbar/Topbar";
import Sidebar from './Sidebar';
import Dashboard from './DashBoard';
import DBoard from '../Dashboard/DBoard';
import Appointments from '../../pages/AppointmentPage/Appointments';

const CategorypageFullPage = () => {
  const location = useLocation();
  return (
    <div className="vh-100 d-flex flex-column">

      <Topbar />
      <div className="d-flex flex-grow-1 flex-column">
        <Sidebar/>
        <DBoard/>
        <Appointments/>
      </div>
    </div>
  );
};

export default CategorypageFullPage;
