import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Corrected import

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  console.log("Token:", token); // for logging

  if (!token) {
    // If no token, redirect to login
    return <Navigate to="/login" />;
  }

  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Current time in seconds
    if (decodedToken.exp < currentTime) {
      // Token is expired
      localStorage.removeItem("token"); // Clear invalid token
      return <Navigate to="/login" />;
    }
  } catch (error) {
    console.error("Invalid token:", error);
    localStorage.removeItem("token"); // Clear invalid token
    return <Navigate to="/login" />;
  }

  return children; // Render the protected component
};

export default ProtectedRoute;