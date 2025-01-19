import React from "react";
import Header from "../../../Components/Header/Header";
import Sidebar from "../../../Components/Sidebar/Sidebar";
import classes from "./DoctorDashboard.module.css";

const DoctorDashboard = () => {
  return (
    <div className={classes.container}>
      <Header role="Doctor" isLoggedIn={true} />
      
      <div className={classes.layout}>
        <Sidebar />

        <div className={classes.main}>
          {/* Welcome Message */}
          <div className={classes.card}>
            <h3>Welcome, Doctor! 👩‍⚕️</h3>
            <p>
              We're thrilled to have you as part of our incredible medical team at Zewditu Hospital. Your expertise and dedication make a world of difference in the lives of our patients. 🌟
            </p>
            <p>
              At Zewditu Hospital, we prioritize providing a supportive environment where you can work collaboratively with our skilled nurses and staff to deliver outstanding patient care. We continue to lead in medical advancements, and your contributions play a significant role in our success. 👨‍⚕️💙
            </p>
          </div>

          {/* Doctor's Responsibilities */}
          <div className={classes.card}>
            <h3>Your Responsibilities 📋</h3>
            <p>
              As a doctor at Zewditu Hospital, your key responsibilities include:
              <ul>
                <li>Reviewing and updating patient medical histories to ensure accuracy and relevance. 📑</li>
                <li>Managing and reviewing your scheduled appointments to ensure timely consultations. ⏰</li>
                <li>Reviewing lab results provided by lab technicians to guide diagnosis and treatment. 🧪</li>
                <li>Analyzing patient data to make informed decisions about their ongoing care. 💉</li>
                <li>Collaborating with your fellow healthcare professionals to create the best treatment plans for patients. 🤝</li>
              </ul>
            </p>
          </div>

          {/* Doctor Slogan */}
          <div className={classes.card}>
            <h3>🩺</h3>
            <p>
              "Healing with Care, Expertise, and Compassion." 💖
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
