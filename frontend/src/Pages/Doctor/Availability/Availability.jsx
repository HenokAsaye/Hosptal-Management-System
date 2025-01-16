import React from "react";
import Header from "../../../Components/Header/Header";
import Sidebar from "../../../Components/Sidebar/Sidebar";
import classes from "./Availability.module.css";

const Availability = () => {
  return (
    <div>
      {/* Header Component */}
      <Header role="Doctor" isLoggedIn={true} />

      <div className={classes.container}>
        {/* Sidebar Component */}
        <Sidebar />

        {/* Main Content */}
        <div className={classes.main}>
          <div className={classes.availabilityHeader}>
            <h2>Set Availability</h2>
          </div>

          <form className={classes.availabilityForm}>
            <div className={classes.formGroup}>
              <label htmlFor="date">Date</label>
              <input type="date" id="date" name="date" />
            </div>
            <div className={classes.formGroup}>
              <label htmlFor="time-range">Time Range</label>
              <select id="time-range" name="time-range">
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
              </select>
            </div>
            <div className={classes.formButtons}>
              <button type="submit" className={classes.saveButton}>
                Save
              </button>
              <button type="button" className={classes.editButton}>
                Edit
              </button>
              <button type="button" className={classes.deleteButton}>
                Delete
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Availability;
