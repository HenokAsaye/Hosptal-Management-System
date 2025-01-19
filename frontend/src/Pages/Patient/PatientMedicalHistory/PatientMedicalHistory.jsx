import React, { useState } from "react";
import apiClient from "../../../lib/util";
import Header from "../../../Components/Header/Header";
import Sidebar from "../../../Components/Sidebar/Sidebar";
import classes from "./PatientMedicalHistory.module.css";
import { FaSearch } from "react-icons/fa";

const PatientMedicalHistory = () => {
  const [searchQuery, setSearchQuery] = useState(""); // Search input
  const [patientMedicalHistory, setPatientMedicalHistory] = useState(null); // Medical history data
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error message

  // Fetch medical history by patient ID
  const handleSearch = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await apiClient.get(`/patient/checkmedicalhistory`, {
        params: { patientId: searchQuery },
      });

      setPatientMedicalHistory(response.data.MedicalHistory); // Set fetched data
    } catch (err) {
      setError("No medical history available.");
      setPatientMedicalHistory(null); // Reset on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header role="Patient" isLoggedIn={true} />
      <div className={classes.container}>
        <Sidebar />
        <div className={classes.main}>
          <div className={classes.header}>
            <h2>Your Medical History</h2>
            <div className={classes.search}>
              <input
                type="text"
                placeholder="Enter Patient ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button onClick={handleSearch} disabled={loading}>
                {loading ? "Loading..." : <FaSearch size={18} />}
              </button>
            </div>
          </div>

          {error && <div className={classes.error}>{error}</div>}

          {patientMedicalHistory && (
            <div>
              <h3>Medical History</h3>
              {patientMedicalHistory.length === 0 ? (
                <p>No medical history found.</p>
              ) : (
                patientMedicalHistory.map((history, index) => (
                  <div key={index} className={classes.historyItem}>
                    <p><strong>Diagnosis:</strong> {history.diagnosis}</p>
                    <p><strong>Treatment:</strong> {history.treatment}</p>
                    <p><strong>Note:</strong> {history.note}</p>
                    <p><strong>Added On:</strong> {new Date(history.addedAt).toLocaleString()}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientMedicalHistory;
