import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./Pages/HomePage/HomePage";
import LoginPage from "./Pages/Auth/Login/Login";
import Register from "./Pages/Auth/Register/Register";
import ForgetPassword from "./Pages/Auth/ForgetPassword/ForgetPassword";
import ResetPassword from "./Pages/Auth/ResetPassword/ResetPassword";
import Verify from "./Pages/Auth/Verify/Verify";
import AdminDashboard from "./Pages/Admin/AdminDashboard/AdminDashboard";
import PatientDashboard from "./Pages/Patient/PatientDashboard/PatientDashboard";
import DoctorDashboard from "./Pages/Doctor/DoctorDashboard/DoctorDashboard";
import ReceptionDashboard from "./Pages/Receptionist/ReceptionDashboard/ReceptionDashboard";
import NurseDashboard from "./Pages/Nurse/NurseDashboard/NurseDashboard";
import PharmaDashboard from "./Pages/Pharmacist/PharmaDashboard/PharmaDashboard";
import LabDashbord from "./Pages/Laboratorist/LabDashboard/LabDashbord";
import { useRole } from "./context/roleContext";
import Loader from "./Components/Loader/Loader";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import PatientData from "./Pages/Doctor/PatientData/PatientData";
import DoctorAppointments from "./Pages/Doctor/DoctorAppointments/DoctorAppointments";
import Availability from "./Pages/Doctor/Availability/Availability";
import RegisterPatient from "./Pages/Receptionist/RegisterPatient/RegisterPatient";
import ScheduleAppointment from "./Pages/Receptionist/ScheduleAppointment/ScheduleAppointment";
import CancelAppointment from "./Pages/Receptionist/CancelAppointment/CancelAppointment";
import ValidatePayment from "./Pages/Receptionist/ValidatePayment/ValidatePayment";
import PatientAppointment from "./Pages/Patient/PatientAppointment/PatientAppointment";
import PatientNotification from "./Pages/Patient/PatientNotification/PatientNotificaton";
import AuditLog from "./Pages/Admin/AuditLog/AuditLog"
import Report from "./Pages/Admin/Report/Report";
import MedicationAvailability from "./Pages/Pharmacist/MedicationAvailability/MedicationAvailability";
import Inventory from "./Pages/Pharmacist/Inventory/Inventory";
import GetPatient from "./Pages/Nurse/GetPatient/Getpatient";
import CheckMedication from "./Pages/Nurse/CheckMedication/CheckMedication";
import DoctorMedicalHistory from "./Pages/Doctor/DoctorMedicalHistory/DoctorMedicalHistory";
import PatientMedicalHistory from "./Pages/Patient/PatientMedicalHistory/PatientMedicalHistory";
import InviteAdmin from "./Pages/Admin/InviteAdmin/InviteAdmin";
import ManageUser from "./Pages/Admin/ManageUser/ManageUser";

function Routering() {
  const { role, isLoading } = useRole();

  const getDashboardPath = () => {
    if (!role) return "/login";
    switch (role) {
      case "Admin":
        return "/admin/dashboard";
      case "patient":
        return "/patient/dashboard";
      case "doctor":
        return "/doctor/dashboard";
      case "receptionist":
        return "/reception/dashboard";
      case "nurse":
        return "/nurse/dashboard";
      case "pharmacist":
        return "/pharmacist/dashboard";
      case "laboratorist":
        return "/lab/dashboard";
      default:
        return "/login";
    }
  };

  // Show loader while waiting for the role to load
  if (isLoading) {
    return <Loader />;
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<Verify />} />

        {/* Protected Role-Specific Routes */}
        <Route
          path="/Admin/dashboard"
          element={
            <ProtectedRoute requiredRole="Admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/audit-logs"
          element={
            <ProtectedRoute requiredRole="Admin">
              <AuditLog/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/generate-reports"
          element={
            <ProtectedRoute requiredRole="Admin">
              <Report/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/invite-admin"
          element={
            <ProtectedRoute requiredRole="Admin">
              <InviteAdmin/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-users"
          element={
            <ProtectedRoute requiredRole="Admin">
              <ManageUser/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/dashboard"
          element={
            <ProtectedRoute requiredRole="patient">
              <PatientDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient-medicalHistory"
          element={
            <ProtectedRoute requiredRole="patient">
              <PatientMedicalHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient-appointment"
          element={
            <ProtectedRoute requiredRole="patient">
              <PatientAppointment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient-notification"
          element={
            <ProtectedRoute requiredRole="patient">
              <PatientNotification/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/dashboard"
          element={
            <ProtectedRoute requiredRole="doctor">
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient-data"
          element={
            <ProtectedRoute requiredRole="doctor">
              <PatientData /> 
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor-appointments"
          element={
            <ProtectedRoute requiredRole="doctor">
              <DoctorAppointments /> 
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor-medicalHistory"
          element={
            <ProtectedRoute requiredRole="doctor">
              <DoctorMedicalHistory /> 
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor-availability"
          element={
            <ProtectedRoute requiredRole="doctor">
              <Availability /> 
            </ProtectedRoute>
          }
        />

        <Route
          path="/reception/dashboard"
          element={
            <ProtectedRoute requiredRole="receptionist">
              <ReceptionDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register-patient"
          element={
            <ProtectedRoute requiredRole="receptionist">
              <RegisterPatient />
            </ProtectedRoute>
          }
        />
        <Route
          path="/schedule-appointment"
          element={
            <ProtectedRoute requiredRole="receptionist">
              <ScheduleAppointment/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/cancel-appointment"
          element={
            <ProtectedRoute requiredRole="receptionist">
              <CancelAppointment/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/validate-payment"
          element={
            <ProtectedRoute requiredRole="receptionist">
              <ValidatePayment/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/nurse/dashboard"
          element={
            <ProtectedRoute requiredRole="nurse">
              <NurseDashboard />
            </ProtectedRoute>
          }
        />
         <Route
          path="/getPatientData"
          element={
            <ProtectedRoute requiredRole="nurse">
              <GetPatient />
            </ProtectedRoute>
          }
        />
        <Route
          path="/medical-availability"
          element={
            <ProtectedRoute requiredRole="nurse">
              <CheckMedication />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pharmacist/dashboard"
          element={
            <ProtectedRoute requiredRole="pharmacist">
              <PharmaDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/medicine-availability"
          element={
            <ProtectedRoute requiredRole="pharmacist">
              <MedicationAvailability />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventory-report"
          element={
            <ProtectedRoute requiredRole="pharmacist">
              <Inventory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lab/dashboard"
          element={
            <ProtectedRoute requiredRole="laboratorist">
              <LabDashbord />
            </ProtectedRoute>
          }
        />

        {/* Default Redirect Based on Role */}
        <Route path="*" element={<Navigate to={getDashboardPath()} />} />
      </Routes>
    </Router>
  );
}

export default Routering;
