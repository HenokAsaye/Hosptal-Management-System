import React, { useEffect, useState } from "react";
import Header from "../../../Components/Header/Header";
import Sidebar from "../../../Components/Sidebar/Sidebar";
import classes from "./PatientAppointment.module.css";
import apiClient from "../../../lib/util"; // Import your apiClient
import Cookies from "js-cookie"; // Import Cookies to access the patientId from cookies

const PatientAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch appointments when component mounts
  useEffect(() => {
    const fetchAppointments = async () => {
      const patientId = Cookies.get("userId"); // Get the patientId from cookies

      if (!patientId) {
        setError("No patient ID found.");
        setLoading(false);
        return;
      }

      try {
        // Make GET request to fetch appointments with patientId as a query parameter
        const response = await apiClient.get("/patient/patientappointment", {
          params: { patientId }, // Pass the patientId in the query parameters
        });

        if (response.data.success) {
          // Log the appointments data to verify the response
          console.log("Fetched Appointments:", response.data.appointments);
          setAppointments(response.data.appointments);
        } else {
          setError("Failed to fetch appointments.");
        }
      } catch (err) {
        setError("Error fetching appointments: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      {/* Header Component */}
      <Header role="patient" isLoggedIn={true} />

      <div className={classes.container}>
        {/* Sidebar Component */}
        <Sidebar />

        {/* Main Content */}
        <div className={classes.main}>
          <div className={classes.appointmentHeader}>
            <h2>Appointments</h2>
          </div>

          {/* Appointment List */}
          {appointments.length > 0 ? (
            <div className={classes.appointmentList}>
              {appointments.map((appointment, index) => (
                <div className={classes.appointmentItem} key={index}>
                  <div className={classes.date}>{appointment.date}</div>
                  <p>{appointment.timeSlot}</p>
                  <p>Doctor: {appointment.doctorName}</p>
                  <p>For: {appointment.reason}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No appointments available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientAppointment;
