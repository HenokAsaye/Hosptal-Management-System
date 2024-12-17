import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./ResetPassword.module.css";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.trim() === "" || confirmPassword.trim() === "") {
      setMessage("Please fill in both fields.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      // Simulate API call (replace with actual API)
      console.log("New password submitted:", password);

      setMessage("Password reset successful! Redirecting to login...");

      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <section className={classes.reset}>
    <div className={classes.reset__password__container}>
      <h1 className={classes.heading}>Reset Your Password</h1>
      <form className={classes.form__group} onSubmit={handleSubmit}>
        <label htmlFor="password" className={classes.label}>
          New Password
        </label>
        <input
          type="password"
          id="password"
          className={classes.password__input}
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label htmlFor="confirm-password" className={classes.label}>
          Confirm New Password
        </label>
        <input
          type="password"
          id="confirm-password"
          className={classes.password__input}
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit" className={classes.reset__btn}>
          Reset Password
        </button>
      </form>
      {message && <p className={classes.message}>{message}</p>}
    </div>
    </section>
  );
};

export default ResetPassword;
