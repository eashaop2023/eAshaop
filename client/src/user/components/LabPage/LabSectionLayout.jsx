import React, { useState } from 'react'
import Topbar from '../../pages/Topbar/Topbar'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../categorypage/Sidebar';

function LabSectionLayout() {
   const location = useLocation();

  return (
    <>
    
      <Topbar/>
      <Sidebar/> 
      <div>
        <Outlet/>
      </div>
      
    </>
  )
}

export default LabSectionLayout
