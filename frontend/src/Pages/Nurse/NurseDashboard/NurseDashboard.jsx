import React from "react";
import Header from "../../../Components/Header/Header";
import Sidebar from "../../../Components/Sidebar/Sidebar";
import classes from "./NurseDashboard.module.css";

const NurseDashboard = () => {
  const nurseName = "Nurse Name"; // Replace with dynamic data
  const currentShift = "Morning";
  const activePatients = 23;

  return (
    <div className={classes.container}>
      <Header role="Nurse" isLoggedIn={true} />

      <div className={classes.layout}>
        <Sidebar />

        <div className={classes.main}>
          {/* Nurse Info */}
          <div className={classes.card}>
            <h3>Current Shift:</h3>
            <span>{currentShift}</span>
          </div>

          <div className={classes.card}>
            <h3>Active Patients:</h3>
            <span>{activePatients}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NurseDashboard;
