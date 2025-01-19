import React from "react";
import { Link, useLocation } from "react-router-dom";  
import { useRole } from "../../context/roleContext"; // Import your context
import classes from "./Sidebar.module.css";
import { FaHome, FaUser, FaCalendarAlt, FaCalendarTimes, FaTable, FaBookMedical } from "react-icons/fa";
import { RiPassValidFill } from "react-icons/ri";
import { MdEventAvailable } from "react-icons/md";
import { IoSettingsSharp, IoNotifications } from "react-icons/io5";
import { FaHandHoldingMedical } from "react-icons/fa";
import { SiAdobeaudition } from "react-icons/si";
import { FcInvite } from "react-icons/fc";

const Sidebar = () => {
  const { role } = useRole();  // Access role from RoleContext
  const location = useLocation(); // Use to highlight active link

  // Render role-based navigation links
  const renderLinks = () => {
    switch (role) {
      case "receptionist":
        return (
          <ul>
            <li><Link to="/reception-dashboard" className={location.pathname === "/reception-dashboard" ? classes.active : ""}><FaHome size={24} className="icon" /> Dashboard</Link></li>
            <li><Link to="/register-patient" className={location.pathname === "/register-patient" ? classes.active : ""}><FaUser size={24} className="icon" /> Register Patient</Link></li>
            <li><Link to="/schedule-appointment" className={location.pathname === "/schedule-appointment" ? classes.active : ""}><FaCalendarAlt size={24} className="icon" /> Schedule Appointment</Link></li>
            <li><Link to="/cancel-appointment" className={location.pathname === "/cancel-appointment" ? classes.active : ""}><FaCalendarTimes size={24} className="icon" /> Cancel Appointment</Link></li>
            <li><Link to="/validate-payment" className={location.pathname === "/validate-payment" ? classes.active : ""}><RiPassValidFill size={24} className="icon" /> Validate Payment</Link></li>
          </ul>
        );
      case "doctor":
        return (
          <ul>
            <li><Link to="/doctor-dashboard" className={location.pathname === "/doctor-dashboard" ? classes.active : ""}><FaHome size={24} className="icon" /> Dashboard</Link></li>
            <li><Link to="/patient-data" className={location.pathname === "/patient-data" ? classes.active : ""}><FaUser size={24} className="icon" /> Patient Data</Link></li>
            <li><Link to="/doctor-appointments" className={location.pathname === "/doctor-appointments" ? classes.active : ""}><FaCalendarAlt size={24} className="icon" /> Appointments</Link></li>
             <li><Link to="/doctor-medicalHistory" className={location.pathname === "/doctor-medicalHistory" ? classes.active : ""}><FaBookMedical size={24} className="icon" /> Medical History</Link></li>
             <li><Link to="/doctor-labresults" className={location.pathname === "/doctor-labresults" ? classes.active : ""}><FaHandHoldingMedical size={24} className="icon" /> Laboratory results </Link></li>

            {/* <li><Link to="/doctor-availability" className={location.pathname === "/doctor-availability" ? classes.active : ""}><MdEventAvailable size={24} className="icon" /> Availability</Link></li> */}
          </ul>
        );
      case "Admin":
        return (
          <ul>
            <li><Link to="/Admin/dashboard" className={location.pathname === "/admin-dashboard" ? classes.active : ""}><FaHome size={24} className="icon" /> Dashboard</Link></li>
            <li><Link to="/audit-logs" className={location.pathname === "/audit-logs" ? classes.active : ""}><SiAdobeaudition size={24} className="icon" />Audit Logs</Link></li>
            <li><Link to="/manage-users" className={location.pathname === "/manage-users" ? classes.active : ""}><IoSettingsSharp size={24} className="icon" /> Manage Users</Link></li>
            <li><Link to="/generate-reports" className={location.pathname === "/generate-reports" ? classes.active : ""}><FaTable size={24} className="icon" /> Generate Reports</Link></li>
            <li><Link to="/invite-admin" className={location.pathname === "/invite-admin" ? classes.active : ""}><FcInvite size={24} className="icon" color="black"/> Invite Admin</Link></li>
          </ul>
        );
      case "nurse":
        return (
          <ul>
            <li><Link to="/nurse/dashboard" className={location.pathname === "/nurse/dashboard" ? classes.active : ""}><FaHome size={24} className="icon" /> Dashboard</Link></li>
            <li><Link to="/getPatientData" className={location.pathname === "/getPatientData" ? classes.active : ""}><FaUser size={24} className="icon" /> Patient</Link></li>
            <li><Link to="/medical-availability" className={location.pathname === "/medical-availability" ? classes.active : ""}><MdEventAvailable size={24} className="icon" /> Medical Availability</Link></li>
          </ul>
        );
      case "patient":
        return (
          <ul>
            <li><Link to="/patient-dashboard" className={location.pathname === "/patient-dashboard" ? classes.active : ""}><FaHome size={24} className="icon" /> Dashboard</Link></li>
            <li><Link to="/patient-appointment" className={location.pathname === "/patient-appointment" ? classes.active : ""}><FaCalendarAlt size={24} className="icon" /> Appointments</Link></li>
            <li><Link to="/patient-medicalHistory" className={location.pathname === "/patient-medicalHistory" ? classes.active : ""}><FaBookMedical size={24} className="icon" /> Medical History</Link></li>
            <li><Link to="/patient-notification" className={location.pathname === "/patient-notification" ? classes.active : ""}><IoNotifications size={24} className="icon" /> Notifications</Link></li>
          </ul>
        );
      case "pharmacist":
        return (
          <ul>
            <li><Link to="/pharma-dashboard" className={location.pathname === "/pharma-dashboard" ? classes.active : ""}><FaHome size={24} className="icon" /> Dashboard</Link></li>
            <li><Link to="/medicine-availability" className={location.pathname === "/medicine-availability" ? classes.active : ""}><MdEventAvailable size={24} className="icon" /> Medical Availability</Link></li>
            <li><Link to="/inventory-report" className={location.pathname === "/inventory-report" ? classes.active : ""}><FaTable size={24} className="icon" /> Inventory Report</Link></li>
          </ul>
        );
      case "laboratorist":
        return (
          <ul>
            <li><Link to="/lab-dashboard" className={location.pathname === "/lab-dashboard" ? classes.active : ""}><FaHandHoldingMedical size={24} className="icon" /> Laboratory Results</Link></li>
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
