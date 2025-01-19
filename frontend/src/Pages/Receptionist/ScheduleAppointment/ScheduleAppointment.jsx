import React, { useState } from "react";
import Header from "../../../Components/Header/Header";
import Sidebar from "../../../Components/Sidebar/Sidebar";
import classes from "./ScheduleAppointment.module.css";
import apiClient from "../../../lib/util";

const ScheduleAppointment = () => {
  const [formData, setFormData] = useState({
    patientId: "",
    doctorName: "", // Updated to match backend
    date: "",
    time: "",
    reason: "",
  });
  const [responseMessage, setResponseMessage] = useState("");
  const [error, setError] = useState("");

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Combine date and time into a single timeSlot
    const timeSlot = `${formData.date}T${formData.time}`;

    try {
      const response = await apiClient.post("/reception/scheduleappointment", {
        patientId: formData.patientId,
        doctorName: formData.doctorName,
        reason: formData.reason,
        timeSlot,
      });

      // Show success message and clear form
      setResponseMessage(response.data.message || "Appointment created successfully!");
      setError("");
      setFormData({
        patientId: "",
        doctorName: "",
        date: "",
        time: "",
        reason: "",
      });

      // Clear message after 3 seconds
      setTimeout(() => {
        setResponseMessage("");
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to schedule appointment.");
      setResponseMessage("");
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
        <div className={classes.content}>
          <h2 className={classes.pageTitle}>Schedule Appointment</h2>

          {/* Alert Messages */}
          {responseMessage && (
            <div className={classes.successMessage}>{responseMessage}</div>
          )}
          {error && <div className={classes.errorMessage}>{error}</div>}

          {/* Appointment Form */}
          <form className={classes.form} onSubmit={handleSubmit}>
            <div className={classes.formGroup}>
              <label htmlFor="patient-id">Patient ID</label>
              <input
                type="text"
                id="patient-id"
                name="patientId"
                placeholder="Enter Patient ID"
                className={classes.input}
                value={formData.patientId}
                onChange={handleChange}
                required
              />
            </div>
            <div className={classes.formGroup}>
              <label htmlFor="date">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                className={classes.input}
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            <div className={classes.formGroup}>
              <label htmlFor="time">Time</label>
              <input
                type="time"
                id="time"
                name="time"
                className={classes.input}
                value={formData.time}
                onChange={handleChange}
                required
              />
            </div>
            <div className={classes.formGroup}>
              <label htmlFor="doctor-name">Doctor Name</label>
              <input
                type="text"
                id="doctor-name"
                name="doctorName"
                placeholder="Enter Doctor Name"
                className={classes.input}
                value={formData.doctorName}
                onChange={handleChange}
                required
              />
            </div>
            <div className={classes.formGroup}>
              <label htmlFor="reason">Reason</label>
              <textarea
                id="reason"
                name="reason"
                placeholder="Enter Reason for Appointment"
                className={classes.input}
                value={formData.reason}
                onChange={handleChange}
                required
              />
            </div>
            <div className={classes.formButtons}>
              <button type="submit" className={classes.submitButton}>
                Schedule Appointment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ScheduleAppointment;
