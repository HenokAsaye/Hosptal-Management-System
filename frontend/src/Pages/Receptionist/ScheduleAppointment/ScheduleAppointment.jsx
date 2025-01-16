import React from "react";
import Header from "../../../Components/Header/Header";
import Sidebar from "../../../Components/Sidebar/Sidebar";
import classes from "./ScheduleAppointment.module.css";

const ScheduleAppointment = () => {
  return (
    <div>
      {/* Header Component */}
      <Header role="Receptionist" isLoggedIn={true} />

      <div className={classes.container}>
        {/* Sidebar Component */}
        <Sidebar />

        {/* Main Content */}
        <div className={classes.content}>
          <h2 className={classes.pageTitle}>Schedule Appointment</h2>

          {/* Appointment Form */}
          <form className={classes.form}>
            <div className={classes.formGroup}>
              <label htmlFor="patient-id">Patient ID</label>
              <input
                type="text"
                id="patient-id"
                placeholder="Enter Patient ID"
                className={classes.input}
              />
            </div>
            <div className={classes.formGroup}>
              <label htmlFor="date">Date</label>
              <input
                type="date"
                id="date"
                className={classes.input}
              />
            </div>
            <div className={classes.formGroup}>
              <label htmlFor="time">Time</label>
              <input
                type="time"
                id="time"
                className={classes.input}
              />
            </div>
            <div className={classes.formGroup}>
              <label htmlFor="doctor-id">Doctor ID</label>
              <input
                type="text"
                id="doctor-id"
                placeholder="Enter Doctor ID"
                className={classes.input}
              />
            </div>
            <div className={classes.formButtons}>
              <button type="submit" className={classes.submitButton}>
                Schedule Appointment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ScheduleAppointment;
