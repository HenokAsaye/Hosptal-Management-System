import React from "react";
import { Link } from "react-router-dom"; // Import Link from React Router
import Header from "../../../Components/Header/Header";
import Sidebar from "../../../Components/Sidebar/Sidebar"; // Assuming Sidebar handles role-based links
import classes from "./AdminDashboard.module.css"; // CSS module for AdminDashboard

const AdminDashboard = () => {
  return (
    <div className={classes.container}>
      {/* Header Component */}
      <Header role="Admin" isLoggedIn={true} />

      <div className={classes.layout}>
        {/* Sidebar Component */}
        <Sidebar />

        {/* Main Content */}
        <div className={classes.main}>
          <h2>Admin Dashboard</h2>

          {/* Card: Manage Permissions */}
          <div className={classes.card}>
            <p>Users Active: 15</p>
            <Link to="/manage-users">
              <button>Manage Permissions</button>
            </Link>
          </div>

          {/* Card: Audit Logs */}
          <div className={classes.card}>
            <p>Audit Log Entries: 87</p>
            <Link to="/audit-logs">
              <button>View Audit Logs</button>
            </Link>
          </div>

          {/* Card: Reports */}
          <div className={classes.card}>
            <p>Reports Generated: 18</p>
            <Link to="/generate-reports">
              <button>Generate Reports</button>
            </Link>
          </div>

          {/* Card: System Alerts */}
          <div className={classes.card}>
            <p>System Alert: 3</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
