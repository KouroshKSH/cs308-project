// src/components/Header.js
import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Button,
  TextField,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircle from "@mui/icons-material/AccountCircle";
import DrawerMenu from "./DrawerMenu";
import MiniCart from "./MiniCart";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
const departmentMap = { Women: 2, Men: 1, Kids: 3 };

const Header = ({
  category,
  setCategory,
  onSearchResults,
  cart = [],
  onCheckout,
  navigateToDepartment,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cartAnchorEl, setCartAnchorEl] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const navigate = useNavigate();
  const [miniCartAnchorEl, setMiniCartAnchorEl] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBoxVisible, setSearchBoxVisible] = useState(false);

  useEffect(() => {
    const checkLogin = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };
    window.addEventListener("storage", checkLogin);
    return () => window.removeEventListener("storage", checkLogin);
  }, []);

  const handleCartClick = (event) => {
    setMiniCartAnchorEl(event.currentTarget);
  };

  const handleMiniCartClose = () => {
    setMiniCartAnchorEl(null);
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

  const handleSearchIconClick = () => {
    setSearchBoxVisible(true);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchTerm) return;
    try {
      const departmentId = departmentMap[category];
      const response = await axios.get(
        `${BASE_URL}/products/department/${departmentId}/search?q=${searchTerm}`
      );
      onSearchResults?.(response.data);
    } catch (error) {
      onSearchResults?.([]);
    }
    setSearchTerm("");
    setSearchBoxVisible(false);
  };

  return (
    <>
      <AppBar
        position="sticky"
        color="transparent"
        elevation={0}
        sx={{
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(10px)",
          zIndex: (theme) => theme.zIndex.drawer - 1,
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box
            component="img"
            src="/public/assets/images/NoireVogue.png"
            alt="Store Logo"
            sx={{ height: 40, mr: 2, cursor: "pointer" }}
            onClick={() => navigate("/")}
          />

  
          <DrawerMenu />

  
          <Box sx={{ display: "flex", gap: 4, flexGrow: 1, justifyContent: "center" }}>
            {["Women", "Men", "Kids"].map((item) => (
              <Typography
                key={item}
                variant="h6"
                onClick={() => {
                  if (navigateToDepartment) {
                    navigateToDepartment(item);
                  } else {
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

          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <IconButton color="inherit" onClick={handleSearchIconClick}>
              <SearchIcon />
            </IconButton>
            {searchBoxVisible && (
              <form onSubmit={handleSearchSubmit} style={{ display: "flex", alignItems: "center" }}>
                <TextField
                  label="Search Products"
                  variant="outlined"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  size="small"
                  sx={{ ml: 1 }}
                />
                <Button type="submit" variant="contained" color="primary" sx={{ ml: 1 }}>
                  Search
                </Button>
              </form>
            )}

            <IconButton color="inherit" onClick={handleCartClick}>
              <ShoppingCartIcon />
            </IconButton>
            <IconButton color="inherit" onClick={handleProfileClick}>
              <AccountCircle />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>


      <MiniCart
        anchorEl={miniCartAnchorEl}
        open={Boolean(miniCartAnchorEl)}
        onClose={handleMiniCartClose}
      />

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
