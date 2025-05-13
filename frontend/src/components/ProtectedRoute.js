import React from "react";
import { Navigate , useLocation} from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token) {
    // Redirect based on the expected role
    if (role === "productManager" || role === "salesManager") {
      return <Navigate to="/manager-login" />;
    }
    return <Navigate to="/login" />;
  }

  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Current time in seconds

    if (decodedToken.exp < currentTime) {
      // Token is expired
      localStorage.removeItem("token"); // Clear invalid token
      if (role === "productManager" || role === "salesManager") {
        return <Navigate to="/manager-login" />;
      }
      return <Navigate to="/login" />;
    }

    // Use role from state or fallback to JWT
    const expectedRole = location.state?.role || decodedToken.role;
    
    // Check if the role matches
    if (decodedToken.role !== expectedRole) {
      return <Navigate to="/login" />;
    }
  } catch (error) {
    console.error("Invalid token:", error);
    localStorage.removeItem("token"); // Clear invalid token
    if (role === "productManager" || role === "salesManager") {
      return <Navigate to="/manager-login" />;
    }
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;