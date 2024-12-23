import React from "react";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
import Home from "./HomePage.module.css";
import hospital from "../../assets/images/hospital.jpg"

const HomePage = () => {
  return (
    <div>
      <Header />
      <main>
        <section className={Home.banner}>
          <div className={Home.banner__content}>
            <h2>Welcome to Zewditu Memorial Hospital!</h2>
            <p>"Providing quality healthcare services for decades"</p>
          </div>
        </section>

        <section id="services" className={Home.services}>
          <h2>Our Services</h2>
          <div className={Home.service__card}>
            <h3>Emergency Care</h3>
            <p>24/7 emergency response with expert medical staff.</p>
          </div>
          <div className={Home.service__card}>
            <h3>Pharmacy</h3>
            <p>Fully-stocked pharmacy with quality medicines.</p>
          </div>
          <div className={Home.service__card}>
            <h3>Specialized Departments</h3>
            <p>Dedicated units for orthopedics, cardiology, and maternity care.</p>
          </div>
        </section>

        <section id="about" className={Home.about__us}>
          <div>
        <h2>About Us</h2>
        <p>Zewditu Memorial Hospital is a leading public healthcare institution located in Addis Ababa, Ethiopia. Established to honor Empress Zewditu, the hospital has been instrumental in delivering quality healthcare since its inception. It specializes in infectious disease treatment, diagnostic services, and outpatient care. As one of the primary referral hospitals in the country, Zewditu Memorial Hospital is dedicated to improving the well-being of patients through compassionate care and advanced medical technologies.</p>
        <p>Our state-of-the-art diagnostic laboratory has received international accreditation, ensuring reliable and accurate results. The hospital actively supports community health initiatives and is committed to advancing medical education to train the next generation of healthcare professionals.</p>
       </div>
          <div>
            <img
              src={hospital}
              alt="Zewditu Memorial Hospital Building"
              className="about-image"
            />
          </div>
        </section>

        <section id="careers" class={Home.careers}>
    <h2>Meet Our Team</h2>
    <p>Our hospital management system is supported by a dedicated team of professionals committed to delivering quality patient care. Learn about their roles:</p>
    <ul>
        <li><strong>Doctors:</strong> Provide expert diagnosis and treatment to ensure patient well-being.</li>
        <li><strong>Nurses:</strong> Offer compassionate care and assistance throughout the recovery journey.</li>
        <li><strong>Pharmacists:</strong> Ensure timely availability of medications and educate patients on proper usage.</li>
        <li><strong>Receptionists:</strong> Facilitate patient appointments and maintain smooth communication.</li>
        <li><strong>Administrators:</strong> Oversee hospital operations to enhance efficiency and patient satisfaction.</li>
    </ul>
</section>

   <section id="contact" class={Home.contact__us}>
        <h2>Contact Us</h2>
        <p>Address: Addis Ababa, Ethiopia</p>
        <p>Phone: +251-911-695-310</p>
        <p>Email: info@zewdituhospital.et</p>
    </section>

      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
