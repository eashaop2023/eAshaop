import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import LoginPage from "./common./LoginPage./LoginPage";
import Forgotpassword from "./common/LoginPage/Forgotpassword";
import UserApp from "./user/UserApp";
import DoctorApp from "./doctor/DoctorApp";
import LoginFlow from "./common/LoginPage/LoginFlow";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {
  return (
    <Router>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
        draggable
      />
      <Routes>
        {/* Common Login Page */}
        <Route path="/*" element={<LoginFlow />} />

        <Route path="/login" element={<LoginFlow />} />
        {/* <Route path="/forgot-password" element={<Forgotpassword />} /> */}

        {/* User routes (handled inside UserApp.jsx) */}
        <Route path="/user/*" element={<UserApp />} />

        {/* Doctor routes (handled inside DoctorApp.jsx) */}
        <Route path="/doctor/*" element={<DoctorApp />} />
      </Routes>
    </Router>
  );
}

export default App;
