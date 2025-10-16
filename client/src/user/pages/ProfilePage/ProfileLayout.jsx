// ProfileLayout.jsx
import { Outlet, useLocation } from "react-router-dom";
import Topbar from "../../pages/Topbar/Topbar";
import Sidebar from "../../pages/ProfilePage/sidebar";
import { useEffect, useState } from "react";

export default function ProfileLayout() {

  const location = useLocation();
  const [hideTopbar, setHideTopbar] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 992);

const paths = [
  "/profile/security-and-login",
  "/profile"
];

useEffect(() => {
  const checkWidth = () => {
    const w = window.innerWidth;

    // ✅ Any match?
    const isSecurityPanel = paths.some(p => location.pathname === p);

    setHideTopbar(isSecurityPanel && w >= 425);
    setIsSidebarOpen(w >= 992);
  };

  checkWidth(); // Run once on mount + whenever pathname changes
  window.addEventListener("resize", checkWidth);
  return () => window.removeEventListener("resize", checkWidth);
}, [location.pathname]); // ✅ Will re-run on route change

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <>
      {!hideTopbar && <Topbar toggleSidebar={toggleSidebar} />}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <Outlet />
    </>
  );
}
