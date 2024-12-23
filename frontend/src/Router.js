import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from './Pages/HomePage/HomePage';
import LoginPage from './Pages/Login/Login';
import Register from './Pages/Register/Register';
import ForgetPassword from './Pages/ForgetPassword/ForgetPassword';
import ResetPassword from './Pages/ResetPassword/ResetPassword';
import Verify from './Pages/Verify/Verify';

function Routering() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register/>} />
        <Route path="/forgot-password" element={<ForgetPassword/>} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<Verify />} />


      </Routes>
    </Router>
  );
};


export default Routering