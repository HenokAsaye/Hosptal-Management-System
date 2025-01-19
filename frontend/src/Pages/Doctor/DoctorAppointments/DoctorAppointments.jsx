import React, { useEffect, useState } from "react";
import Header from "../../../Components/Header/Header";
import Sidebar from "../../../Components/Sidebar/Sidebar";
import classes from "./DoctorAppointments.module.css";
import apiClient from "../../../lib/util";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const getDoctorIdFromCookies = () => {
    const cookies = document.cookie.split("; ").reduce((acc, current) => {
      const [name, value] = current.split("=");
      acc[name] = value;
      return acc;
    }, {});
    return cookies.userId || null;
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      const doctorId = getDoctorIdFromCookies();

      if (!doctorId) {
        setError("Doctor ID not found in cookies");
        setIsLoading(false);
        return;
      }

      try {
        const response = await apiClient.get(`/api/appointments?doctorId=${doctorId}`);
        setAppointments(response.data.data || []);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          // Handle "No appointments found" as a non-error
          setAppointments([]);
        } else {
          // Handle other errors
          setError("Failed to load appointments");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []); // Only fetch on mount

  return (
    <div>
      {/* Header Component */}
      <Header role="Doctor" isLoggedIn={true} />

      <div className={classes.container}>
        {/* Sidebar Component */}
        <Sidebar />

        {/* Main Content */}
        <div className={classes.main}>
          <div className={classes.appointmentHeader}>
            <h2>Appointments</h2>
          </div>

          {/* Loading State */}
          {isLoading && <p>Loading appointments...</p>}

          {/* Error State */}
          {error && <p className={classes.error}>{error}</p>}

          {/* No Appointments Found */}
          {!isLoading && !error && appointments.length === 0 && (
            <p>No Scheduled Appointments for you Currently!Enjoy Your Time!</p>
          )}

          {/* Appointment List */}
          <div className={classes.appointmentList}>
            {appointments.map((appointment) => (
              <div key={appointment._id} className={classes.appointmentItem}>
                <div className={classes.date}>
                  {new Date(appointment.timeSlot).toLocaleDateString()}
                </div>
                <p>
                  {new Date(appointment.timeSlot).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p>Patient name - {appointment.patientId?.name || "Unknown"}</p>
                <p>For: {appointment.reason}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorAppointments;
