import React, { useState } from "react";
import classes from "./ForgetPassword.module.css";
import { useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email.trim() === "") {
      setMessage("Please enter a valid email address.");
      return;
    }

    try {
      // Simulate backend API call (replace with actual API)
      // const response = await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
      console.log("Password recovery requested for email:", email);
      setMessage("Recovery link sent! Check your email for further instructions.");

      // Navigate to Reset Password page
      setTimeout(() => {
        navigate("/reset-password");
      }, 3000); 
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred. Please try again.");
    }
  };


  return (
    <section className={classes.forgot}>
    <div className={classes.forgot__password__container}>
      <h1 className={classes.heading}>Forgot Your Password?</h1>
      <p className={classes.description}>
        Enter your email address to receive instructions for creating a new
        password.
      </p>
      <form className={classes.form__group} onSubmit={handleSubmit}>
        <label htmlFor="email" className={classes.label}>
          Email Address
        </label>
        <input
          type="email"
          id="email"
          className={classes.email__input}
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className={classes.submit__btn}>
          Submit
        </button>
      </form>
      {message && <p className={classes.message}>{message}</p>}
    </div>
    </section>
  );
};

export default ForgetPassword;
