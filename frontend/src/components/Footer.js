import React from 'react';
import { 
  Box, 
  Typography, 
  Link,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import './Footer.css'; // Import the new CSS file

const Footer = () => {
  const navigate = useNavigate();

  const handleManagerNavigation = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/manager-login");
    } else {
      try {
        const decodedToken = jwtDecode(token);
        const role = decodedToken.role;

        if (role === "productManager") {
          navigate("/product-manager");
        } else if (role === "salesManager") {
          navigate("/sales-manager");
        } else {
          navigate("/manager-login");
        }
      } catch (error) {
        console.error("Invalid token:", error);
        navigate("/manager-login");
      }
    }
  };

  return (
    <>
    
    {/* Footer content */}
    <Box className="footer-container">
      <Box className="footer-links">
        <Link
          component="button"
          underline="hover"
          onClick={() => navigate("/")}
          className="footer-link"
        >
          <HomeIcon className="footer-icon" /> Home
        </Link>
        <Link
          component="button"
          underline="hover"
          onClick={() => window.open("https://github.com/KouroshKSH/cs308-project", "_blank")}
          className="footer-link"
        >
          <InfoIcon className="footer-icon" /> About
        </Link>
        <Link
          component="button"
          underline="hover"
          onClick={() => navigate("/contact")}
          className="footer-link"
        >
          <ContactMailIcon className="footer-icon" /> Contact
        </Link>
        <Link
          component="button"
          underline="hover"
          onClick={handleManagerNavigation}
          className="footer-link"
        >
          <AdminPanelSettingsIcon className="footer-icon" /> Manager?
        </Link>
      </Box>
      <Typography 
        variant="body2" 
        className='footer-text' 
        color="inherit"
      >
        © {new Date().getFullYear()} CS308 Project — All rights reserved.
      </Typography>
    </Box>
    </>
  );
};

export default Footer;