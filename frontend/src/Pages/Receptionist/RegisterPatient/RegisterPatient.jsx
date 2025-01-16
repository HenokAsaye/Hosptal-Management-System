import React, { useState } from "react";
import Header from "../../../Components/Header/Header"; 
import Sidebar from "../../../Components/Sidebar/Sidebar"; 
import classes from "./RegisterPatient.module.css"; 

const RegisterPatient = () => {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    password: "",
    age: "",
    region: "",
    city: "",
    woreda: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted: ", formData);
    // Add your submission logic here (e.g., API call)
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
          {/* Register Patient Title */}
          <div className={classes.formHeader}>
            <h2>Register Patient</h2>
          </div>

          {/* Register Form */}
          <form className={classes.form} onSubmit={handleSubmit}>
            <div className={classes.formGroup}>
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={classes.formGroup}>
              <label htmlFor="contact">Phone</label>
              <input
                type="tel"
                id="contact"
                name="contact"
                placeholder="Enter phone number"
                value={formData.contact}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={classes.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={classes.formGroup}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Additional fields for age and address */}
            <div className={classes.formGroup}>
              <label htmlFor="age">Age</label>
              <input
                type="number"
                id="age"
                name="age"
                placeholder="Enter age"
                value={formData.age}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={classes.addressGroup}>
              <label>Address</label>
              <div className={classes.addressFields}>
                <div>
                  <label htmlFor="region">Region</label>
                  <input
                    type="text"
                    id="region"
                    name="region"
                    placeholder="Enter region"
                    value={formData.region}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    placeholder="Enter city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="woreda">Woreda</label>
                  <input
                    type="text"
                    id="woreda"
                    name="woreda"
                    placeholder="Enter woreda"
                    value={formData.woreda}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Form Buttons */}
            <div className={classes.formButtons}>
              <button type="submit" className={classes.btnPrimary}>
                Register Patient
              </button>
              <button type="button" className={classes.btnSecondary}>
                View Patients
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPatient;
