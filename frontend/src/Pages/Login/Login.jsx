import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import classes from "./Login.module.css";
import Loader from "../../Components/Loader/Loader";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call (replace with actual backend call)
      if (formData.email === "test@example.com" && formData.password === "password") {
        console.log("Login successful! (Simulated)");
        navigate("/dashboard");
      } else {
        throw new Error("Invalid email or password (Simulated)");
      }
    } catch (error) {
      console.error("Login failed:", error.message);
      setError(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false); // Stop loader whether success or failure
    }
  };

  return (
    <section className={classes.login}>
      <div className={classes.login__container}>
        {loading ? (
          <Loader />
        ) : (
          <>
            <h1>Welcome Back, Please Log in to Your Account!</h1>
            <div className={classes.login__box}>
              <h2>Login to Your Account</h2>
              <form onSubmit={handleSubmit}>
                <div className={classes.form__group}>
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email Address"
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
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <button type="submit" className={classes.login__btn}>
                  Login
                </button>
              </form>
              {error && <p className={classes.error}>{error}</p>}
              <div className={classes.extras}>
                <p>
                  <Link to="/forgot-password">Forgot Password?</Link>
                </p>
                <p>
                  New here?{" "}
                  <Link to="/register?type=patient">Register as Patient</Link> |{" "}
                  <Link to="/register?type=other">Register as Other</Link>
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default LoginPage;
