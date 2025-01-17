import React from "react";
import Header from "../../../Components/Header/Header";
import Sidebar from "../../../Components/Sidebar/Sidebar";
import classes from "./Report.module.css";

const Report = () => {
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
            <h2>Report</h2>
            <span>Admin's Name</span>
          </div>

          <p>Reports on user activities and systems performance.</p>

          {/* Form */}
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
                <option>User Activity</option>
                <option>System Performance</option>
                <option>Financial</option>
              </select>
            </div>

            <div className={classes.formButtons}>
              <button type="submit" className={classes.btnPrimary}>
                Generate Report
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default Report;
