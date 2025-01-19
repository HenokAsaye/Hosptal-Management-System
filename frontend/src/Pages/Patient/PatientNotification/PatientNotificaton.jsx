import React, { useEffect, useState } from "react";
import Header from "../../../Components/Header/Header";
import Sidebar from "../../../Components/Sidebar/Sidebar";
import classes from "./PatientNotification.module.css";
import { io } from "socket.io-client";
import apiClient from "../../../lib/util";
import Cookies from "js-cookie";

const socket = io("http://localhost:5000");

const PatientNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0); // Track unread notifications count
  const [patientId, setPatientId] = useState(null);

  useEffect(() => {
    const patientIdFromCookie = Cookies.get("userId");

    if (!patientIdFromCookie) {
      console.error("Patient ID is missing or invalid");
      return;
    }

    setPatientId(patientIdFromCookie);

    const fetchNotifications = async () => {
      try {
        const response = await apiClient.get(`/patient/patientnotification`, {
          params: { page: 1, limit: 10, patientId: patientIdFromCookie },
        });
        const patientNotifications = response.data.patientNotification;
        setNotifications(patientNotifications);
        // Set unread count based on notifications that are not marked as sent
        const unreadNotifications = patientNotifications.filter(
          (notification) => !notification.sent
        );
        setUnreadCount(unreadNotifications.length);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();

    socket.emit("join", patientIdFromCookie);

    socket.on("new_notification", (data) => {
      if (data.patientId === patientIdFromCookie) {
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          ...data.notifications,
        ]);
        // Update unread notifications count
        const unreadNotifications = data.notifications.filter(
          (notification) => !notification.sent
        );
        setUnreadCount((prevCount) => prevCount + unreadNotifications.length);
      }
    });

    return () => {
      socket.off("new_notification");
    };
  }, [patientId]);

  const markAsRead = () => {
    alert("All notifications marked as read!");
    // You can implement the backend API call to mark notifications as read if needed.
    setUnreadCount(0); // Reset unread notifications count
  };

  return (
    <div>
      <Header role="patient" isLoggedIn={true} />

      <div className={classes.container}>
        {/* Pass unreadCount to Sidebar */}
        <Sidebar unreadCount={unreadCount} />

        <div className={classes.main}>
          <div className={classes.notificationsHeader}>
            <h2>Notifications</h2>
            <button className={classes.markReadButton} onClick={markAsRead}>
              Mark as Read
            </button>
          </div>

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
