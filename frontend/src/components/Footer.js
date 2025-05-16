import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

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
    <Box
      sx={{
        mt: 8,
        py: 3,
        px: 2,
        borderTop: '1px solid #ccc',
        backgroundColor: 'rgba(240,240,240,0.4)',
        textAlign: 'center',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap', mb: 1 }}>
        <Link component="button" underline="hover" onClick={() => navigate("/")}>
          Home
        </Link>
        <Link component="button" underline="hover" onClick={() => window.open("https://github.com/KouroshKSH/cs308-project", "_blank")}>
          About
        </Link>
        <Link component="button" underline="hover" onClick={() => navigate("/contact")}>
          Contact
        </Link>
        <Link component="button" underline="hover" onClick={handleManagerNavigation}>
          Manager?
        </Link>
      </Box>
      <Typography variant="body2" color="text.secondary">
        © {new Date().getFullYear()} CS308 Project — All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
