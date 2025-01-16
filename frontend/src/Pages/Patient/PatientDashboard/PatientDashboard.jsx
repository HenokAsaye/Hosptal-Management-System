<<<<<<< HEAD
import React from "react";
import Header from "../../../Components/Header/Header";
import Sidebar from "../../../Components/Sidebar/Sidebar"; // Sidebar handles role-based links
import classes from "./PatientDashboard.module.css"; // CSS module for styling

const PatientDashboard = () => {
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
              <h3>Upcoming Appointments: 2 Scheduled</h3>
            </div>
            <div>
              <button>View Details</button>
              <span className={classes.date}>20/1/2025</span>
            </div>
          </div>

          {/* Card: Medical History */}
          <div className={classes.card}>
            <div>
              <h3>Medical History</h3>
            </div>
            <div>
              <button>View Records</button>
            </div>
          </div>

          {/* Card: Notifications */}
          <div className={classes.card}>
            <div>
              <h3>Notifications: 1 unread</h3>
            </div>
            <div>
              <button>Check Now</button>
              <span className={classes.date}>19/1/2025</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
=======
import React from 'react'

function PatientDashboard() {
  return <h1>Welcome to the Patient Dashboard!</h1>;
}

export default PatientDashboard
>>>>>>> master
