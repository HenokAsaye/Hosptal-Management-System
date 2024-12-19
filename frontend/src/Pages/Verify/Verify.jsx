import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import classes from "./Verify.module.css";

const Verify = () => {
  const [email, setEmail] = useState(""); 
  const [message, setMessage] = useState(""); 
  const navigate = useNavigate();
  const location = useLocation();

  // Get email from state if passed during navigation
  const initialEmail = location.state?.email || "";
  const [verificationCode, setVerificationCode] = useState("");

  const handleSendEmail = async () => {
    if (!email.trim()) {
      setMessage("Please enter a valid email address.");
      return;
    }

    try {
      // Simulated API call to send verification email
      console.log("Sending verification email to:", email);
      setMessage("Verification email sent! Please check your inbox.");
    } catch (error) {
      console.error("Error sending email:", error);
      setMessage("Failed to send verification email. Please try again.");
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      setMessage("Please enter the verification code.");
      return;
    }

    try {
      // Simulated API call to verify code
      console.log("Verifying code for email:", email, "Code:", verificationCode);
      setMessage("Email verified successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/login"); // Redirect to login page after verification
      }, 2000);
    } catch (error) {
      console.error("Verification failed:", error);
      setMessage("Invalid verification code. Please try again.");
    }
  };

  return (
    <section className={classes.verify}>
    <div className={classes.verify__container}>
      <h1 className={classes.verify__heading}>Verify Your Email</h1>
      <div className={classes.verify__input__group}>
        <label htmlFor="verify-email">Email Address</label>
        <input
          type="email"
          id={classes.verify__email}
          placeholder="Enter Your Email"
          value={email || initialEmail}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button className={classes.verify__link} onClick={handleSendEmail}>
          Send Verification Email
        </button>
      </div>
      <div className={classes.verify__input__group}>
        <label htmlFor="verify-code">Verification Code</label>
        <input
          type="text"
          id={classes.verify__code}
          placeholder="Enter Verification Code"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          required
        />
        <button className={classes.verify__link} onClick={handleVerifyCode}>
          Verify Code
        </button>
      </div>
      {message && <p className={classes.message}>{message}</p>}
    </div>
    </section>
  );
};

export default Verify;
