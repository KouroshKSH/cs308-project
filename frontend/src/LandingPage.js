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
// import product1 from "./assets/images/product1.avif";
// import product2 from "./assets/images/product2.avif";
// import product3 from "./assets/images/product3.avif";
// import product4 from "./assets/images/product4.avif";
// import product5 from "./assets/images/product5.avif";
// import product6 from "./assets/images/product6.avif";
// import product7 from "./assets/images/product7.avif";
// import product8 from "./assets/images/product8.avif";
// import product9 from "./assets/images/product9.avif";

const LandingPage = () => {
  // const [category, setCategory] = useState("Women");
  // const [drawerOpen, setDrawerOpen] = useState(false);
  // const [cart, setCart] = useState([]);
  // const [cartAnchorEl, setCartAnchorEl] = useState(null);
  // const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  const [department, setDepartment] = useState("Women");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [cartAnchorEl, setCartAnchorEl] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [products, setProducts] = useState([]); // State for products

  const navigate = useNavigate();

  // const products = [
  //   { id: 1, name: "Yellow Dress", price: "$49.99", image: product1 },
  //   { id: 2, name: "Dark Jeans", price: "$29.99", image: product2 },
  //   { id: 3, name: "Light Jeans", price: "$79.99", image: product3 },
  //   { id: 4, name: "Gray Tanktop", price: "$59.99", image: product4 },
  //   { id: 5, name: "White Tanktop", price: "$19.99", image: product5 },
  //   { id: 6, name: "Light Tshirt", price: "$24.99", image: product6 },
  //   { id: 7, name: "Blue Tshirt", price: "$39.99", image: product7 },
  //   { id: 8, name: "Gray Tshirt", price: "$89.99", image: product8 },
  //   { id: 9, name: "Striped Tshirt", price: "$14.99", image: product9 },
  // ];

  // useEffect(() => {
  //   const checkLogin = () => {
  //     setIsLoggedIn(!!localStorage.getItem("token"));
  //   };

  //   window.addEventListener("storage", checkLogin);
  //   return () => window.removeEventListener("storage", checkLogin);
  // }, []);

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
          `http://localhost:5000/products/department/${departmentId}`
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

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  // const handleCategoryChange = (newCategory) => {
  //   setCategory(newCategory);
  // };

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
                // className={`category-item ${department === dept ? "active" : ""}`}
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
          {/* <Box sx={{ display: "flex", gap: 4, flexGrow: 1, justifyContent: "center" }}>
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
          </Box> */}

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

      <main className="landing-content">
        <Typography variant="h2">{department} Collection</Typography>
        <p>New season models reflecting the energy of spring</p>
      </main>

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
            <button onClick={() => addToCart(product.product_id)}>Add to Cart</button>
          </div>
        ))}
      </div>;
      {/* <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <Link to={`/product/${product.id}`}>
              <img src={product.image} alt={product.name} className="product-image" />
            </Link>
            <h3 className="product-name">{product.name}</h3>
            <p className="product-price">{product.price}</p>
            <button onClick={() => addToCart(product.id)}>Add to Cart</button>
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default LandingPage;
