import React from "react";
import Header from "../../../Components/Header/Header"; 
import Sidebar from "../../../Components/Sidebar/Sidebar"; 
import classes from "./DoctorAppointments.module.css"; 

const DoctorAppointments = () => {
  return (
    <div>
      {/* Header Component */}
      <Header role="Doctor" isLoggedIn={true} />

      <div className={classes.container}>
        {/* Sidebar Component */}
        <Sidebar />

        {/* Main Content */}
        <div className={classes.main}>
          <div className={classes.appointmentHeader}>
            <h2>Appointments</h2>
          </div>

          {/* Appointment List */}
          <div className={classes.appointmentList}>
            <div className={classes.appointmentItem}>
              <div className={classes.date}>Dec 10, 2024</div>
              <p>10:00 AM</p>
              <p>Patient name - John Doe</p>
              <p>For: Diabetes management</p>
            </div>
            <div className={classes.appointmentItem}>
              <div className={classes.date}>Dec 10, 2024</div>
              <p>11:00 AM</p>
              <p>Patient name - Jane Smith</p>
              <p>For: Hypertension management</p>
            </div>
            <div className={classes.appointmentItem}>
              <div className={classes.date}>Dec 10, 2024</div>
              <p>12:00 PM</p>
              <p>Patient name - Alex Johnson</p>
              <p>For: General checkup</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorAppointments;
