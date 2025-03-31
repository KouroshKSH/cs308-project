import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircle from "@mui/icons-material/AccountCircle";
import "./LandingPage.css";

// Import images (9 test images for now)
import product1 from "./assets/images/product1.avif";
import product2 from "./assets/images/product2.avif";
import product3 from "./assets/images/product3.avif";
import product4 from "./assets/images/product4.avif";
import product5 from "./assets/images/product5.avif";
import product6 from "./assets/images/product6.avif";
import product7 from "./assets/images/product7.avif";
import product8 from "./assets/images/product8.avif";
import product9 from "./assets/images/product9.avif";
// FIX: these images should be loaded from backend API and DB later

const LandingPage = () => {
  const [category, setCategory] = useState("Women");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cart, setCart] = useState([]); // Cart state
  const [cartAnchorEl, setCartAnchorEl] = useState(null); // Anchor for cart dropdown

  const navigate = useNavigate();

  // FIX: don't forget to change these to get products dynamically from backend & DB
  const products = [
    { id: 1, name: "Yellow Dress", price: "$49.99", image: product1 },
    { id: 2, name: "Dark Jeans", price: "$29.99", image: product2 },
    { id: 3, name: "Light Jeans", price: "$79.99", image: product3 },
    { id: 4, name: "Gray Tanktop", price: "$59.99", image: product4 },
    { id: 5, name: "White Tanktop", price: "$19.99", image: product5 },
    { id: 6, name: "Light Tshirt", price: "$24.99", image: product6 },
    { id: 7, name: "Blue Tshirt", price: "$39.99", image: product7 },
    { id: 8, name: "Gray Tshirt", price: "$89.99", image: product8 },
    { id: 9, name: "Striped Tshirt", price: "$14.99", image: product9 },
  ];


  // Check if user is logged in (mock logic for now)
  const isLoggedIn = !!localStorage.getItem("token");

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

  // Add product to cart
  const addToCart = (productId) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      setCart((prevCart) => [...prevCart, product]);
      alert("Product added to your cart!");
    }
  };

  // old addToCart function
  // const addToCart = (productId) => {
  //   if (isLoggedIn) {
  //     // For logged-in users, update cart in global state (mock logic for now)
  //     const userCart = JSON.parse(localStorage.getItem("userCart")) || [];
  //     if (!userCart.includes(productId)) {
  //       userCart.push(productId);
  //       localStorage.setItem("userCart", JSON.stringify(userCart));
  //       alert("Product added to your cart!");
  //     } else {
  //       alert("Product is already in your cart!");
  //     }
  //   } else {
  //     // For non-logged-in users, store cart in localStorage
  //     const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
  //     if (!guestCart.includes(productId)) {
  //       guestCart.push(productId);
  //       localStorage.setItem("guestCart", JSON.stringify(guestCart));
  //       alert("Product added to your cart!");
  //     } else {
  //       alert("Product is already in your cart!");
  //     }
  //   }
  // };


  // Open cart dropdown
  const handleCartClick = (event) => {
    setCartAnchorEl(event.currentTarget);
  };

  // Close cart dropdown
  const handleCartClose = () => {
    setCartAnchorEl(null);
  };

  // Handle checkout button
  const handleCheckout = () => {
    if (isLoggedIn) {
      // Redirect to checkout page
      navigate("/checkout", { state: { cart } });
    } else {
      // Redirect to login page
      navigate("/login", { state: { redirectTo: "/checkout", cart } });
    }
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
            {["Women", "Men", "Kids"].map((item) => (
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
            <IconButton color="inherit" onClick={handleCartClick}>
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
        <Typography variant="h2">{category} Collection</Typography>
        <p>New season models reflecting the energy of spring</p>
      </main>


      {/* Cart Dropdown */}
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
            <Button variant="contained" color="primary" onClick={handleCheckout}>
              Checkout
            </Button>
          </MenuItem>
        )}
      </Menu>

      {/* Product Grid */}
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} className="product-image" />
            <h3 className="product-name">{product.name}</h3>
            <p className="product-price">{product.price}</p>
            <button onClick={() => addToCart(product.id)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LandingPage;
