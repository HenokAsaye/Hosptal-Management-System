import React from "react";
import Header from "../../../Components/Header/Header"; 
import Sidebar from "../../../Components/Sidebar/Sidebar"; 
import classes from "./PatientData.module.css"; 
import { FaSearch } from "react-icons/fa";

const PatientData = () => {
  return (
    <div>
      {/* Header Component */}
      <Header role="Doctor" isLoggedIn={true} />

      <div className={classes.container}>
        {/* Sidebar Component */}
        <Sidebar />

        {/* Main Content */}
        <div className={classes.main}>
          {/* Patients Header */}
          <div className={classes.patientsHeader}>
            <h2>Search Patient by Name or ID</h2>
          </div>

          {/* Search Bar */}
          <div className={classes.searchBar}>
            <input type="text" placeholder="Search Patient by Name or ID" />
            <button type="button">
              <FaSearch size={24}/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientData;
