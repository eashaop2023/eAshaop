import { API_BASE_URL } from "../../api-config";

/**
 * Gets doctorId from localStorage or fetches it from profile API
 * @returns {Promise<string|null>} Doctor ID or null if not found
 */
export const getDoctorId = async () => {
  // First check localStorage
  let doctorId = localStorage.getItem("doctorId");
  if (doctorId) {
    return doctorId;
  }

  // If not in localStorage, fetch from profile API
  const token = localStorage.getItem("authToken");
  if (!token) {
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/doctors/profile`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch doctor profile");
      return null;
    }

    const data = await response.json();
    if (data._id) {
      localStorage.setItem("doctorId", data._id);
      return data._id;
    }

    return null;
  } catch (error) {
    console.error("Error fetching doctor profile:", error);
    return null;
  }
};

