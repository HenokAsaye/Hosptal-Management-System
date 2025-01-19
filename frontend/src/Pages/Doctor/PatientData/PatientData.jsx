import React, { useState } from "react";
import Header from "../../../Components/Header/Header"; 
import Sidebar from "../../../Components/Sidebar/Sidebar"; 
import classes from "./PatientData.module.css"; 
import { FaSearch } from "react-icons/fa";
import apiClient from "../../../lib/util"; // To make API calls

const PatientData = () => {
  const [searchQuery, setSearchQuery] = useState(""); // Store search input
  const [patientData, setPatientData] = useState([]); // Store fetched patient data
  const [error, setError] = useState(""); // For error handling

  // Function to handle the search
 const handleSearch = async () => {
  try {
    const response = await apiClient.get(`/doctor/getpatientName`, {
      params: { name: searchQuery } // Sending name as a query parameter
    });
    setPatientData(response.data.data); // Set the fetched patient data
    setError(""); // Clear any previous errors
  } catch (err) {
    setError("Patient not found or there was an error."); // Handle error
    setPatientData([]); // Reset patient data on error
  }
};


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
            <input 
              type="text" 
              placeholder="Search Patient by Name or ID" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} // Update search input
            />
            <button type="button" onClick={handleSearch}>
              <FaSearch size={24} />
            </button>
          </div>

          {/* Display error */}
          {error && <div className="error">{error}</div>}

          {/* Display patient data in table format */}
          {patientData.length > 0 && (
            <div className="patientDetails">
              <h3>Patient Details:</h3>
              <table className={classes.patientTable}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Contact</th>
                    <th>Medical History</th>
                  </tr>
                </thead>
                <tbody>
                  {patientData.map((patient, index) => (
                    <tr key={index}>
                      <td>{patient.name}</td>
                      <td>{patient.age || "N/A"}</td>
                      <td>{patient.contact || "N/A"}</td>
                      <td>
                        {patient.medicalHistory?.length > 0 ? (
                          patient.medicalHistory.map((history, idx) => (
                            <div key={idx}>
                              <strong>{history.diagnosis}</strong>: {history.treatment} 
                            </div>
                          ))
                        ) : "No medical history available"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientData;
