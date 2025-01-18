import React, { useState, useEffect } from "react";
import Header from "../../../Components/Header/Header";
import Sidebar from "../../../Components/Sidebar/Sidebar";
import apiClient from "../../../lib/util";
import classes from "./DoctorDashboard.module.css";
import Loader from "../../../Components/Loader/Loader"
import { useRole } from "../../../context/roleContext"; // Import RoleContext

const DoctorDashboard = () => {
  const { userId } = useRole(); // Get doctorId from context
  const [appointments, setAppointments] = useState([]);
  const [patientsToday, setPatientsToday] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false); // Avoid setting true unnecessarily
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) return; // Prevent the effect from running without a valid userId
    console.log("User ID:", userId);
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch upcoming appointments
        const appointmentsResponse = await apiClient.get("/doctor/getappointments", {
          params: { doctorId: userId },
        });

        // Fetch today's patients
        const patientsResponse = await apiClient.get("/doctor/getpatients", {
          params: { doctorId: userId, date: new Date().toISOString().split("T")[0] },
        });

        // Fetch notifications
        const notificationsResponse = await apiClient.get("/doctor/getnotifications", {
          params: { doctorId: userId },
        });

        // Update state with fetched data
        setAppointments(appointmentsResponse.data.appointments || []);
        setPatientsToday(patientsResponse.data.patients || []);
        setNotifications(notificationsResponse.data.notifications || []);
      } catch (err) {
        console.error(err);
        setError(`Failed to fetch dashboard data: ${err.response?.data?.message || err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [userId]); // Effect will only run when userId changes

  // Button handlers
  const handleViewAppointments = () => {
    console.log("Viewing appointments:", appointments);
    // Implement navigation or modal for detailed appointments view
  };

  const handleViewPatients = () => {
    console.log("Viewing today's patients:", patientsToday);
    // Implement navigation or modal for patient details view
  };

  const handleViewNotifications = () => {
    console.log("Viewing notifications:", notifications);
    // Implement navigation or modal for notifications view
  };

  if (loading) {
    return <Loader/>
  }

  if (error) {
    return <div className={classes.error}>{error}</div>;
  }

  return (
    <div className={classes.container}>
      <Header role="Doctor" isLoggedIn={true} />

      <div className={classes.layout}>
        <Sidebar />

        <div className={classes.main}>
          {/* Card: Upcoming Appointments */}
          <div className={classes.card}>
            <div>
              <h3>Upcoming Appointments: {appointments.length} Scheduled</h3>
            </div>
            <div>
              <button onClick={handleViewAppointments}>Check</button>
              <span className={classes.date}>
                {appointments.length > 0 ? appointments[0].timeSlot : "N/A"}
              </span>
            </div>
          </div>

          {/* Card: Patients Today */}
          <div className={classes.card}>
            <div>
              <h3>Patients Today: {patientsToday.length}</h3>
            </div>
            <div>
              <button onClick={handleViewPatients}>View</button>
              <span className={classes.date}>
                {patientsToday.length > 0 ? patientsToday[0].name : "N/A"}
              </span>
            </div>
          </div>

          {/* Card: Notifications */}
          <div className={classes.card}>
            <div>
              <h3>Notifications: {notifications.length} unread</h3>
            </div>
            <div>
              <button onClick={handleViewNotifications}>Read</button>
              <span className={classes.date}>
                {notifications.length > 0 ? notifications[0].date : "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
