import React from "react";
import Header from "../../../Components/Header/Header"; // Adjust path as needed
import Sidebar from "../../../Components/Sidebar/Sidebar"; // Adjust path as needed
import classes from "./PharmaDashboard.module.css"; // Assuming CSS module for PharmaDashboard

const PharmaDashboard = () => {
  return (
    <div className={classes.container}>
      {/* Header Component */}
      <Header role="Pharmacist" isLoggedIn={true} />

      <div className={classes.layout}>
        {/* Sidebar Component */}
        <Sidebar />

        {/* Main Content */}
        <div className={classes.main}>
          <div className={classes.dashboardStats}>
            <div className={classes.card}>
              <h3>Total Stock: <span>14,569</span></h3>
            </div>
            <div className={classes.card}>
              <h3>
                Out of Stock: <span className={classes.outStock}>4</span>
              </h3>
            </div>
            <div className={classes.card}>
              <h3>
                Low Stock Alert: <span>15</span>
              </h3>
            </div>
            <div className={classes.card}>
              <h3>
                Expired Items: <span className={classes.expired}>6</span>
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmaDashboard;
