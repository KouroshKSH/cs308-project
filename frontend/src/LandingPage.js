import React, { useState } from "react";
import { AppBar, Toolbar, Typography, IconButton, Box, Drawer, List, ListItem, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom"; // React Router navigation
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircle from "@mui/icons-material/AccountCircle";
import "./LandingPage.css";

const LandingPage = () => {
  const [category, setCategory] = useState("Kadın");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  // Toggle Drawer Menu
  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
  };

  const handleProfileClick = () => {
    navigate("/login"); // Redirect to Login page
  };

  return (
    <div className="landing-container">
      {/* Transparent Top Bar */}
      <AppBar position="absolute" color="transparent" elevation={0}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {/* Left Side: Hamburger Menu */}
          <IconButton edge="start" color="inherit" onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>

          {/* Center: Category Selector */}
          <Box sx={{ display: "flex", gap: 4, flexGrow: 1, justifyContent: "center" }}>
            {["Kadın", "Erkek", "Çocuk"].map((item) => (
              <Typography
                key={item}
                variant="h6"
                className={`category-item ${category === item ? "active" : ""}`}
                onClick={() => handleCategoryChange(item)}
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

          {/* Right Side: Icons */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <IconButton color="inherit">
              <SearchIcon />
            </IconButton>
            <IconButton color="inherit">
              <ShoppingCartIcon />
            </IconButton>
            <IconButton color="inherit" onClick={handleProfileClick}>
              <AccountCircle />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer (Hamburger Menu) */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <List sx={{ width: 250 }}>
          <ListItem button>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="About" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Contact" />
          </ListItem>
        </List>
      </Drawer>

      {/* Dynamic Content Based on Category */}
      <main className="landing-content">
        <Typography variant="h2">{category} Koleksiyonu</Typography>
        <p>Baharın enerjisini yansıtan yeni sezon modelleri</p>
      </main>
    </div>
  );
};

export default LandingPage;
