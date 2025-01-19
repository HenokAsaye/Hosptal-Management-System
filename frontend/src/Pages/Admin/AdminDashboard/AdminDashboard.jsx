import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import Header from "../../../Components/Header/Header";
import Sidebar from "../../../Components/Sidebar/Sidebar";
import apiClient from "../../../lib/util";
import classes from "./AdminDashboard.module.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const [userCounts, setUserCounts] = useState({
    userCount: 0,
    adminCount: 0,
    patientCount: 0,
    doctorCount: 0,
    pharmacistCount: 0,
    labTechnicianCount: 0,
    nurseCount: 0,
    totalUsers: 0,
  });

  useEffect(() => {
    const fetchUserCounts = async () => {
      try {
        const response = await apiClient.get("/admin/allusers");
        setUserCounts(response.data.data);
      } catch (error) {
        console.error("Error fetching user counts:", error.message);
      }
    };

    fetchUserCounts();
  }, []);

  // Prepare data for the chart
  const data = {
    labels: ["Doctors", "Patients", "Nurses", "Lab Technicians", "Pharmacists", "Admins", "Total Users"],
    datasets: [
      {
        label: "User Counts",
        data: [
          userCounts.doctorCount,
          userCounts.patientCount,
          userCounts.nurseCount,
          userCounts.labTechnicianCount,
          userCounts.pharmacistCount,
          userCounts.adminCount,
          userCounts.totalUsers,
        ],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Hospital User Counts",
        font: {
          size: 24,
        },
      },
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
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
          <h2>Admin Dashboard</h2>

          {/* Display Chart */}
          <div className={classes.chartContainer}>
            <Bar data={data} options={options} />
          </div>

          {/* Description */}
          <div className={classes.paragraph}>
            <p>
              <strong>Hospital Statistics:</strong> The hospital currently has
              a total of <strong>{userCounts.totalUsers}</strong> active users,
              including <strong>{userCounts.doctorCount}</strong> doctors,{" "}
              <strong>{userCounts.patientCount}</strong> patients,{" "}
              <strong>{userCounts.nurseCount}</strong> nurses,{" "}
              <strong>{userCounts.labTechnicianCount}</strong> lab technicians,{" "}
              <strong>{userCounts.pharmacistCount}</strong> pharmacists, and{" "}
              <strong>{userCounts.adminCount}</strong> administrators.
              The hospital strives to provide high-quality care and maintain a
              well-rounded team of professionals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
