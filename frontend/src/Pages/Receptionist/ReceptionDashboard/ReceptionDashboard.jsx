import React, { useEffect, useState } from "react";
import Header from "../../../Components/Header/Header";
import Sidebar from "../../../Components/Sidebar/Sidebar"; // Sidebar handles role-based links
import classes from "./Receptionist.module.css"; // CSS module for styling
import apiClient from "../../../lib/util";
import Loader from "../../../Components/Loader/Loader";
import { useRole } from "../../../context/roleContext";

const ReceptionDashboard = () => {
  const { userId } = useRole(); // Get userId from context
  const [appointments, setAppointments] = useState([]);
  const [checkedInPatients, setCheckedInPatients] = useState([]);
  const [loading, setLoading] = useState(false); // For general loading state
  const [error, setError] = useState(null); // For error messages

  // Fetch all data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch today's appointments
        const appointmentsResponse = await apiClient.get("/reception/appointments", {
          params: { date: new Date().toISOString(), receptionistId: userId },
        });

        // Fetch checked-in patients
        const patientsResponse = await apiClient.get("/reception/checkedinpatients", {
          params: { date: new Date().toISOString(), receptionistId: userId },
        });

        // Check if data exists before setting state
        if (appointmentsResponse?.data?.data) {
          setAppointments(appointmentsResponse.data.data);
        } else {
          setAppointments([]);
        }

        if (patientsResponse?.data?.data) {
          setCheckedInPatients(patientsResponse.data.data);
        } else {
          setCheckedInPatients([]);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className={classes.container}>
      {/* Header Component */}
      <Header role="Receptionist" isLoggedIn={true} />

      <div className={classes.main}>
        {/* Sidebar Component */}
        <Sidebar />

        {/* Content Section */}
        <div className={classes.content}>
          {/* Card: Today's Appointments */}
          <div className={classes.card}>
            <div>
              <h3>Today's Appointments: {appointments.length}</h3>
            </div>
            {appointments.length > 0 && (
              <div>
                <button className={classes.view__details__btn}>View Details</button>
                <span className={classes.date}>
                  {appointments[0]?.timeSlot
                    ? new Date(appointments[0].timeSlot).toLocaleTimeString()
                    : "N/A"}
                </span>
              </div>
            )}
          </div>
          {/* Card: Checked-in Patients */}
          <div className={classes.card}>
            <div>
              <h3>Checked-in Patients: {checkedInPatients.length}</h3>
            </div>
            {checkedInPatients.length > 0 && (
              <ul>
                {checkedInPatients.map((patient, index) => (
                  <li key={index}>
                    {patient?.name || "Unknown Patient"} {/* Display patient name */}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceptionDashboard;
