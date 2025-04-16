import React, { useState } from "react";
import { Typography, Box, Drawer, List, ListItem, ListItemText, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";

const ContactPage = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  return (
    <Box>
      <IconButton edge="start" color="inherit" onClick={toggleDrawer(true)}>
        <MenuIcon />
      </IconButton>

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <List sx={{ width: 250 }}>
          <ListItem
            button
            sx={{ cursor: "pointer" }}
            onClick={() => {
              navigate("/");
              setDrawerOpen(false); // Close the drawer
            }}
          >
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem
            button
            sx={{ cursor: "pointer" }}
            onClick={() => {
              window.open("https://github.com/KouroshKSH/cs308-project", "_blank");
              setDrawerOpen(false); // Close the drawer
            }}
          >
            <ListItemText primary="About" />
          </ListItem>
          <ListItem
            button
            sx={{ cursor: "pointer" }}
            onClick={() => {
              navigate("/contact");
              setDrawerOpen(false); // Close the drawer
            }}
          >
            <ListItemText primary="Contact" />
          </ListItem>
        </List>
      </Drawer>

      <Box sx={{ textAlign: "center", marginTop: "50px" }}>
        <Typography variant="h4">Contact Us</Typography>
        <Typography variant="body1" sx={{ marginTop: "20px" }}>
          You can send an email to <strong>we don't have an email yet :)</strong> for any inquiries.
        </Typography>
      </Box>
    </Box>
  );
};

export default ContactPage;