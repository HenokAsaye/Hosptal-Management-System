import React, { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import classes from "./Register.module.css";
import apiClient from "../../../lib/util";
import Cookies from "js-cookie"; // Import js-cookie

const Register = () => {
  const [searchParams] = useSearchParams();
  const userType = searchParams.get("type");
  const navigate = useNavigate();

  // Initialize form data with default values based on user type
  const [formData, setFormData] = useState(
    userType === "patient"
      ? {
          name: "",
          contact: "",
          age: "",
          email: "",
          password: "",
          region: "",
          city: "",
          woreda: "",
          role: "patient", // Fixed role for patients
        }
      : {
          name: "",
          contact: "",
          email: "",
          password: "",
          role: "", // Placeholder for non-patient roles
        }
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Form Data before sending:", formData);

      // Call the backend API to register the user
      const response = await apiClient.post("/auth/signup", formData);

      console.log("Registration successful:", response.data);

      // Store the role in a cookie for persistent access
      Cookies.set("userRole", formData.role, { expires: 7 }); // Save role in the cookie

      // Redirect to the email verification page (if applicable)
      navigate("/verify-email", { state: { email: formData.email } });
    } catch (error) {
      console.error("Registration failed:", error.message || "Unknown error");
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <section className={classes.register}>
      <div className={classes.container}>
        <div className={classes.header}>
          <h1>Welcome To Zewditu Memorial Hospital</h1>
        </div>
        <form className={classes.form__container} onSubmit={handleSubmit}>
          <div className={classes.form__group}>
            <label htmlFor="fullname">Full Name</label>
            <input
              type="text"
              id="fullname"
              name="name"
              placeholder="Enter your full name"
              value={formData.name} 
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={classes.form__group}>
            <label htmlFor="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              name="contact"
              placeholder="Enter your phone number"
              value={formData.contact}  
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={classes.form__group}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={classes.form__group}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Conditionally render the address fields for patients */}
          {userType === "patient" && (
            <>
              <div className={classes.form__group}>
                <label htmlFor="age">Age</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  placeholder="Enter your age"
                  value={formData.age}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={classes.address__group}>
                <label>Address</label>
                <div className={classes.address__fields}>
                  <div>
                    <label htmlFor="region">Region</label>
                    <input
                      type="text"
                      id="region"
                      name="region"
                      placeholder="Region"
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
                      placeholder="City"
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
                      placeholder="Woreda"
                      value={formData.woreda}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {userType !== "patient" && (
            <div className={classes.form__group}>
              <label htmlFor="role">Select Role</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled>
                  Select Role
                </option>
                <option value="doctor">Doctor</option>
                <option value="nurse">Nurse</option>
                <option value="lab_technician">Lab Technician</option>
                <option value="receptionist">Receptionist</option>
                <option value="pharmacist">Pharmacist</option>
              </select>
            </div>
          )}

          <div className={classes.footer__section}>
            <button type="submit" className={classes.register__btn}>
              Register {userType === "patient" ? "as Patient" : "as Other"}
            </button>
            <p className={classes.login__link}>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Register;
