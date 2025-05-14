import React from "react";
import { Typography, Box } from "@mui/material";
import "./ContactPage.css";
import DrawerMenu from "../components/DrawerMenu";

const ContactPage = () => {

  return (
    <Box className="contact-container">
      {/* Position the DrawerMenu at the top-left corner */}
      <Box className="drawer-icon">
        <DrawerMenu />
      </Box>
      <Box className="contact-content">
        <Typography variant="h4">Contact Us</Typography>
        <Typography variant="body1" sx={{ marginTop: "20px" }}>
          You can send an email to <strong>cs308team9@gmail.com</strong> for any inquiries.
        </Typography>
      </Box>
    </Box>
    );
};

export default ContactPage;