import React from "react";
import Header from "../../../Components/Header/Header";
import Sidebar from "../../../Components/Sidebar/Sidebar"; // Import the Sidebar component
import classes from "./Receptionist.module.css"; // Assuming you have a CSS module for this component

function ReceptionDashboard() {
  return (
    <div className={classes.container}>
      {/* Header Component */}
      <Header role="Receptionist" isLoggedIn={true} />
      
      <div className={classes.main}>
        
        <Sidebar />

        {/* Content Section */}
        <div className={classes.content}>
          <div className={classes.card}>
            <span>Today's Appointment:</span>
            <span className={classes.count}>45</span>
          </div>
          <div className={classes.card}>
            <span>Available Doctors:</span>
            <span className={classes.count}>5</span>
          </div>
          <div className={classes.card}>
            <span>Checked in Patients:</span>
            <span className={classes.count}>23</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReceptionDashboard;
