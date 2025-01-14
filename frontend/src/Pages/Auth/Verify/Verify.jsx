import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import classes from "./Verify.module.css";
import apiClient from "../../../lib/util"; // Ensure this utility is set up to handle API calls

const Verify = () => {
  const [email, setEmail] = useState(""); 
  const [message, setMessage] = useState(""); 
  const [verificationCode, setVerificationCode] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Get email from state if passed during navigation
  const initialEmail = location.state?.email || "";

  
  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail);
    }
  }, [initialEmail]);

  // Function to handle sending verification email
  const handleSendEmail = async () => {
    if (!email.trim()) {
      setMessage("Please enter a valid email address.");
      return;
    }

    try {
      const response = await apiClient.post("/auth/sendVerificationEmail", { email });

      if (response.data.success) {
        console.log("Sending verification email to:", email);
        setMessage("Verification email sent! Please check your inbox.");
      } else {
        setMessage(response.data.message || "Failed to send verification email. Please try again.");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      setMessage("Failed to send verification email. Please try again.");
    }
  };

  // Function to handle verification of the code
  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      setMessage("Please enter the verification code.");
      return;
    }

    try {
      const response = await apiClient.post("/auth/verifyEmail", { code: verificationCode });

      if (response.data.success) {
        setMessage(response.data.message || "Email verified successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/login"); // Redirect to login page after successful verification
        }, 2000);
      } else {
        setMessage(response.data.message || "Verification failed. Please try again.");
      }
    } catch (error) {
      console.error("Verification failed:", error);
      setMessage("Invalid verification code. Please try again.");
    }
  };

  return (
    <section className={classes.verify}>
      <div className={classes.verify__container}>
        <h1 className={classes.verify__heading}>Verify Your Email</h1>
        
        {/* Email input and send button */}
        <div className={classes.verify__input__group}>
          <label htmlFor="verify-email">Email Address</label>
          <input
            type="email"
            id={classes.verify__email}
            placeholder="Enter Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button className={classes.verify__link} onClick={handleSendEmail}>
            Send Verification Email
          </button>
        </div>

        {/* Verification code input and verify button */}
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

        {/* Display messages for success or error */}
        {message && <p className={classes.message}>{message}</p>}
      </div>
    </section>
  );
};

export default Verify;