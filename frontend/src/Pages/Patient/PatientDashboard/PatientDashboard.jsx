import React from "react";
import Header from "../../../Components/Header/Header";
import Sidebar from "../../../Components/Sidebar/Sidebar";
import classes from "./PatientDashboard.module.css";

const PatientDashboard = () => {
  return (
    <div className={classes.container}>
      <Header role="Patient" isLoggedIn={true} />
      <div className={classes.layout}>
        <Sidebar />
        <div className={classes.main}>
          <h1 className={classes.welcomeMessage}>Welcome to Zewditu Memorial Hospital!</h1>
          <p className={classes.intro}>
            Dear patient, we are delighted to have you at Zewditu Memorial Hospital. Our goal is to provide you with top-quality healthcare services tailored to your needs. Here, you can:
          </p>
          <ul className={classes.servicesList}>
            <li>
              <strong>View Your Medical History:</strong> Access detailed records of your past consultations, diagnoses, treatments, and prescriptions in one place, ensuring you are always informed about your health.
            </li>
            <li>
              <strong>Check Your Lab Results:</strong> Get timely updates on your laboratory test results with detailed explanations, helping you understand your health status better.
            </li>
            <li>
              <strong>Book and View Appointments:</strong> Schedule consultations with our expert medical professionals at your convenience, and keep track of upcoming or past appointments with ease.
            </li>
            <li>
              <strong>Receive Notifications and Updates:</strong> Stay informed about important hospital updates, upcoming appointments, and personalized health reminders to ensure you never miss critical information.
            </li>
          </ul>
          <p className={classes.note}>
            If you encounter any issues or have questions about the services, please feel free to contact the reception desk located at the hospital entrance. Our friendly staff will be happy to assist you with your concerns or guide you to the appropriate department. 
          </p>
          <p className={classes.note}>
            Use the sidebar to navigate through the dashboard and access the various services available to you. Thank you for choosing Zewditu Memorial Hospital for your healthcare needs. We are committed to ensuring your experience here is both pleasant and effective.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
