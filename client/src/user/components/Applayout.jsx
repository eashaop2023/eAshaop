import React from 'react'
import Topbar from "../pages/Topbar/Topbar";
import Sidebar from '../components/categorypage/Sidebar';
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from './SidebarContext';

function Applayout() {

  return (
    <SidebarProvider>
      <Topbar/>
      <Sidebar/>
      <Outlet/>
    </SidebarProvider>
  )
}

export default Applayout
