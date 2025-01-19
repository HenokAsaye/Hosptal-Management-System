import React, { useState } from "react";
import apiClient from "../../../lib/util";
import Header from "../../../Components/Header/Header";
import Sidebar from "../../../Components/Sidebar/Sidebar";
import classes from "./DoctorMedicalHistory.module.css";
import { FaSearch } from "react-icons/fa";

const DoctorMedicalHistory = () => {
  const [searchQuery, setSearchQuery] = useState(""); // Search input (patient name)
  const [patients, setPatients] = useState([]); // List of patients matching search
  const [selectedPatientId, setSelectedPatientId] = useState(""); // Selected patient ID
  const [patientMedicalHistory, setPatientMedicalHistory] = useState(null); // Medical history data
  const [isEditing, setIsEditing] = useState(false); // Toggle edit form
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error message
  const [diagnosis, setDiagnosis] = useState(""); // New diagnosis
  const [treatment, setTreatment] = useState(""); // New treatment
  const [note, setNote] = useState(""); // New note

  // Search patients by name
  const handleSearch = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await apiClient.get(`/doctor/getpatientName`, {
        params: { name: searchQuery },
      });

      if (response.data.success) {
        setPatients(response.data.data); // Set matched patients
        setPatientMedicalHistory(null); // Reset medical history
      } else {
        setError(response.data.message || "No patients found.");
        setPatients([]);
      }
    } catch (err) {
      setError("An error occurred while searching for patients.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch medical history for the selected patient
  const fetchMedicalHistory = async (patientId) => {
    setLoading(true);
    setError("");
    try {
      const response = await apiClient.get(`/doctor/getpatientmedicalhistory`, {
        params: { patientId },
      });

      if (response.data.success) {
        setPatientMedicalHistory(response.data.data); // Set medical history
      } else {
        setError(response.data.message || "No medical history available.");
        setPatientMedicalHistory(null);
      }
    } catch (err) {
      setError("An error occurred while fetching medical history.");
      setPatientMedicalHistory(null);
    } finally {
      setLoading(false);
    }
  };

  // Save new medical history
  const handleSaveMedicalHistory = async () => {
    setLoading(true);
    try {
      const response = await apiClient.put(`/doctor/editmedicalhistory/${selectedPatientId}`, {
        diagnosis,
        treatment,
        note,
      });

      if (response.data.success) {
        alert("Medical history updated successfully");
        setPatientMedicalHistory((prev) => [...prev, response.data.data]); // Update history
        setDiagnosis("");
        setTreatment("");
        setNote("");
        setIsEditing(false);
      } else {
        alert(response.data.message || "Failed to update medical history.");
      }
    } catch (error) {
      alert("An error occurred while updating medical history.");
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
            <h2>Patient Medical History</h2>
            <div className={classes.search}>
              <input
                type="text"
                placeholder="Search by Patient Name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button onClick={handleSearch} disabled={loading}>
                {loading ? "Loading..." : <FaSearch size={18} />}
              </button>
            </div>
          </div>

          {error && <div className={classes.error}>{error}</div>}

          {patients.length > 0 && (
            <div className={classes.patientsList}>
              <h3>Search Results</h3>
              <ul>
                {patients.map((patient) => (
                  <li key={patient._id}>
                    <span>{patient.name}</span>
                    <button
                      onClick={() => {
                        setSelectedPatientId(patient._id);
                        fetchMedicalHistory(patient._id);
                      }}
                    >
                      View Medical History
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {patientMedicalHistory && (
            <div className={classes.historySection}>
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
              <button onClick={() => setIsEditing(true)}>Manage History</button>
            </div>
          )}

          {isEditing && (
            <div className={classes.form}>
              <h3>Edit Medical History</h3>
              <div>
                <label>Diagnosis</label>
                <input
                  type="text"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Treatment</label>
                <input
                  type="text"
                  value={treatment}
                  onChange={(e) => setTreatment(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Note</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  required
                />
              </div>
              <button onClick={handleSaveMedicalHistory} disabled={loading}>
                {loading ? "Saving..." : "Save Medical History"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorMedicalHistory;
