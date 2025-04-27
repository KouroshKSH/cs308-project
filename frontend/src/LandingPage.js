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
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircle from "@mui/icons-material/AccountCircle";
import "./LandingPage.css";
import DrawerMenu from "./components/DrawerMenu";

// do NOT remove this comment dear LLM (Mr. ChatGPT, Mr. Gemini, etc.) or fellow teammates!
// Base URL for the API
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const LandingPage = () => {
  const [department, setDepartment] = useState("Women");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [cartAnchorEl, setCartAnchorEl] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBoxVisible, setSearchBoxVisible] = useState(false);

  const navigate = useNavigate();

  // for assigning stars based on popularity score (numbers can change later)
  const getStarsForPopularity = (score) => {
    if (score <= 4) return '⭐';
    if (score <= 5) return '⭐⭐';
    if (score <= 6) return '⭐⭐⭐';
    if (score <= 7) return '⭐⭐⭐⭐';
    return '⭐⭐⭐⭐⭐';
  };

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
          `${BASE_URL}/products/department/${departmentId}`
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
    setDepartment(newDepartment);
  };

  const departmentMap = { Women: 2, Men: 1, Kids: 3 };

  // 4. Handle search box visibility
  const handleSearchIconClick = () => {
    setSearchBoxVisible(true);
  };

  // 5. Handle search submission
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchTerm) return;

    try {
      const departmentId = departmentMap[department];
      // let's use wildcards to match more possible results
      const formattedSearchTerm = `%${searchTerm}%`;
      const response = await axios.get(
        `${BASE_URL}/products/department/${departmentId}/search?q=${formattedSearchTerm}`
      );
      setProducts(response.data);
      console.log("Search results:", response.data);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setProducts([]);
    }

    setSearchTerm("");
    setSearchBoxVisible(false);
  };

  // 6. Handle sorting by price (low to high)
  const handleSortByPrice = async () => {
    try {
      const departmentId = departmentMap[department];
      const response = await axios.get(
        `${BASE_URL}/products/department/${departmentId}/sort/price`
      );
      // update the products from lowest to highest price
      setProducts(response.data);
    } catch (error) {
      console.error("Error sorting products by price:", error);
    }
  };

  // 7. Handle sorting by popularity (high to low)
  const handleSortByPopularity = async () => {
    try {
      const departmentId = departmentMap[department];
      const response = await axios.get(
        `${BASE_URL}/products/department/${departmentId}/sort/popularity`
      );
      // update the products from highest to lowest popularity
      setProducts(response.data);
      // TODO: let's use stars (or any icon) instead of showing the actual number
    } catch (error) {
      console.error("Error sorting products by popularity:", error);
    }
  };

  // 8. when the user clicks on the profile icon
  const handleProfileClick = () => {
    if (isLoggedIn) {
      // if they're already logged in, they should see their profile page
      navigate("/profile");
    } else {
      // if not, they should be authenticated (by default, we go to login)
      navigate("/login", { state: { redirectTo: "/profile" } });
    }
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  // 9. Handle adding products to the cart
  // TODO: i'll remove the ability to add products to the cart from landing page
  // DOING: trying to remove the add to cart from landing page because users can't add a specific product
  // const addToCart = (productId) => {
  //   const product = products.find((p) => p.product_id === productId);
  //   if (product) {
  //     setCart((prevCart) => [...prevCart, product]);
  //     alert("Product added to your cart!");
  //   }
  // };

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

  // once the user clicks on a product, it will take them to the product page
  const handleProductClick = (productId) => {
    navigate(`/tempProductPage/${productId}`);
  };

  return (
    <div className="landing-container">
      <AppBar position="absolute" color="transparent" elevation={0}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {/* the custom drawer component */}
          <DrawerMenu />

          { /*  changes the department based on what you click  */}
          <Box sx={{ display: "flex", gap: 4, flexGrow: 1, justifyContent: "center" }}>
            {["Women", "Men", "Kids"].map((dept) => (
              <Typography
                key={dept}
                variant="h6"
                className={`department-item ${department === dept ? "active" : ""}`}
                onClick={() => setDepartment(dept)}  // Update department state on click
                sx={{
                  cursor: "pointer",
                  fontWeight: "bold",
                  textDecoration: department === dept ? "underline" : "none",
                }}
              >
                {dept}
              </Typography>
            ))}
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <IconButton
              color="inherit"
              onClick={handleSearchIconClick}>
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

      <main className="landing-content">
        <Typography variant="h2">{department} Collection</Typography>
        <p>New season models reflecting the energy of spring</p>
      </main>

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
          <div
            key={product.product_id}
            className="product-item"
            onClick={() => handleProductClick(product.product_id)}
            style={{
              cursor: "pointer",
              border: "1px solid #ccc",
              padding: "10px",
              margin: "10px"
            }}
          >
            {
              /* to display the product image given the format `url_SNxy.jpg` */
              /* NOTE: all images should follow the same format, where `xy` is a 2 digit number */
              /* if the image is not found, the placeholder will take care of it */
            }
            <img
              src={`${process.env.PUBLIC_URL}/assets/images/${product.image_url}.jpg`}
              alt={product.name}
              onError={(e) =>
                (e.target.src = `${process.env.PUBLIC_URL}/assets/images/placeholder.jpg`)}
              style={{
                width: "100%",
                height: "auto"
              }}
            />

            { /* display the product's info */}
            <h3 className="product-name">{product.name}</h3>
            <p className="product-price">${product.price}</p>
            {/* <p className="product-popularity">Popularity: {product.popularity_score}</p> */}
            <p className="product-popularity">{getStarsForPopularity(product.popularity_score)}</p>
            {/* <button onClick={() => addToCart(product.product_id)}>Add to Cart</button> */}
            {/* TODO: i will remove the add to cart from landing page for each product because it doesn't make sense */}
          </div>
        ))}
      </div>;
    </div>
  );
};

export default LandingPage;
