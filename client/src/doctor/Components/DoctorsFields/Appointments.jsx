import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../api-config";
import styled, { css } from "styled-components"; // <-- Import

const PAGE_SIZE = 10;

// ========================================================================
//  STYLED COMPONENTS (Replaces your <style> tag)
// ========================================================================

const Container = styled.div`
  max-width: 1100px;
  margin: 40px auto;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  padding: 20px;
  color: #333;

  @media (max-width: 768px) {
    padding: 15px;
    margin-top: 100px; 
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: #222;
  border-bottom: 2px solid #007bff;
  padding-bottom: 8px;
  display: inline-block;
`;

const AppointmentSection = styled.section`
  margin-bottom: 40px;
`;

const ControlsContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const StyledInput = styled.input`
  padding: 10px 14px;
  font-size: 1rem;
  border: 1.5px solid #ccc;
  border-radius: 6px;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 6px rgba(0, 123, 255, 0.4);
  }

  &[type="text"] {
    flex-grow: 1;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

// A dynamic button component
const Button = styled.button`
  padding: 8px 16px;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  text-align: center;
  transition: background-color 0.2s;
  white-space: nowrap; // Prevents text wrap

  /* Default/Primary styles */
  background-color: #007bff;
  &:hover {
    background-color: #0056b3;
  }

  /* Variant styles */
  ${(props) =>
    props.variant === "danger" &&
    css`
      background-color: #dc3545;
      &:hover {
        background-color: #c82333;
      }
    `}

  ${(props) =>
    props.variant === "secondary" &&
    css`
      background-color: #6c757d;
      &:hover {
        background-color: #5a6268;
      }
    `}

  /* Disabled state */
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    opacity: 0.7;
    &:hover {
      background-color: #ccc;
    }
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
  border-radius: 8px;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 1rem;
  min-width: 700px;
  background-color: #fff;

  thead tr {
    background-color: #f9fafb;
    text-align: left;
    font-weight: 600;
  }

  th,
  td {
    padding: 14px 16px;
    border-bottom: 1px solid #e5e7eb;
    white-space: nowrap;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  tbody tr:hover {
    background-color: #f0f4f8;
  }

  .no-data {
    text-align: center;
    padding: 30px 0;
    color: #777;
  }

  .capitalize {
    text-transform: capitalize;
  }
`;

const PaginationControls = styled.div`
  margin-top: 20px;
  display: flex;
  gap: 15px;
  justify-content: center;
  align-items: center;

  span {
    font-size: 1rem;
    min-width: 100px;
    text-align: center;
  }

  ${Button} {
    min-width: 80px;
  }

  @media (max-width: 768px) {
    gap: 10px;
    span {
      font-size: 0.85rem;
      min-width: 80px;
    }
    ${Button} {
      min-width: 60px;
      padding: 6px 10px;
      font-size: 0.85rem;
    }
  }
`;

// ========================================================================
//  YOUR REACT COMPONENT
// ========================================================================

const Appointments = () => {
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [cancellingIds, setCancellingIds] = useState([]);
  const [upcomingPage, setUpcomingPage] = useState(1);
  const [pastPage, setPastPage] = useState(1);

  const doctorId = localStorage.getItem("doctorId");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/appointments/doctor/${doctorId}`
        );
        setUpcomingAppointments(response.data.upcoming || []);
        setPastAppointments(response.data.past || []);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    if (doctorId) {
      fetchAppointments();
    }
  }, [doctorId]);

  const handleCancel = async (appointmentId) => {
    try {
      setCancellingIds((prev) => [...prev, appointmentId]);
      await axios.patch(
        `${API_BASE_URL}/api/appointments/${appointmentId}/cancel`
      );

      setUpcomingAppointments((prev) =>
        prev.map((appt) =>
          appt._id === appointmentId ? { ...appt, status: "cancelled" } : appt
        )
      );
    } catch (error) {
      console.error("Error canceling appointment:", error);
      alert("Failed to cancel appointment. Please try again.");
    } finally {
      setCancellingIds((prev) => prev.filter((id) => id !== appointmentId));
    }
  };

  const filterData = (appointments) =>
    appointments.filter((appointment) => {
      const user = appointment.userId || {};
      const matchesSearch =
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment._id?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDate = filterDate ? appointment.date === filterDate : true;

      return matchesSearch && matchesDate;
    });

  const paginateData = (data, page) => {
    const startIndex = (page - 1) * PAGE_SIZE;
    return data.slice(startIndex, startIndex + PAGE_SIZE);
  };

  // --- renderTable function (uses StyledTable) ---
  const renderTable = (appointments, showCancel = false) => (
    <StyledTable>
      <thead>
        <tr>
          <th>Full Name</th>
          <th>Phone</th>
          <th>Date</th>
          <th>Time</th>
          <th>Type</th>
          <th>Amount</th>
          {showCancel && <th>Action</th>}
        </tr>
      </thead>
      <tbody>
        {appointments.length > 0 ? (
          appointments.map((appt) => {
            const user = appt.userId || {};
            const isCancelling = cancellingIds.includes(appt._id);
            return (
              <tr key={appt._id}>
                <td>{user.full_name || "N/A"}</td>
                <td>{user.phone_number || "N/A"}</td>
                <td>{appt.date || "—"}</td>
                <td>{appt.time || "—"}</td>
                <td className="capitalize">{appt.type || "—"}</td>
                <td>₹{appt.amount || 0}</td>
                {showCancel && (
                  <td>
                    <Button
                      variant={
                        appt.status === "cancelled" ? "secondary" : "danger"
                      }
                      disabled={isCancelling || appt.status === "cancelled"}
                      onClick={() => handleCancel(appt._id)}
                    >
                      {appt.status === "cancelled"
                        ? "Cancelled"
                        : isCancelling
                        ? "Cancelling..."
                        : "Cancel"}
                    </Button>
                  </td>
                )}
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan={showCancel ? 7 : 6} className="no-data">
              No appointments found.
            </td>
          </tr>
        )}
      </tbody>
    </StyledTable>
  );

  // --- renderPagination (simpler, styles are in PaginationControls) ---
  const renderPagination = (currentPage, setPage, totalItems) => {
    const totalPages = Math.ceil(totalItems / PAGE_SIZE);

    return (
      <PaginationControls>
        <Button
          onClick={() => setPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </Button>
        <span>
          Page {currentPage} of {totalPages || 1}
        </span>
        <Button
          onClick={() => setPage(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          Next
        </Button>
      </PaginationControls>
    );
  };

  useEffect(() => {
    setUpcomingPage(1);
    setPastPage(1);
  }, [searchTerm, filterDate]);

  const filteredUpcoming = filterData(upcomingAppointments);
  const paginatedUpcoming = paginateData(filteredUpcoming, upcomingPage);

  // --- Main component render (uses styled components) ---
  return (
    <>
      {/* No <style> tag needed! */}
      <Container>
        <h3>Appointments</h3>

        <ControlsContainer>
          <StyledInput
            type="text"
            placeholder="Search by name, email or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <StyledInput
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
          {filterDate && (
            <Button
              variant="danger"
              onClick={() => setFilterDate("")}
              title="Clear Date Filter"
            >
              Clear Date
            </Button>
          )}
        </ControlsContainer>

        <AppointmentSection>
          <SectionTitle>Ongoing</SectionTitle>
          <TableWrapper>
            {loading ? <p>Loading...</p> : renderTable([])}
          </TableWrapper>
        </AppointmentSection>

        <AppointmentSection>
          <SectionTitle>Upcoming</SectionTitle>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <TableWrapper>
                {renderTable(paginatedUpcoming, true)}
              </TableWrapper>
              {renderPagination(
                upcomingPage,
                setUpcomingPage,
                filteredUpcoming.length
              )}
            </>
          )}
        </AppointmentSection>
      </Container>
    </>
  );
};

export default Appointments;