import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { auth } = useAuth(); // Check if the user is authenticated

  if (!auth) {
    // If not authenticated, redirect to login
    return <Navigate to="/login" />;
  }

  return children; // If authenticated, render the child components
};

export default ProtectedRoute;
