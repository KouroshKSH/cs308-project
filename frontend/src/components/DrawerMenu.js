import React, { useState } from "react";
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemText, 
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const DrawerMenu = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  // for accessing manager page easily
  const handleManagerNavigation = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      // If no token, redirect to manager login
      navigate("/manager-login");
    } else {
      try {
        const decodedToken = jwtDecode(token);
        const role = decodedToken.role;

        // Redirect based on the manager's role
        if (role === "productManager") {
          navigate("/product-manager");
        } else if (role === "salesManager") {
          navigate("/sales-manager");
        } else {
          // If the role is not a manager, redirect to manager login
          navigate("/manager-login");
        }
      } catch (error) {
        console.error("Invalid token:", error);
        // If token is invalid, redirect to manager login
        navigate("/manager-login");
      }
    }

    setDrawerOpen(false);
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
          
          {/* the about page */}

          <ListItem
            button
            sx={{ cursor: "pointer" }}
            onClick={() => {
              navigate("/about");
              setDrawerOpen(false); // Close the drawer
            }}
          >
            <ListItemText primary="About" />
          </ListItem>
          
          <ListItem
            button
            sx={{ cursor: "pointer" }}
            onClick={() => {
              // goes to a basic contact page, nothing special
              navigate("/contact");
              setDrawerOpen(false); // Close the drawer
            }}
          >
            <ListItemText primary="Contact" />
          </ListItem>

          {/* the button for going to manager page easier */}
          <ListItem
            button
            sx={{ cursor: "pointer" }}
            onClick={handleManagerNavigation}
          >
            <ListItemText primary="Manager?" />
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};

export default DrawerMenu;