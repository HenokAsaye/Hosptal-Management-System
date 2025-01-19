import React, { useState } from "react";
import Header from "../../../Components/Header/Header";
import Sidebar from "../../../Components/Sidebar/Sidebar";
import classes from "./InviteAdmin.module.css"; // CSS module for InviteAdmin
import apiClient from "../../../lib/util"; // Importing the API client

const InviteAdmin = () => {
  const [email, setEmail] = useState(""); // State for admin email
  const [name, setName] = useState(""); // State for admin name
  const [password, setPassword] = useState(""); // State for admin password
  const [message, setMessage] = useState(""); // State for success or error message
  const [loading, setLoading] = useState(false); // State for loading indicator

  const handleInvite = async () => {
    if (!email.trim() || !name.trim() || !password.trim()) {
      setMessage("Please fill in all the fields.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await apiClient.post("/admin/inviteadmin", {
        email,
        name,
        password,
      });

      setMessage(response.data.message || "Invitation sent successfully!");
      setEmail("");
      setName("");
      setPassword("");
    } catch (error) {
      console.error("Error sending invite:", error);
      setMessage(
        error.response?.data?.message || "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={classes.container}>
      {/* Header Component */}
      <Header role="Admin" isLoggedIn={true} />

      <div className={classes.layout}>
        {/* Sidebar Component */}
        <Sidebar />

        {/* Main Content */}
        <div className={classes.main}>
          <div className={classes.card}>
            <h2 className={classes.title}>Invite Admin</h2>

            <form
              onSubmit={(e) => e.preventDefault()}
              className={classes.form}
            >
              <div className={classes.formGroup}>
                <label htmlFor="admin-name" className={classes.label}>
                  Admin Name
                </label>
                <input
                  type="text"
                  id="admin-name"
                  className={classes.input}
                  placeholder="Enter admin name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className={classes.formGroup}>
                <label htmlFor="admin-email" className={classes.label}>
                  Admin Email
                </label>
                <input
                  type="email"
                  id="admin-email"
                  className={classes.input}
                  placeholder="Enter admin email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className={classes.formGroup}>
                <label htmlFor="admin-password" className={classes.label}>
                  Admin Password
                </label>
                <input
                  type="password"
                  id="admin-password"
                  className={classes.input}
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="button"
                onClick={handleInvite}
                className={classes.button}
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Invitation"}
              </button>
            </form>

            {/* Display Message */}
            {message && <p className={classes.message}>{message}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteAdmin;
