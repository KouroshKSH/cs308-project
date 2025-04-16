import React, { useState, useEffect } from "react";
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
import { useNavigate, Link } from "react-router-dom";
import axios from "axios"; // we'll need it for API calls
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircle from "@mui/icons-material/AccountCircle";
import "./LandingPage.css";

// Import images
// import product1 from "./assets/images/product1.avif"; // and so on

const LandingPage = () => {
  const [department, setDepartment] = useState("Women");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [cartAnchorEl, setCartAnchorEl] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [products, setProducts] = useState([]); // State for products

  const navigate = useNavigate();

  // const products = [
  //   { id: 1, name: "Yellow Dress", price: "$49.99", image: product1 },
  // ];

  // 1. Check login state
  useEffect(() => {
    const checkLogin = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    window.addEventListener("storage", checkLogin);
    return () => window.removeEventListener("storage", checkLogin);
    }, []);

  // 2. Fetch products from backend when department changes
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Map department name to department ID
        const departmentMap = { Women: 2, Men: 1, Kids: 3 };
        const departmentId = departmentMap[department];

        const response = await axios.get(
          `http://localhost:5000/api/products/department/${departmentId}`
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [department]); // Runs whenever `department` changes

  // 3. Handle department change (e.g., from "Women" to "Men")
  const handleDepartmentChange = (newDepartment) => {
    setDepartment(newDepartment); // Update department state
  };

  // Map department names to department IDs
  const departmentMap = { Women: 2, Men: 1, Kids: 3 };
  // 4. Handle sorting by price (Low to High)
  const handleSortByPrice = async () => {
    try {
      const departmentId = departmentMap[department];

      const response = await axios.get(
        `http://localhost:5000/api/products/department/${departmentId}/sort/price`
      );
      setProducts(response.data); // Update products with sorted data
    } catch (error) {
      console.error("Error sorting products by price:", error);
    }
  };


  // 5. Handle sorting by popularity (High to Low)
  const handleSortByPopularity = async () => {
    try {
      const departmentId = departmentMap[department];

      const response = await axios.get(
        `http://localhost:5000/api/products/department/${departmentId}/sort/popularity`
      );
      setProducts(response.data); // Update products with sorted data
    } catch (error) {
      console.error("Error sorting products by popularity:", error);
    }
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleProfileClick = () => {
    if (isLoggedIn) {
      navigate("/profile");
    } else {
      navigate("/login", { state: { redirectTo: "/profile" } });
    }
  };

  const addToCart = (productId) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      setCart((prevCart) => [...prevCart, product]);
      alert("Product added to your cart!");
    }
  };

  const handleCartClick = (event) => {
    setCartAnchorEl(event.currentTarget);
  };

  const handleCartClose = () => {
    setCartAnchorEl(null);
  };

  const handleCheckout = () => {
    if (isLoggedIn) {
      navigate("/checkout");
    } else {
      navigate("/login", { state: { redirectTo: "/checkout" } });
    }
  };

  return (
    <div className="landing-container">
      <AppBar position="absolute" color="transparent" elevation={0}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <IconButton edge="start" color="inherit" onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>


          { /*  changes the department based on what you click  */}
          <Box sx={{ display: "flex", gap: 4, flexGrow: 1, justifyContent: "center" }}>
            {["Women", "Men", "Kids"].map((dept) => (
              <Typography
                key={dept}
                variant="h6"
                className={`department-item ${department === dept ? "active" : ""}`}
                onClick={() => setDepartment(dept)} // Update department state on click
                sx={{
                  cursor: "pointer",
                  fontWeight: "bold",
                  textDecoration: department === dept ? "underline" : "none",
                }}
              >
                {dept}
              </Typography>
            ))}
          </Box>;

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

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <List sx={{ width: 250 }}>
          <ListItem button onClick={() => navigate("/")}>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button onClick={() => (window.location.href = "https://github.com/KouroshKSH/cs308-project")}>
            <ListItemText primary="About" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Contact" />
          </ListItem>
        </List>
      </Drawer>

      <main className="landing-content">
        <Typography variant="h2">{department} Collection</Typography>
        <p>New season models reflecting the energy of spring</p>
      </main>

      {/* Buttons for sorting */}
      <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
        { /* sort the products from low to high price */}
        <Button variant="contained" color="primary" onClick={handleSortByPrice}>
          Sort by Price (Low to High)
        </Button>
        { /* sort the products from high to low popularity */}
        <Button variant="contained" color="secondary" onClick={handleSortByPopularity}>
          Sort by Popularity (High to Low)
        </Button>
      </Box>

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

      {/* Product Grid with Product Detail Link of fetched products */}
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.product_id} className="product-card">
            <h3 className="product-name">{product.name}</h3>
            <p className="product-price">${product.price}</p>
            <p className="product-popularity">Popularity: {product.popularity_score}</p>
            <button onClick={() => addToCart(product.product_id)}>Add to Cart</button>
          </div>
        ))}
      </div>;
    </div>
  );
};

export default LandingPage;
