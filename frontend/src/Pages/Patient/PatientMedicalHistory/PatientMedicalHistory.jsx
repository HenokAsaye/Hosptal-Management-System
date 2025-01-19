import React, { useState, useEffect } from "react";
import apiClient from "../../../lib/util";
import Header from "../../../Components/Header/Header";
import Sidebar from "../../../Components/Sidebar/Sidebar";
import classes from "./PatientMedicalHistory.module.css";
import { FaSearch } from "react-icons/fa";
import Cookies from "js-cookie"; // Importing js-cookie to manage cookies

const PatientMedicalHistory = () => {
  const [patientMedicalHistory, setPatientMedicalHistory] = useState(null); // Medical history data
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error message
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [totalPages, setTotalPages] = useState(1); // Total pages for pagination

  // Fetch medical history by patient ID
  const fetchMedicalHistory = async (page = 1) => {
    const patientId = Cookies.get("userId"); // Extract patientId from the cookie
    if (!patientId) {
      setError("Patient ID is missing. Please log in again.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await apiClient.get(`/patient/checkmedicalhistory`, {
        params: { patientId, page },
      });

      const { MedicalHistory, currentPage, totalPages } = response.data;
      setPatientMedicalHistory(MedicalHistory);
      setCurrentPage(currentPage);
      setTotalPages(totalPages);
    } catch (err) {
      setError("Unable to fetch medical history. Please try again.");
      setPatientMedicalHistory(null); // Reset on error
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchMedicalHistory();
  }, []);

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchMedicalHistory(newPage);
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
                    <p>
                      <strong>Diagnosis:</strong> {history.diagnosis}
                    </p>
                    <p>
                      <strong>Treatment:</strong> {history.treatment}
                    </p>
                    <p>
                      <strong>Note:</strong> {history.note}
                    </p>
                    <p>
                      <strong>Added On:</strong>{" "}
                      {new Date(history.addedAt).toLocaleString()}
                    </p>
                  </div>
                ))
              )}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className={classes.pagination}>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientMedicalHistory;
