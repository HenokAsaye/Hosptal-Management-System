import React from "react";
import { Navigate } from "react-router-dom";
import { useRole } from "../../context/roleContext";
import Loader from "../Loader/Loader";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { role, isLoading } = useRole(); // Access role and isLoading from context

  if (isLoading) {
    return <Loader/>
  }

  if (!role || role !== requiredRole) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
