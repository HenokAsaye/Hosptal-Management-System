import React from "react";
import Header from "../../../Components/Header/Header";
import Sidebar from "../../../Components/Sidebar/Sidebar";
import classes from "./MedicationAvailability.module.css"; // CSS module for the page
import { FaSearch } from "react-icons/fa";

const MedicationAvailability = () => {
  return (
    <div className={classes.container}>
      {/* Header Component */}
      <Header role="Doctor" isLoggedIn={true} />

      <div className={classes.layout}>
        {/* Sidebar Component */}
        <Sidebar />

        {/* Main Content */}
        <div className={classes.main}>
          <div className={classes.header}>
            <h2>Search Medication By Name</h2>
          </div>
          <div className={classes.searchBar}>
            <input
              type="text"
              placeholder="Search Medication by Name"
              className={classes.searchInput}
            />
            <button type="button" className={classes.searchButton}>
              <FaSearch size={18}/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicationAvailability;
