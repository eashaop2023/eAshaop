import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/eAshalogo.png";
function LoginPage() {
  const navigate = useNavigate();
  const [doctorId, setDoctorId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (!doctorId.trim()) {
      setError("Please enter Doctor ID");
      return;
    }

    if (!password.trim()) {
      setError("Please enter Password");
      return;
    }

    // 🔒 Dummy validation (replace with API call)
    if (doctorId === "doctor123" && password === "easha") {
      navigate("/dashboard");
    } else {
      setError("Invalid Doctor ID or Password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* Logo + Title */}
        <div className="text-center mb-6">
          <img src={logo} alt="eAsha Healthcare" className="w-24 mx-auto mb-3" />
          <h2 className="text-2xl font-semibold text-gray-800">Doctor Login</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Doctor ID */}
          <div>
            <label htmlFor="doctorId" className="block text-gray-700 mb-1 font-medium">
              Doctor ID
            </label>
            <input
              type="text"
              id="doctorId"
              placeholder="Enter Doctor ID"
              className="w-[400px] px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-[#00A99D] focus:outline-none"
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-gray-700 mb-1 font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter Password"
              className="w-[400px] px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-[#00A99D] focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Error */}
          {error && (
            <div className="text-red-500 text-sm font-medium">{error}</div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-full bg-[#00A99D] text-white font-medium hover:opacity-90 transition border border-[#00A99D] "
          >
            Log in
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
