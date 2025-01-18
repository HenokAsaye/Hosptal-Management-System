import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import classes from "./Login.module.css";
import Loader from "../../../Components/Loader/Loader";
import apiClient from "../../../lib/util";
import { useRole } from "../../../context/roleContext";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";
import backgroundImage from "../../../assets/images/login-bg.jpg"; // Import your image

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { setUserRole } = useRole();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiClient.post("/auth/login", formData);
      const token = response.data.token;
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id || decodedToken._id;
      const role = decodedToken.role || "patient";

      setUserRole(role);
      Cookies.set("userRole", role, { expires: 7, path: "/" });
      Cookies.set("userId", userId, { expires: 7, path: "/" });

      navigate(
        role === "admin"
          ? "/admin/dashboard"
          : `/${role}/dashboard`
      );
    } catch (error) {
      setError(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className={classes.login}
      style={{ backgroundImage: `url(${backgroundImage})` }} // Dynamically set the background
    >
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
