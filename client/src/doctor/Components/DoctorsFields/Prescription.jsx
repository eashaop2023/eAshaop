import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../../api-config";

const getStatusColor = (status) => {
  switch (status) {
    case "Dispensed":
      return "bg-emerald-500";
    case "Pending":
      return "bg-blue-500";
    default:
      return "bg-gray-400";
  }
};

const Prescription = () => {
  const location = useLocation();
  console.log("Prescription component rendering", location.pathname);
  
  // Ensure API_BASE_URL is available
  if (!API_BASE_URL) {
    console.error("API_BASE_URL is not defined");
  }
  
  const [form, setForm] = useState({
    name: "",
    id: "",
    gender: "",
    medicine: "",
    dosage: "",
    duration: "",
    quantity: "",
    refills: "",
    notes: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  // Fetch prescriptions from API
  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("authToken");
        
        if (!token) {
          setError("Please login to view prescriptions");
          setLoading(false);
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/api/prescriptions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            page,
            limit,
            _t: Date.now(), // Cache busting parameter
          },
        });

        console.log("Prescriptions API response:", response.data);
        
        // Handle paginated response
        if (response.data && response.data.prescriptions) {
          setPrescriptions(response.data.prescriptions || []);
          setTotalPages(response.data.totalPages || 1);
          console.log(`Loaded ${response.data.prescriptions?.length || 0} prescriptions`);
        } else if (Array.isArray(response.data)) {
          // Fallback for non-paginated response
          setPrescriptions(response.data);
          setTotalPages(1);
        } else {
          setPrescriptions([]);
          setTotalPages(1);
        }
      } catch (err) {
        console.error("Error fetching prescriptions:", err);
        const errorMessage = err.response?.data?.message || err.message || "Failed to load prescriptions";
        setError(errorMessage);
        setPrescriptions([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if we're on the prescriptions route
    if (location.pathname.includes('prescriptions')) {
      fetchPrescriptions();
    }
  }, [page, location.pathname]); // Add location.pathname to dependencies to refetch on navigation

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleClear = () => {
    setForm({
      name: "",
      id: "",
      gender: "",
      medicine: "",
      dosage: "",
      duration: "",
      quantity: "",
      refills: "",
      notes: "",
    });
  };

  // Reset page to 1 and clear state when navigating to this page
  useEffect(() => {
    if (location.pathname.includes('prescriptions')) {
      setPage(1);
      setPrescriptions([]);
      setError(null);
      setLoading(true);
    }
  }, [location.pathname]);

  return (
    <div className="w-full h-full overflow-y-auto" style={{ backgroundColor: '#ffffff' }}>
      <div className="max-w-[978px] mx-auto py-6 px-4 font-urbanist">
        {/* Title */}
        <h2 className="text-2xl font-semibold mb-6" style={{ color: '#000000' }}>Create new Prescription</h2>

        {/* Prescription Details */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Prescription Details</h3>
            <p className="text-sm text-gray-500">
              Fill in the details for the patient&apos;s medication
            </p>
          </div>

          {/* Patient Info */}
          <div>
            <h4 className="font-medium mb-2">Patient Information</h4>
            <div className="flex flex-col md:flex-row gap-4">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Patient name"
                className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-1/3"
              />
              <input
                name="id"
                value={form.id}
                onChange={handleChange}
                placeholder="Patient Id"
                className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-1/3"
              />
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-1/3"
              >
                <option value="">Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          {/* Medication Details */}
          <div>
            <h4 className="font-medium mb-2">Medication details</h4>
            <input
              name="medicine"
              value={form.medicine}
              onChange={handleChange}
              placeholder="Medicine Name"
              className="border border-gray-300 rounded-lg px-4 py-2 w-full mb-3"
            />
            <textarea
              name="dosage"
              value={form.dosage}
              onChange={handleChange}
              placeholder="Dosage Instructions"
              className="border border-gray-300 rounded-lg px-4 py-2 w-full h-20"
            />
            <div className="flex flex-col md:flex-row gap-4 mt-3">
              <input
                name="duration"
                value={form.duration}
                onChange={handleChange}
                placeholder="Duration"
                className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-1/3"
              />
              <input
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                placeholder="Quantity"
                className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-1/3"
              />
              <select
                name="refills"
                value={form.refills}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-1/3"
              >
                <option value="">Refills</option>
                <option>0</option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
              </select>
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <h4 className="font-medium mb-2">Additional Notes</h4>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Special Instructions/ Allergies"
              className="border border-gray-300 rounded-lg px-4 py-2 w-full h-20"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleClear}
              className="border border-teal-600 text-teal-600 px-5 py-2 rounded-lg"
            >
              Clear Form
            </button>
            <button className="bg-teal-600 text-white px-5 py-2 rounded-lg border-none">
              Save Prescription
            </button>
          </div>
        </div>

        {/* Recent Prescription Table */}
        <div className="mt-10">
          <h3 className="text-lg font-medium mb-3">Recent Prescriptions</h3>

          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search by patient, medicine, or status"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full mb-4"
          />

          {loading && (
            <div className="text-center text-gray-500 py-4">Loading prescriptions...</div>
          )}

          {error && (
            <div className="text-center text-red-500 py-4">{error}</div>
          )}

          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 text-left">
                    <th className="px-4 py-2">Patient Name</th>
                    <th className="px-4 py-2">Medicines</th>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const filtered = prescriptions.filter((p) => {
                      if (!p) return false;
                      try {
                        const patientName = p.patientName || p.patient?.name || "";
                        const medicines = Array.isArray(p.medicines) 
                          ? p.medicines.map(m => m?.name || "").filter(Boolean).join(", ")
                          : "";
                        return (
                          patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          medicines.toLowerCase().includes(searchTerm.toLowerCase())
                        );
                      } catch (e) {
                        console.error("Error filtering prescription:", e);
                        return false;
                      }
                    });

                    if (filtered.length === 0) {
                      return (
                        <tr>
                          <td
                            colSpan="4"
                            className="text-center text-gray-500 py-4"
                          >
                            No prescriptions found
                          </td>
                        </tr>
                      );
                    }

                    return filtered.map((p, idx) => {
                      try {
                        const patientName = p.patientName || p.patient?.name || "N/A";
                        const medicines = Array.isArray(p.medicines) 
                          ? p.medicines.map(m => m?.name || "").filter(Boolean).join(", ") || "N/A"
                          : "N/A";
                        const date = p.createdAt 
                          ? new Date(p.createdAt).toLocaleDateString() 
                          : "N/A";

                        return (
                          <tr
                            key={p._id || idx}
                            className="border-b text-gray-700 border-none"
                          >
                            <td className="px-4 py-2">{patientName}</td>
                            <td className="px-4 py-2">{medicines}</td>
                            <td className="px-4 py-2">{date}</td>
                            <td className="px-4 py-2">
                              {p.pdfUrl && (
                                <a
                                  href={p.pdfUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-teal-600 hover:underline"
                                >
                                  View PDF
                                </a>
                              )}
                            </td>
                          </tr>
                        );
                      } catch (e) {
                        console.error("Error rendering prescription row:", e);
                        return null;
                      }
                    });
                  })()}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-4">
              <button
                onClick={() => setPage(prev => Math.max(1, prev - 1))}
                disabled={page === 1}
                className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Prescription;
