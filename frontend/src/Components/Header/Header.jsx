import React from "react";
import { Link, useNavigate } from "react-router-dom";  // Use useNavigate for redirect
import classes from "./Header.module.css";
import logo from "../../assets/images/Zewditu_logo.png";
import { useRole } from "../../context/roleContext";  // Access RoleContext

const Header = ({ role, isLoggedIn }) => {
  const navigate = useNavigate();
  const { clearUserRole } = useRole();  // Access clearUserRole from RoleContext

  // Logout handler
  const handleLogout = () => {
    clearUserRole();  // Clear user role from context and cookies
    navigate("/login");  // Redirect to login page
  };

  return (
    <header>
      <div className={classes.header__container}>
        <img src={logo} alt="Logo" className={classes.logo} />
        <h1>Zewditu Memorial Hospital</h1>

        {isLoggedIn ? (
          <div className={classes.userInfo}>
            <span>Welcome to {role}'s Dashboard!</span>
            <button onClick={handleLogout} className={classes.logoutButton}>Log Out</button>
          </div>
        ) : (
          <nav className={classes.navbar}>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="#about">About Us</a></li>
              <li><a href="#contact">Contact Us</a></li>
            </ul>
          </nav>
        )}

        {!isLoggedIn && (
          <Link to="/login" className={classes.login__button}>
            Login
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
