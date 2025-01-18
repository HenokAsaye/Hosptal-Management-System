import React, { useState } from "react";
import Header from "../../../Components/Header/Header";
import Sidebar from "../../../Components/Sidebar/Sidebar";
import classes from "./CancelAppointment.module.css";
import { FaSearch } from "react-icons/fa";
import apiClient from "../../../lib/util"; // Adjust path to match your file structure

const CancelAppointment = () => {
  const [doctorName, setDoctorName] = useState(""); // State for doctor's name
  const [appointments, setAppointments] = useState([]); // State for appointments list
  const [message, setMessage] = useState(""); // State for displaying messages

  // Handle search by doctor name
  const handleSearch = async (e) => {
    e.preventDefault();

    // Validate that doctorName is not empty
    if (!doctorName) {
      setMessage("Doctor name is required.");
      return;
    }

    try {
      // Send request to get appointments based on doctor name
      const response = await apiClient.get("/reception/search", {
        params: { doctorName },
      });

      // If success, set appointments data
      if (response.data.success) {
        setAppointments(response.data.appointments);
        setMessage("");
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setMessage("Failed to fetch appointments.");
    }
  };

  // Handle cancel appointment
  const handleCancel = async (appointmentId) => {
    try {
      // Send request to cancel the appointment
      const response = await apiClient.post("/reception/cancel", {
        doctorName,
        appointmentId,
      });

      // If cancellation is successful, update the appointments list
      if (response.data.success) {
        setAppointments(appointments.filter((appointment) => appointment._id !== appointmentId)); // Remove cancelled appointment
        setMessage("Appointment cancelled and patient notified.");
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      setMessage("Failed to cancel appointment.");
    }
  };

  return (
    <div>
      {/* Header Component */}
      <Header role="Receptionist" isLoggedIn={true} />

      <div className={classes.container}>
        {/* Sidebar Component */}
        <Sidebar />

        {/* Main Content */}
        <div className={classes.main}>
          <h2 className={classes.title}>Cancel Appointment</h2>

          {/* Search Form */}
          <form className={classes.searchForm} onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search by Doctor's Name"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              className={classes.searchInput}
            />
            <button type="submit" className={classes.searchButton}>
              <FaSearch size={20} color="#4a90e2" />
            </button>
          </form>

          {/* Display message */}
          {message && <div className={classes.message}>{message}</div>}

          {/* Display Appointments */}
          {appointments.length > 0 ? (
            <div>
              {appointments.map((appointment) => (
                <div
                  key={appointment._id}
                  style={{ border: "1px solid #ddd", padding: "10px", marginBottom: "10px" }}
                >
                  <p>Doctor: {appointment.doctorId.name}</p>
                  <p>Patient: {appointment.patientId.name}</p>
                  <p>Time Slot: {new Date(appointment.timeSlot).toLocaleString()}</p>
                  <button
                    onClick={() => handleCancel(appointment._id)}
                    className={classes.cancelButton}
                  >
                    Cancel
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p>No appointments found for this doctor.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CancelAppointment;
