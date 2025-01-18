import React from "react";
import Header from "../../../Components/Header/Header";
import Sidebar from "../../../Components/Sidebar/Sidebar";
import classes from "./CheckMedication.module.css";
import { FaSearch } from "react-icons/fa";

const CheckMedication = () => {
  return (
    <div className={classes.container}>
      <Header role="Nurse" isLoggedIn={true} />

      <div className={classes.layout}>
        <Sidebar />

        <div className={classes.main}>
          {/* Search Bar */}
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

export default CheckMedication;
