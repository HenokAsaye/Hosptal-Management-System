import React, { useEffect, useState } from "react";
import Header from "../../../Components/Header/Header";
import Sidebar from "../../../Components/Sidebar/Sidebar";
import classes from "./PatientNotification.module.css";
import { io } from "socket.io-client";
import apiClient from "../../../lib/util";  // Import the API client
import Cookies from "js-cookie";  // Import js-cookie to manage cookies

const socket = io("http://localhost:5000"); // Connect to the backend socket server

const PatientNotification = () => {
  const [notifications, setNotifications] = useState([]); // Store notifications in state
  const [patientId, setPatientId] = useState(null); // State to store the patient ID

  useEffect(() => {
    // Get patientId from cookies
    const patientIdFromCookie = Cookies.get("userId");

    if (!patientIdFromCookie) {
      console.error("Patient ID is missing or invalid");
      return;
    }

    setPatientId(patientIdFromCookie); // Set the patientId in state

    // Fetch existing notifications from the backend when the component mounts
    const fetchNotifications = async () => {
      try {
        const response = await apiClient.get(`/patient/patientnotification`, {
          params: { page: 1, limit: 10, patientId: patientIdFromCookie }, // Correct API request structure
        });
        setNotifications(response.data.patientNotification);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    // Fetch notifications on first render
    fetchNotifications();

    // Join the socket room for this patient
    socket.emit("join", patientIdFromCookie);

    // Listen for new notifications from the server
    socket.on("new_notification", (data) => {
      if (data.patientId === patientIdFromCookie) {
        // Update notifications when a new one arrives
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          ...data.notifications,
        ]);
      }
    });

    // Cleanup the socket event listener when the component unmounts
    return () => {
      socket.off("new_notification");
    };
  }, [patientId]); // Add patientId as a dependency to trigger re-run when it changes

  const markAsRead = () => {
    alert("All notifications marked as read!");
    // You can implement the backend API call to mark notifications as read if needed.
  };

  return (
    <div>
      {/* Header Component */}
      <Header role="patient" isLoggedIn={true} />

      <div className={classes.container}>
        {/* Sidebar Component */}
        <Sidebar />

        {/* Main Content */}
        <div className={classes.main}>
          <div className={classes.notificationsHeader}>
            <h2>Notifications</h2>
            <button className={classes.markReadButton} onClick={markAsRead}>
              Mark as Read
            </button>
          </div>

          {/* Notification List */}
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div className={classes.notificationItem} key={notification.id}>
                <p>
                  <span className={classes.time}>{notification.time}</span>
                </p>
                <p>
                  <strong>* Message:</strong> {notification.message}
                </p>
              </div>
            ))
          ) : (
            <p>No notifications yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientNotification;
