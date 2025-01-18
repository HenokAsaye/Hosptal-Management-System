import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import classes from "./Login.module.css";
import Loader from "../../../Components/Loader/Loader";
import apiClient from "../../../lib/util";
import { useRole } from "../../../context/roleContext"; // Use the updated context
import Cookies from "js-cookie"; // Import js-cookie
import { jwtDecode } from "jwt-decode";
 // Import jwt-decode to decode the token

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { setUserRole } = useRole(); // Get setUserRole from context

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const response = await apiClient.post("/auth/login", formData);
    console.log("API response:", response); // Log the entire response object

    const token = response.data.token || response.data.token; // Adjust if needed
    console.log("Token:", token); // Log the token to see if it's extracted correctly

    if (!token) {
      throw new Error("Token not found in the response.");
    }

    // Decode the JWT token to extract user info
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id || decodedToken._id; // Adjust depending on the key in the decoded token
    const role = decodedToken.role || "patient"; // Default to patient if role is not in the token

    // Store the role and userId in the context and cookies
    setUserRole(role); // Update context with role
    Cookies.set("userRole", role, { expires: 7, path: "/" }); // Store role in cookie
    Cookies.set("userId", userId, { expires: 7, path: "/" }); // Store userId in cookie

    console.log("Role stored in cookie:", Cookies.get("userRole")); // Debugging the cookie
    console.log("User ID stored in cookie:", Cookies.get("userId")); // Debugging the cookie

    // Navigate to the appropriate dashboard based on the role
    if (role === "admin") {
      navigate("/admin/dashboard");
    } else if (role === "patient") {
      navigate("/patient/dashboard");
    } else if (role === "doctor") {
      navigate("/doctor/dashboard");
    } else if (role === "nurse") {
      navigate("/nurse/dashboard");
    } else if (role === "pharmacist") {
      navigate("/pharmacist/dashboard");
    } else if (role === "laboratorist") {
      navigate("/lab/dashboard");
    } else {
      navigate("/dashboard");
    }
  } catch (error) {
    console.error("Login failed:", error.message);
    setError(error.response?.data?.message || "Login failed. Please try again.");
  } finally {
    setLoading(false); // Stop loading spinner
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
