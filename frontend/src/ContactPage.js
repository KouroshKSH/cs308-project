import React, { useState } from "react";
import { Typography, Box, Drawer, List, ListItem, ListItemText, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import "./ContactPage.css";
import DrawerMenu from "./components/DrawerMenu";

const ContactPage = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  return (
    <Box className="contact-container">
    {/* the custom drawer menu component */}
    <DrawerMenu />
    <Box className="contact-content">
        <Typography variant="h4">Contact Us</Typography>
        <Typography variant="body1" sx={{ marginTop: "20px" }}>
        You can send an email to <strong>we don't have an email yet :)</strong> for any inquiries.
        </Typography>
    </Box>
    </Box>
  );
};

export default ContactPage;