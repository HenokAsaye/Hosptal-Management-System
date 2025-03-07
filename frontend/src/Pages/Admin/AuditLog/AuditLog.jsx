import React from "react";
import Header from "../../../Components/Header/Header";
import Sidebar from "../../../Components/Sidebar/Sidebar";
import classes from "./AuditLog.module.css";

const AuditLog = () => {
  return (
    <div className={classes.container}>
      {/* Header Component */}
      <Header role="Admin" isLoggedIn={true} />

      <div className={classes.layout}>
        {/* Sidebar Component */}
        <Sidebar />

        {/* Main Content */}
        <main className={classes.main}>
          <div className={classes.header}>
            <h2>Audit Log</h2>
            <span>Admin's Name</span>
          </div>
          <p>Monitor system activities and user actions.</p>
          <form className={classes.form}>
            <div className={classes.formGroup}>
              <label htmlFor="from-date">From:</label>
              <input type="date" id="from-date" />
            </div>
            <div className={classes.formGroup}>
              <label htmlFor="to-date">To:</label>
              <input type="date" id="to-date" />
            </div>
            <div className={classes.formGroup}>
              <label htmlFor="action-type">Select Action Type</label>
              <select id="action-type">
                <option>Login</option>
                <option>Data Export</option>
                <option>Permission Changes</option>
                <option>System Alerts</option>
                <option>Other Actions</option>
              </select>
            </div>
            <div className={classes.searchInput}>
              <input type="text" placeholder="Search by User" />
              <span className={classes.searchIcon}>🔍</span>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default AuditLog;
