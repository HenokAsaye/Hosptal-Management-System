import React, { useState } from "react";
import apiClient from "../../../lib/util";
import Header from "../../../Components/Header/Header";
import Sidebar from "../../../Components/Sidebar/Sidebar";
import classes from "./DoctorLabResults.module.css";
import { FaSearch } from "react-icons/fa";

const DoctorLabResults = () => {
  const [patientEmail, setPatientEmail] = useState(""); // Input for patient email
  const [testName, setTestName] = useState(""); // Input for test name
  const [labResults, setLabResults] = useState([]); // Retrieved lab results
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error message

  // Fetch lab results based on patient email and test name
  const handleSearch = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await apiClient.get("/doctor/getpatientlabresult", {
        params: { patientEmail, testName },
      });

      if (response.data.success) {
        setLabResults(response.data.data); // Set the lab results
      } else {
        setError(response.data.message || "No lab results found.");
        setLabResults([]);
      }
    } catch (err) {
      setError("An error occurred while fetching lab results.");
      setLabResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header role="Doctor" isLoggedIn={true} />
      <div className={classes.container}>
        <Sidebar />
        <div className={classes.main}>
          <div className={classes.header}>
            <h2>Patient Lab Results</h2>
            <div className={classes.search}>
              <input
                type="email"
                placeholder="Enter Patient Email"
                value={patientEmail}
                onChange={(e) => setPatientEmail(e.target.value)}
              />
              <input
                type="text"
                placeholder="Enter Test Name"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
              />
              <button onClick={handleSearch} disabled={loading}>
                {loading ? "Loading..." : <FaSearch size={18} />}
              </button>
            </div>
          </div>

          {error && <div className={classes.error}>{error}</div>}

          {labResults.length > 0 && (
            <div className={classes.resultsSection}>
              <h3>Lab Results</h3>
              {labResults.map((result, index) => (
                <div key={index} className={classes.resultItem}>
                  <p><strong>Test Name:</strong> {result.testName}</p>
                  <p><strong>Details:</strong> {result.details}</p>
                  <p><strong>Technician:</strong> {result.technicianId?.name || "N/A"}</p>
                  <p><strong>Approved By:</strong> {result.approvedBy?.name || "N/A"}</p>
                  <p><strong>Added On:</strong> {new Date(result.addedAt).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorLabResults;
