import React from "react";
import Header from "../../../Components/Header/Header";
import Sidebar from "../../../Components/Sidebar/Sidebar";
import classes from "./ValidatePayment.module.css";

const ValidatePayment = () => {
  return (
    <div>
      {/* Header Component */}
      <Header role="Receptionist" isLoggedIn={true} />

      <div className={classes.container}>
        {/* Sidebar Component */}
        <Sidebar />

        {/* Main Content */}
        <div className={classes.main}>
          <div className={classes.formContainer}>
            <form className={classes.form}>
              <div className={classes.formGroup}>
                <input
                  type="text"
                  placeholder="Enter Patient ID"
                  className={classes.input}
                />
              </div>
              <div className={classes.formGroup}>
                <input
                  type="text"
                  placeholder="Enter Payment Amount"
                  className={classes.input}
                />
              </div>
              <div className={classes.formButtons}>
                <button type="submit" className={`${classes.btn} ${classes.btnPrimary}`}>
                  Validate Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValidatePayment;
