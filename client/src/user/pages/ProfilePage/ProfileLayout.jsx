// ProfileLayout.jsx
import { Outlet, useLocation } from "react-router-dom";
import Topbar from "../../pages/Topbar/Topbar";
import Sidebar from "../../pages/ProfilePage/sidebar";
import { useEffect, useState } from "react";

export default function ProfileLayout() {

  const location = useLocation();
  const [hideTopbar, setHideTopbar] = useState(false);
   
const paths = [
  "/profile/security-and-login",
  "/profile"
];

useEffect(() => {
  const checkWidth = () => {
    const w = window.innerWidth;

    // ✅ Any match?
    const isSecurityPanel = paths.some(p => location.pathname === p);

    setHideTopbar(isSecurityPanel && (w <= 425 || (w > 425 && w <= 768)));
  };

  checkWidth(); // Run once on mount + whenever pathname changes
  window.addEventListener("resize", checkWidth);
  return () => window.removeEventListener("resize", checkWidth);
}, [location.pathname]); // ✅ Will re-run on route change


  return (
    <>
      {/* <Topbar /> */}
      {!hideTopbar && <Topbar />}
      <Sidebar />
      <Outlet />
    </>
  );
}
