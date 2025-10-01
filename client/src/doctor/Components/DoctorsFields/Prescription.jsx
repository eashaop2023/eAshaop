import React, { useState } from "react";

const prescriptions = [
  {
    patient: "Ravi",
    medicine: "Metformin 500mg",
    dosage: "1 tablet, twice daily",
    date: "2024-07-28",
    status: "Dispensed",
  },
  {
    patient: "Ravi",
    medicine: "Metformin 500mg",
    dosage: "1 tablet, once daily",
    date: "2024-07-28",
    status: "Pending",
  },
  {
    patient: "Sarah Miller",
    medicine: "Omeprazole 20mg",
    dosage: "1 tablet, once daily",
    date: "2024-07-28",
    status: "Pending",
  },
];

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

const PrescriptionForm = () => {
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

  // Filter prescriptions by search term
  const filteredPrescriptions = prescriptions.filter(
    (p) =>
      p.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.medicine.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="ml-0 md:pl-[80px] lg:pl-[327px] mt-[75px] md:mt-[35px] lg:mt-[80px] font-urbanist px-4 sm:px-6">
      <div className="max-w-[978px]">
        {/* Title */}
        <h2 className="text-2xl font-semibold mb-6">Create new Prescription</h2>

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

          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-gray-100 text-gray-700 text-left">
                  <th className="px-4 py-2">Patient Name</th>
                  <th className="px-4 py-2">Medicine</th>
                  <th className="px-4 py-2">Dosage</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredPrescriptions.length > 0 ? (
                  filteredPrescriptions.map((p, idx) => (
                    <tr
                      key={idx}
                      className="border-b text-gray-700 border-none"
                    >
                      <td className="px-4 py-2">{p.patient}</td>
                      <td className="px-4 py-2">{p.medicine}</td>
                      <td className="px-4 py-2">{p.dosage}</td>
                      <td className="px-4 py-2">{p.date}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`${getStatusColor(
                            p.status
                          )} text-white px-3 py-1 rounded-full text-sm w-24 inline-block text-center`}
                        >
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center text-gray-500 py-4"
                    >
                      No prescriptions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionForm;
