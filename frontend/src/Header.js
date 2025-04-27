// src/components/Header.js

import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircle from "@mui/icons-material/AccountCircle";
import DrawerMenu from "./components/DrawerMenu";
import { useNavigate } from "react-router-dom";

const Header = ({ category, setCategory, cart = [], onCheckout, navigateToDepartment}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cartAnchorEl, setCartAnchorEl] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const navigate = useNavigate();

  useEffect(() => {
    const checkLogin = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };
    window.addEventListener("storage", checkLogin);
    return () => window.removeEventListener("storage", checkLogin);
  }, []);

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleCartClick = (event) => {
    setCartAnchorEl(event.currentTarget);
  };

  const handleCartClose = () => {
    setCartAnchorEl(null);
  };

  const handleProfileClick = () => {
    if (isLoggedIn) {
      navigate("/profile");
    } else {
      navigate("/login", { state: { redirectTo: "/profile" } });
    }
  };

  return (
    <>
      <AppBar position="sticky" color="transparent" elevation={0}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* use the same drawer component I made */}
        <DrawerMenu />

          <Box sx={
            { display: "flex", 
              gap: 4, 
              flexGrow: 1, 
              justifyContent: "center" 
            }}>
            {["Women", "Men", "Kids"].map((item) => (
              <Typography
                key={item}
                variant="h6"
                onClick={() => {
                  if (navigateToDepartment) {
                    navigateToDepartment(item);
                  } else if (setCategory) {
                    setCategory(item);
                  }
                }}
                sx={{
                  cursor: "pointer",
                  fontWeight: "bold",
                  textDecoration: category === item ? "underline" : "none",
                }}
              >
                {item}
              </Typography>
            ))}
          </Box>

          <Box sx={
            { 
              display: "flex", 
              gap: 2,
              flexGrow: 1,
              justifyContent: "right" 
            }
            }>
            <IconButton color="inherit">
              <SearchIcon />
            </IconButton>
            <IconButton color="inherit" onClick={handleCartClick}>
              <ShoppingCartIcon />
            </IconButton>
            <IconButton color="inherit" onClick={handleProfileClick}>
              <AccountCircle />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={cartAnchorEl}
        open={Boolean(cartAnchorEl)}
        onClose={handleCartClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {cart.length === 0 ? (
          <MenuItem>Your cart is empty</MenuItem>
        ) : (
          cart.map((item, index) => (
            <MenuItem key={index}>
              {item.name} - {item.price}
            </MenuItem>
          ))
        )}
        {cart.length > 0 && (
          <MenuItem>
            <Button variant="contained" color="primary" onClick={onCheckout}>
              Checkout
            </Button>
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

export default Header;
