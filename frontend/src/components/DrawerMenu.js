// filepath: /home/kourosh/Documents/Sabanci/classes/cs308/cs308-project/frontend/src/components/DrawerMenu.js
import React, { useState } from "react";
import { Drawer, List, ListItem, ListItemText, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";

const DrawerMenu = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  return (
    <>
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
    </>
  );
};

export default DrawerMenu;