import React, { useEffect, useState } from "react";
import Header from "../../../Components/Header/Header";
import Sidebar from "../../../Components/Sidebar/Sidebar";
import classes from "./PatientAppointment.module.css";
import apiClient from "../../../lib/util";
import Cookies from "js-cookie";

const PatientAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); // For pagination
  const limit = 10; // Number of appointments per page

  // Fetch appointments when the component mounts or page changes
  useEffect(() => {
    const fetchAppointments = async () => {
      const patientId = Cookies.get("userId");

      if (!patientId) {
        setError("No patient ID found.");
        setLoading(false);
        return;
      }

      try {
        // Pass `page` and `limit` for pagination
        const response = await apiClient.get("/patient/patientappointment", {
          params: { patientId, page, limit },
        });

        if (response.data.success) {
          console.log("Fetched Appointments:", response.data.data);
          setAppointments(response.data.data); // Access `data` instead of `appointments`
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
  }, [page]); // Re-run when the page changes

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <Header role="patient" isLoggedIn={true} />

      <div className={classes.container}>
        <Sidebar />

        <div className={classes.main}>
          <div className={classes.appointmentHeader}>
            <h2>Appointments</h2>
          </div>

          {appointments.length > 0 ? (
            <div className={classes.appointmentList}>
              {appointments.map((appointment, index) => (
                <div className={classes.appointmentItem} key={index}>
                  <div className={classes.date}>{appointment.date || "N/A"}</div>
                  <p>{appointment.timeSlot || "N/A"}</p>
                  <p>Doctor: {appointment.doctorName}</p>
                  <p>For: {appointment.reason || "N/A"}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No appointments available.</p>
          )}

          {/* Pagination Controls */}
          <div className={classes.pagination}>
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <span>Page {page}</span>
            <button onClick={() => setPage((prev) => prev + 1)}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientAppointment;
