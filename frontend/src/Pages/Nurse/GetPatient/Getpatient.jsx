import React, { useState } from "react";
import Header from "../../../Components/Header/Header";
import Sidebar from "../../../Components/Sidebar/Sidebar";
import classes from "./Getpatient.module.css";
import { FaSearch } from "react-icons/fa";

const GetPatient = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    console.log("Searching for:", searchQuery);
    // Implement search functionality
  };

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
              placeholder="Search Patient by Name or ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="button" onClick={handleSearch}>
             <FaSearch size={18}/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetPatient;
