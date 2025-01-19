import React, { useState } from "react";
import Header from "../../../Components/Header/Header";
import Sidebar from "../../../Components/Sidebar/Sidebar"; 
import apiClient from "../../../lib/util";
import classes from "./LabDashboard.module.css"; // New CSS module for styling

const LabDashboard = () => {
  const [patientEmail, setPatientEmail] = useState("");
  const [testName, setTestName] = useState("");
  const [resultDetails, setResultDetails] = useState("");
  const [technicianId, setTechnicianId] = useState("");
  const [approvedBy, setApprovedBy] = useState("");
  const [isViewAllowed, setIsViewAllowed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await apiClient.post("/lab/createlabResult", {
        patientEmail,
        testName,
        resultDetails,
        technicianId,
        approvedBy,
        isViewAllowed
      });

      if (response.data.success) {
        setMessage("Lab result added successfully!");
      }
    } catch (error) {
      console.error("Error submitting lab result:", error);
      setMessage("Failed to add lab result.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={classes.container}>
      {/* Header Component */}
      <Header role="Technician" isLoggedIn={true} />

      <div className={classes.layout}>
        {/* Sidebar Component */}
        <Sidebar />

        {/* Main Content */}
        <div className={classes.main}>
          <h2>Add Lab Result</h2>
          <form onSubmit={handleSubmit} className={classes.form}>
            <div className={classes.formGroup}>
              <label>Patient Email</label>
              <input 
                type="email" 
                value={patientEmail} 
                onChange={(e) => setPatientEmail(e.target.value)} 
                required 
              />
            </div>
            <div className={classes.formGroup}>
              <label>Test Name</label>
              <input 
                type="text" 
                value={testName} 
                onChange={(e) => setTestName(e.target.value)} 
                required 
              />
            </div>
            <div className={classes.formGroup}>
              <label>Result Details</label>
              <textarea 
                value={resultDetails} 
                onChange={(e) => setResultDetails(e.target.value)} 
                required 
              />
            </div>
            <div className={classes.formGroup}>
              <label>Technician ID</label>
              <input 
                type="text" 
                value={technicianId} 
                onChange={(e) => setTechnicianId(e.target.value)} 
                required 
              />
            </div>
            <div className={classes.formGroup}>
              <label>Approved By</label>
              <input 
                type="text" 
                value={approvedBy} 
                onChange={(e) => setApprovedBy(e.target.value)} 
                required 
              />
            </div>
            <div className={classes.formGroup}>
              <label>Allow Patient to View Result</label>
              <input 
                type="checkbox" 
                checked={isViewAllowed} 
                onChange={(e) => setIsViewAllowed(e.target.checked)} 
              />
            </div>
            <button type="submit" className={classes.submitBtn}>
              {loading ? "Submitting..." : "Submit Lab Result"}
            </button>
          </form>
          {message && <p className={classes.message}>{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default LabDashboard;
