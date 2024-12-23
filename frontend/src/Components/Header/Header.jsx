import React from "react";
import { Link } from "react-router-dom";
import classes from "./Header.module.css";
import logo from "../../assets/images/Zewditu_logo.png";

const Header = () => {
  return (
    <header>
      <div className={classes.header__container}>
        <img src={logo} alt="Logo" className={classes.logo} />
        <h1>Zewditu Memorial Hospital</h1>
        <nav className={classes.navbar}>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="#about">About Us</a></li>
            <li><a href="#contact">Contact Us</a></li>
          </ul>
        </nav>
        <Link to="/login" className={classes.login__button}>Login</Link>
      </div>
    </header>
  );
};

export default Header;
