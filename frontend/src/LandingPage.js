import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
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

  useEffect(() => {
    const checkLogin = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };
    window.addEventListener("storage", checkLogin);
    return () => window.removeEventListener("storage", checkLogin);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
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
  }, [department]);

  const handleDepartmentChange = (newDepartment) => {
    setDepartment(newDepartment);
  };

  const departmentMap = { Women: 2, Men: 1, Kids: 3 };

  const handleSearchIconClick = () => {
    setSearchBoxVisible(true);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchTerm) return;

    try {
      const departmentId = departmentMap[department];
      const response = await axios.get(
        `${BASE_URL}/products/department/${departmentId}/search?q=${searchTerm}`
      );
      setProducts(response.data);
      console.log("Arama Sonucu:", response.data);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setProducts([]);
    }

    setSearchTerm("");
    setSearchBoxVisible(false);
  };

  const handleSortByPrice = async () => {
    try {
      const departmentId = departmentMap[department];
      const response = await axios.get(
        `${BASE_URL}/products/department/${departmentId}/sort/price`
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Error sorting products by price:", error);
    }
  };

  const handleSortByPopularity = async () => {
    try {
      const departmentId = departmentMap[department];
      const response = await axios.get(
        `${BASE_URL}/products/department/${departmentId}/sort/popularity`
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Error sorting products by popularity:", error);
    }
  };

  const addToCart = (productId) => {
    const product = products.find((p) => p.product_id === productId);
    if (product) {
      setCart((prevCart) => [...prevCart, product]);
      alert("Product added to your cart!");
    }
  };

  return (
    <div className="landing-container">
      <AppBar position="absolute" color="transparent" elevation={0}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <DrawerMenu />
          <Box sx={{ display: "flex", gap: 4, flexGrow: 1, justifyContent: "center" }}>
            {["Women", "Men", "Kids"].map((dept) => (
              <Typography
                key={dept}
                variant="h6"
                className={`department-item ${department === dept ? "active" : ""}`}
                onClick={() => setDepartment(dept)}
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

            <IconButton color="inherit">
              <ShoppingCartIcon />
            </IconButton>
            <IconButton color="inherit">
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
        <Button variant="contained" color="primary" onClick={handleSortByPrice}>
          Sort by Price (Low to High)
        </Button>
        <Button variant="contained" color="secondary" onClick={handleSortByPopularity}>
          Sort by Popularity (High to Low)
        </Button>
      </Box>

     

      <div className="product-grid">
        {products.map((product) => (
          <div key={product.product_id} className="product-card">
            <h3 className="product-name">{product.name}</h3>
            <p className="product-price">${product.price}</p>
            <p className="product-popularity">Popularity: {product.popularity_score}</p>
            <button onClick={() => addToCart(product.product_id)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LandingPage;
