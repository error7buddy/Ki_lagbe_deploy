// src/Components/Auth/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../../Firebase/config";

const PrivateRoute = ({ children }) => {
  const user = auth.currentUser; // Check if user is logged in

  if (!user) {
    // Not logged in, redirect to login page
    return <Navigate to="/auth" replace />;
  }

  // Logged in, render the protected content
  return children;
};

export default PrivateRoute;
