import { useState, useEffect } from "react";
import { getDoctorId } from "../utils/getDoctorId";

/**
 * Custom hook to get doctorId from localStorage or fetch from API
 * @returns {string|null} Doctor ID or null if not available
 */
export const useDoctorId = () => {
  const [doctorId, setDoctorId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDoctorId = async () => {
      setLoading(true);
      const id = await getDoctorId();
      setDoctorId(id);
      setLoading(false);
    };
    loadDoctorId();
  }, []);

  return { doctorId, loading };
};

