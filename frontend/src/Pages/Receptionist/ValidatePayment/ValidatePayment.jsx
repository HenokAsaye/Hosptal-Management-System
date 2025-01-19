import React, { useState } from "react";
import Header from "../../../Components/Header/Header";
import Sidebar from "../../../Components/Sidebar/Sidebar";
import classes from "./ValidatePayment.module.css";
import apiClient from "../../../lib/util";

const ValidatePayment = () => {
  const [patientId, setPatientId] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send request to backend
      const response = await apiClient.post(`/reception/verifypayment`, {
        patientId: patientId.trim(),
      });

      // Display success message
      setMessage(response.data.message);
      setError(""); // Clear any previous errors
    } catch (err) {
      // Display error message
      setError(err.response?.data?.message || "An error occurred");
      setMessage(""); // Clear any previous messages
    }
  };

  return (
    <div>
      {/* Header Component */}
      <Header role="Receptionist" isLoggedIn={true} />

      <div className={classes.container}>
        {/* Sidebar Component */}
        <Sidebar />

        {/* Main Content */}
        <div className={classes.main}>
          <div className={classes.formContainer}>
            <form className={classes.form} onSubmit={handleFormSubmit}>
              <div className={classes.formGroup}>
                <input
                  type="text"
                  placeholder="Enter Patient ID"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className={classes.input}
                  required
                />
              </div>
              <div className={classes.formGroup}>
                <input
                  type="text"
                  placeholder="Enter Payment Amount"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className={classes.input}
                  required
                />
              </div>
              <div className={classes.formButtons}>
                <button
                  type="submit"
                  className={`${classes.btn} ${classes.btnPrimary}`}
                >
                  Validate Payment
                </button>
              </div>
            </form>

            {/* Display Messages */}
            {message && (
              <p className={`${classes.message} ${classes.success}`}>
                {message}
              </p>
            )}
            {error && (
              <p className={`${classes.message} ${classes.error}`}>
                {error}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValidatePayment;
