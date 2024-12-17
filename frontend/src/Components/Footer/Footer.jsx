import React from "react";
import classes from "./Footer.module.css";

const Footer = () => {
  return (
    <footer>
      <div className={classes.footer__container}>
        <div className={classes.contact__info}>
          <h3>Zewditu Memorial Hospital</h3>
          <p>Addis Ababa, Ethiopia</p>
          <p>Phone: +251-911-695-310</p>
          <p>Email: <a href="mailto:info@zewdituhospital.com">info@zewdituhospital.com</a></p>
        </div>
        <div className={classes.quick__links}>
          <p>“Dedicated to providing compassionate care and cutting-edge medical solutions”</p>
          <h3>Quick Links</h3>
          <ul>
            <li><a href="#about">About Us</a></li>
            <li><a href="#contact">Contact Us</a></li>
            <li><a href="#careers">Careers</a></li>
          </ul>
        </div>
        <div className={classes.emergency__info}>
          <h3>Emergency</h3>
          <p>For emergencies, call:</p>
          <p><strong>+251-987-654-321</strong></p>
          <p>Available 24/7</p>
        </div>
      </div>
      <div className={classes.footer__bottom}>
        <p>Zewditu Memorial Hospital &copy; 2025. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
