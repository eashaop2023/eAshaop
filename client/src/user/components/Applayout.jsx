import React from 'react'
import Topbar from "../pages/Topbar/Topbar";
import Sidebar from '../components/categorypage/Sidebar';
import { Outlet } from 'react-router-dom';

function Applayout() {

  return (
    <>
      <Topbar/>
      <Sidebar/>
      <Outlet/>
    </>
  )
}

export default Applayout
