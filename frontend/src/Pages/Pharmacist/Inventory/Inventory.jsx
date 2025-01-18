import React from "react";
import Header from "../../../Components/Header/Header";
import Sidebar from "../../../Components/Sidebar/Sidebar"; // Sidebar will handle role-based links
import classes from "./Inventory.module.css"; // CSS module for Inventory Report

const Inventory = () => {
  return (
    <div className={classes.container}>
      {/* Header Component */}
      <Header role="Pharmacist" isLoggedIn={true} />

      <div className={classes.layout}>
        {/* Sidebar Component */}
        <Sidebar />

        {/* Main Content */}
        <div className={classes.main}>
          <h2>Inventory Report</h2>
          <table className={classes.medicationTable}>
            <thead>
              <tr>
                <th>Medication Name</th>
                <th>Quantity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Albuterol</td>
                <td>100</td>
                <td>Not Expired</td>
              </tr>
              <tr>
                <td>Gabapentin</td>
                <td>0</td>
                <td>Expired</td>
              </tr>
              <tr>
                <td>Aspirin</td>
                <td>334</td>
                <td>Expired</td>
              </tr>
              <tr>
                <td>Diphenhydramine</td>
                <td>1935</td>
                <td>Not Expired</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
