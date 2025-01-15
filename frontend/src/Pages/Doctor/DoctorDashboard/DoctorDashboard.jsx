import React from "react";
import Header from "../../../Components/Header/Header";
import Sidebar from "../../../Components/Sidebar/Sidebar"; // Assuming Sidebar handles role-based links
import classes from "./DoctorDashboard.module.css"; // Assuming CSS module for DoctorDashboard

const DoctorDashboard = () => {
  return (
    <div className={classes.container}>
      {/* Header Component */}
      <Header role="Doctor" isLoggedIn={true} />

      <div className={classes.layout}>
        {/* Sidebar Component */}
        <Sidebar />

        {/* Main Content */}
        <div className={classes.main}>
          {/* Card: Upcoming Appointments */}
          <div className={classes.card}>
            <div>
              <h3>Upcoming Appointments: 5 Scheduled</h3>
            </div>
            <div>
              <button>Check</button>
              <span className={classes.date}>12/4/2024</span>
            </div>
          </div>

          {/* Card: Patient Today */}
          <div className={classes.card}>
            <div>
              <h3>Patient Today: 3</h3>
            </div>
            <div>
              <button>View</button>
              <span className={classes.date}>12/4/2024</span>
            </div>
          </div>

          {/* Card: Notifications */}
          <div className={classes.card}>
            <div>
              <h3>Notifications: 2 unread</h3>
            </div>
            <div>
              <button>Read</button>
              <span className={classes.date}>13/4/2024</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
