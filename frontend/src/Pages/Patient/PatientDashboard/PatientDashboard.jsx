import React, { useEffect, useState } from "react";
import Header from "../../../Components/Header/Header";
import Sidebar from "../../../Components/Sidebar/Sidebar"; // Sidebar handles role-based links
import classes from "./PatientDashboard.module.css"; // CSS module for styling
import apiClient from "../../../lib/util";
import Loader from "../../../Components/Loader/Loader";
import { useRole } from "../../../context/roleContext";

const PatientDashboard = () => {
  const { userId } = useRole(); // Get userId from context
  const [appointments, setAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [labResults, setLabResults] = useState([]);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [loading, setLoading] = useState(false); // For general loading state
  const [error, setError] = useState(null); // For error messages
  const [hasMoreAppointments, setHasMoreAppointments] = useState(true);
  const [hasMoreNotifications, setHasMoreNotifications] = useState(true);
  const [appointmentsPage, setAppointmentsPage] = useState(1);
  const [notificationsPage, setNotificationsPage] = useState(1);

  // Fetch all data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch upcoming appointments
        const appointmentsResponse = await apiClient.get("/patient/patientappointment", {
          params: { page: appointmentsPage, limit: 5, patientId: userId }, // Limit to 5 appointments
        });

        // Fetch notifications
        const notificationsResponse = await apiClient.get("/patient/patientnotification", {
          params: { page: notificationsPage, limit: 5, patientId: userId }, // Limit to 5 notifications
        });

        // Fetch lab results
        const labResultsResponse = await apiClient.get("/patient/checklabresult", {
          params: { page: 1, limit: 5, patientId: userId },
        });

        // Update state with data
        setAppointments(appointmentsResponse.data.appointments || []);
        setNotifications(notificationsResponse.data.patientNotification || []);
        setLabResults(labResultsResponse.data.labResult || []);
        setHasMoreAppointments(appointmentsResponse.data.hasMore);
        setHasMoreNotifications(notificationsResponse.data.hasMore);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [appointmentsPage, notificationsPage, userId]);

  // Handle delete functionality for appointments and notifications
  const handleDeleteItem = async (id, type) => {
    try {
      setLoading(true);
      const url = `/patient/${type}/${id}`;
      await apiClient.delete(url, { params: { patientId: userId } });
      
      // Update state after deletion
      if (type === "appointment") {
        setAppointments((prev) => prev.filter(item => item.id !== id));
      } else if (type === "notification") {
        setNotifications((prev) => prev.filter(item => item.id !== id));
      }
    } catch (err) {
      console.error("Error deleting item:", err);
      setError("Failed to delete item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Load more appointments or notifications
  const loadMoreAppointments = () => {
    if (hasMoreAppointments) {
      setAppointmentsPage(prev => prev + 1);
    }
  };

  const loadMoreNotifications = () => {
    if (hasMoreNotifications) {
      setNotificationsPage(prev => prev + 1);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className={classes.container}>
      {/* Header Component */}
      <Header role="Patient" isLoggedIn={true} />

      <div className={classes.layout}>
        {/* Sidebar Component */}
        <Sidebar />

        {/* Main Content */}
        <div className={classes.main}>
          {/* Card: Upcoming Appointments */}
          <div className={classes.card}>
            <div>
              <h3>Upcoming Appointments: {appointments.length} Scheduled</h3>
            </div>
            {appointments.length > 0 && (
              <div>
                <span className={classes.date}>{appointments[0].timeSlot || "N/A"}</span>
                {/* Delete Button */}
                <button className={classes.delete__btn} onClick={() => handleDeleteItem(appointments[0].id, "appointment")}>Delete</button>
              </div>
            )}
            {hasMoreAppointments && (
              <button onClick={loadMoreAppointments}>Load More Appointments</button>
            )}
          </div>

          {/* Card: Medical History */}
          <div className={classes.card}>
            <div>
              <h3>Medical History: {medicalHistory.length} records</h3>
            </div>
          </div>

          {/* Card: Lab Results */}
          <div className={classes.card}>
            <div>
              <h3>Lab Results: {labResults.length} result(s)</h3>
            </div>
          </div>

          {/* Card: Notifications */}
          <div className={classes.card}>
            <div>
              <h3>Notifications: {notifications.length} unread</h3>
            </div>
            {notifications.length > 0 && (
              <div>
                <span className={classes.date}>
                  {new Date(notifications[0].scheduledtime).toLocaleDateString() || "N/A"}
                </span>
                {/* Delete Button */}
                <button className={classes.delete__btn} onClick={() => handleDeleteItem(notifications[0].id, "notification")}>Delete</button>
              </div>
            )}
            {hasMoreNotifications && (
              <button onClick={loadMoreNotifications}>Load More Notifications</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
