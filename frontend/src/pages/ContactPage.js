import React, { useState } from "react";
import { Typography, Box, TextField, Button, Alert } from "@mui/material";
import "./ContactPage.css";
import DrawerMenu from "../components/DrawerMenu";
import Footer from "../components/Footer";

const ContactPage = () => {
  const [successMessage, setSuccessMessage] = useState(false);

  const handleSubmit = () => {
    // Show the success message
    setSuccessMessage(true);

    // Hide the success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage(false);
    }, 3000);
  };

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

          {/* Add a large decorative image */}
          <Box className="contact-image">
            <img
              src={`${process.env.PUBLIC_URL}/assets/images/contact-us.png`}
              alt="Contact Us"
              className="contact-us-image"
            />
          </Box>

          {/* Add a contact form */}
          <Box className="contact-form">
            <Typography variant="h5" sx={{ marginBottom: "20px" }}>
              Send Us a Message
            </Typography>
            <TextField
              label="Your Name"
              variant="outlined"
              fullWidth
              sx={{ marginBottom: "20px" }}
            />
            <TextField
              label="Your Email"
              variant="outlined"
              fullWidth
              sx={{ marginBottom: "20px" }}
            />
            <TextField
              label="Your Message"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              sx={{ marginBottom: "20px" }}
            />

            {/* Success message */}
            {successMessage && (
              <Alert severity="success" sx={{ marginBottom: "20px" }}>
                Your message has been sent.
              </Alert>
            )}

            {/* Submit button */}
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSubmit}
              sx={{ padding: "10px 0", fontSize: "16px" }}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </div>

      <Footer />
    </div>
  );
};

export default ContactPage;