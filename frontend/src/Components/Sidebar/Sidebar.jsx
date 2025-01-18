import React from "react";
import { Link } from "react-router-dom";  
import { useRole } from "../../context/roleContext";  // Import your context
import classes from "./Sidebar.module.css";
import { FaHome } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { FaCalendarTimes } from "react-icons/fa";
import { RiPassValidFill } from "react-icons/ri";
import { MdEventAvailable } from "react-icons/md";
import { IoSettingsSharp } from "react-icons/io5";
import { IoNotifications } from "react-icons/io5";
import { FaBookMedical } from "react-icons/fa";
import { FaTable } from "react-icons/fa6";
import { FaHandHoldingMedical } from "react-icons/fa6"


const Sidebar = () => {
  const { role } = useRole();  // Access role from RoleContext

  // Render role-based navigation links
  const renderLinks = () => {
    switch (role) {
      case "receptionist":
        return (
          <ul>
            <li><Link to="/reception-dashboard"><FaHome size={24} color="#4a90e2"  /> Dashboard</Link></li>
            <li><Link to="/register-patient"><FaUser size={24} color="#4a90e2" />Register Patient</Link></li>
            <li><Link to="/schedule-appointment"><FaCalendarAlt size={24} color="#4a90e2" />
Schedule Appointment</Link></li>
            <li><Link to="/cancel-appointment"><FaCalendarTimes size={24} color="#4a90e2"/>Cancel Appointment</Link></li>
            <li><Link to="/validate-payment"><RiPassValidFill size={24} color="#4a90e2"/>Validate Payment</Link></li>
          </ul>
        );
      case "doctor":
        return (
          <ul>
            <li><Link to="/doctor-dashboard"><FaHome size={24} color="#4a90e2"  />Dashboard</Link></li>
            <li><Link to="/patient-data"><FaUser size={24} color="#4a90e2" />Patient Data</Link></li>
            <li><Link to="/doctor-appointments"><FaCalendarAlt size={24} color="#4a90e2" />Appointments</Link></li>
            <li><Link to="/doctor-notification"><IoNotifications size={24} color="#4a90e2"/>Notifications</Link></li>
            <li><Link to="/doctor-availability"><MdEventAvailable  size={24} color="#4a90e2"/>Availability</Link></li>
          </ul>
        );
      case "admin":
        return (
          <ul>
            <li><Link to="/admin-dashboard"><FaHome size={24} color="#4a90e2"  />Dashboard</Link></li>
            <li><Link to="/audit-logs">Audit Logs</Link></li>
            <li><Link to="/manage-users"><IoSettingsSharp size={24} color="#4a90e2" />Manage Users</Link></li>
            <li><Link to="/generate-reports"><FaTable size={24} color="#4a90e2"/>Generate Reports</Link></li>
          </ul>
        );
      case "nurse":
        return (
          <ul>
            
            <li><Link to="/getPatientData"><FaUser size={24} color="#4a90e2" />Patient</Link></li>
            <li><Link to="/medical-availability"><MdEventAvailable  size={24} color="#4a90e2"/>Medical Availability</Link></li>
          </ul>
        );
      case "patient":
        return (
          <ul>
            <li><Link to="/patient-dashboard"><FaHome size={24} color="#4a90e2"  />Dashboard</Link></li>
            <li><Link to="/patient-appointment"><FaCalendarAlt size={24} color="#4a90e2" />Appointments</Link></li>
            <li><Link to="/patient-medicalHistory"><FaBookMedical size={24} color="#4a90e2"/>Medical History</Link></li>
            <li><Link to="/patient-notification"><IoNotifications size={24} color="#4a90e2"/>Notifications</Link></li>
          </ul>
        );
      case "pharmacist":
        return (
          <ul>
            <li><Link to="/pharma-dashboard"><FaHome size={24} color="#4a90e2"  />Dashboard</Link></li>
            <li><Link to="/medicine-availability"><MdEventAvailable  size={24} color="#4a90e2" />Medical Availability</Link></li>
            <li><Link to="/inventory-report"><FaTable size={24} color="#4a90e2"/>Inventory Report</Link></li>
          </ul>
        );
      case "laboratorist":
        return (
          <ul>
            <li><Link to="/lab-dashboard"><FaHome size={24} color="#4a90e2"  />Dashboard</Link></li>
            <li><Link to="/lab-result"><FaHandHoldingMedical size={24} color="#4a90e2"/>Laboratory Results</Link></li>
          </ul>
        );
      default:
        return <ul><li><Link to="/">Home</Link></li></ul>;
    }
  };

  return (
    <aside className={classes.sidebar}>
      <div className={classes.header}>
        <div className={classes.userInfo}>Welcome {role ? role : "Guest"}</div>
      </div>
      <nav>
        {renderLinks()}
      </nav>
    </aside>
  );
};

export default Sidebar;
