import React from "react";
import { Typography, Box } from "@mui/material";
import "./ContactPage.css";
import DrawerMenu from "../components/DrawerMenu";
import Footer from "../components/Footer";

const ContactPage = () => {

  return (
    <div>
      <div>
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
      </div>

      <Footer />
    </div>
    );
};

export default ContactPage;