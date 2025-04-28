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
  TextField,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircle from "@mui/icons-material/AccountCircle";
import DrawerMenu from "./components/DrawerMenu";
import MiniCart from "./components/MiniCart";
import axios from "axios";

import { useNavigate } from "react-router-dom";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
const departmentMap = { Women: 2, Men: 1, Kids: 3 };

const Header = ({ category, setCategory, onSearchResults, cart = [], onCheckout, navigateToDepartment}) => {
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

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

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
      const formattedSearchTerm = `%${searchTerm}%`;
      const response = await axios.get(
        `${BASE_URL}/products/department/${departmentId}/search?q=${formattedSearchTerm}`
      );
      if (typeof onSearchResults === "function") {
        onSearchResults(response.data);
      }
    } catch (error) {
      if (typeof onSearchResults === "function") {
        onSearchResults([]);
      }
    }
    setSearchTerm("");
    setSearchBoxVisible(false);
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
          }}
        >
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
            justifyContent: "right" 
          }
          }>

          <IconButton color="inherit" onClick={handleSearchIconClick}>
            <SearchIcon />
          </IconButton>
            {searchBoxVisible && (
            <form onSubmit={handleSearchSubmit}>
              <TextField
                label="Search Products"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
                sx={{ ml: 2 }}
              />
              <Button type="submit" variant="contained" color="primary" sx={{ ml: 2 }}>
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

      {/* Mini Cart */}
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
