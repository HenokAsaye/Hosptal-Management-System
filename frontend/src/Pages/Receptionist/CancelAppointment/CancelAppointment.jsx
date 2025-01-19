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
  const [isSearching, setIsSearching] = useState(false); // State to track if a search has been made
  const [hasSearched, setHasSearched] = useState(false); // State to track if the user has made a search

  // Handle search by doctor name
  const handleSearch = async (e) => {
    e.preventDefault();

    // Validate that doctorName is not empty
    if (!doctorName.trim()) {
      setMessage("Doctor name is required.");
      return;
    }

    setIsSearching(true); // Indicate that the search is in progress
    setMessage(""); // Clear previous messages
    setHasSearched(true); // Set that the user has searched

    try {
      // Send request to get appointments based on doctor name
      const response = await apiClient.get("/reception/search", {
        params: { doctorName },
      });

      // If success, set appointments data
      if (response.data.success) {
        setAppointments(response.data.appointments);
      } else {
        setAppointments([]); // Clear previous appointments if no results
        setMessage(response.data.message || "No appointments found.");
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setAppointments([]); // Clear previous appointments if there's an error
      setMessage("Failed to fetch appointments.");
    } finally {
      setIsSearching(false); // Reset the searching state
    }
  };

  // Handle cancel appointment
  const handleCancel = async (appointmentId) => {
    try {
      const response = await apiClient.delete(`/reception/cancel`, {
        data: {
          doctorName,
          appointmentId,
        },
      });
  
      if (response.data.success) {
        setAppointments(appointments.filter((appointment) => appointment._id !== appointmentId));
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
          {isSearching ? (
            <p>Loading appointments...</p>
          ) : hasSearched && appointments.length > 0 ? (
            <div>
              {appointments.map((appointment) => (
                <div
                  key={appointment._id}
                  style={{ border: "1px solid #ddd", padding: "10px", marginBottom: "10px" }}
                >
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
          ) : hasSearched ? (
            <p>No appointments found for this doctor.</p>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default CancelAppointment;
