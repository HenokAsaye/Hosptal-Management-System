import React, { useState } from "react";
import classes from "./ForgetPassword.module.css";
import { useNavigate } from "react-router-dom";
import apiClient from "../../../lib/util";

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
    const response = await apiClient.post("/auth/forgotPassword", { email });
    setMessage(response.data.message || "Recovery email sent successfully!");
    navigate("/reset-password")
  } catch (error) {
    console.error("Error:", error);
    setMessage(error.response?.data?.message || "An error occurred. Please try again.");
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
