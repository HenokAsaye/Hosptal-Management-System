import React from "react";
import Header from "../../../Components/Header/Header";
import Sidebar from "../../../Components/Sidebar/Sidebar";
import classes from "./CancelAppointment.module.css";
import { FaSearch } from "react-icons/fa";

const CancelAppointment = () => {
  return (
    <div>
      {/* Header Component */}
      <Header role="Receptionist" isLoggedIn={true} />

      <div className={classes.container}>
        {/* Sidebar Component */}
        <Sidebar />

        {/* Main Content */}
        <div className={classes.main}>
          <h2 className={classes.title}>Cancel Appointment</h2>

          {/* Search Form */}
          <form className={classes.searchForm}>
            <input
              type="text"
              placeholder="Search By Appointment ID"
              className={classes.searchInput}
            />
            <button type="submit" className={classes.searchButton}>
              <FaSearch size={20} color="#4a90e2"/>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CancelAppointment;
