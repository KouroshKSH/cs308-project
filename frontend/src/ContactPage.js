import React from "react";
import { Typography, Box } from "@mui/material";

const ContactPage = () => {
  return (
    <Box sx={{ textAlign: "center", marginTop: "50px" }}>
      <Typography variant="h4">Contact Us</Typography>
      <Typography variant="body1" sx={{ marginTop: "20px" }}>
        You can send an email to <strong>no email yet :)</strong> for any inquiries.
      </Typography>
    </Box>
  );
};

export default ContactPage;