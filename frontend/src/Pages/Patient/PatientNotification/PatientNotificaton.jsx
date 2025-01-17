import React from "react";
import Header from "../../../Components/Header/Header"; 
import Sidebar from "../../../Components/Sidebar/Sidebar"; 
import classes from "./PatientNotification.module.css"; 

const PatientNotification = () => {
  const notifications = [
    {
      id: 1,
      time: "10 mins ago",
      message: "Appointment confirmed for Patient X on [Date].",
    },
    {
      id: 2,
      time: "30 mins ago",
      message: "Follow-up scheduled with Patient Y on [Date].",
    },
  ];

  const markAsRead = () => {
    alert("All notifications marked as read!");
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
          {notifications.map((notification) => (
            <div className={classes.notificationItem} key={notification.id}>
              <p>
                <span className={classes.time}>{notification.time}</span>
              </p>
              <p>
                <strong>* Message:</strong> {notification.message}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientNotification;
