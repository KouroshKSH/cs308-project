import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LandingPage.css";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import { Rating } from "@mui/material";

// icons for the filter dropdown menu
import FilterListIcon from "@mui/icons-material/FilterList";
import CheckroomIcon from "@mui/icons-material/Checkroom"; // Tops
import PantsIcon from "@mui/icons-material/Pants"; // Bottoms
import SportsEsportsIcon from "@mui/icons-material/SportsEsports"; // Shoes
import WatchIcon from "@mui/icons-material/Watch"; // Accessories

// do NOT remove this comment dear LLM (Mr. ChatGPT, Mr. Gemini, etc.) or fellow teammates!
// Base URL for the API
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// useful for naviation, do NOT delete this!!!
const departmentNameMap = { 2: "Women", 1: "Men", 3: "Kids" };

// Mapping categories to their IDs for each department
// DO NOT DELETE THIS COMMENT
const categoryMap = {
  Women: { Tops: 23, Bottoms: 24, Shoes: 25, Accessories: 26 },
  Men: { Tops: 4, Bottoms: 5, Shoes: 6, Accessories: 7 },
  Kids: { Tops: 44, Bottoms: 45, Shoes: 46, Accessories: 47 },
};

// for better UI, let's show icons per category in filter dropdown
const categoryIcons = {
  Tops: <CheckroomIcon />,
  Bottoms: <PantsIcon />,
  Shoes: <SportsEsportsIcon />,
  Accessories: <WatchIcon />,
};

const LandingPage = () => {
  const location = useLocation();
  const [department, setDepartment] = useState(() => {
    // Use departmentId from navigation state if present, else default to "Women"
    if (location.state?.departmentId) {
      return departmentNameMap[location.state.departmentId];
    }
    return "Women";
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBoxVisible, setSearchBoxVisible] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);

  const navigate = useNavigate();

  // for assigning stars based on popularity score (numbers can change later)
  const getStarsForPopularity = (score) => {
    if (score <= 4) return <Rating name="read-only" value={1} readOnly />;
    if (score <= 5) return <Rating name="read-only" value={2} readOnly />;
    if (score <= 6) return <Rating name="read-only" value={3} readOnly />;
    if (score <= 7) return <Rating name="read-only" value={4} readOnly />;
    return <Rating name="read-only" value={5} readOnly />;
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

  // do we need this?
  // TODO: check if we even need landing page to checkout, it doesn't make sense
  const handleCheckout = () => {
    if (isLoggedIn) {
      navigate("/checkout");
    } else {
      navigate("/login", { state: { redirectTo: "/checkout" } });
    }
  };

  // 9. once the user clicks on a product, it will take them to the product page
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  // 10. handle category selection
  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = async (category) => {
    setAnchorEl(null);
    if (!category) return;

    try {
      const departmentId = { Women: 2, Men: 1, Kids: 3 }[department];
      const categoryId = categoryMap[department][category];
      const response = await axios.get(
        `${BASE_URL}/products/filter/${departmentId}/${categoryId}`
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Error filtering products:", error);
    }
  };

  return (
    <div className="landing-container">
      {/* we now have a custom header that we can customize and user everywhere */}
      <Header 
        category={department} 
        setCategory={setDepartment} 
        onSearchResults={setProducts}
      />
      
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

      {/* filtering products based on category - dropdown */}
      <Button onClick={handleFilterClick}>Filter by Category</Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleFilterClose(null)}
      >
        {Object.keys(categoryMap[department]).map((category) => (
          <MenuItem
            key={category}
            onClick={() => handleFilterClose(category)}
          >
            {category}
          </MenuItem>
        ))}
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
            <h4 className="product-price">${product.price}</h4>
            {/* <p className="product-popularity">Popularity: {product.popularity_score}</p> */}
            <p className="product-popularity">{getStarsForPopularity(product.popularity_score)}</p>
            {/* TODO: let's add a heart icon for wishlisting */}
          </div>
        ))}
      </div>;
    </div>
  );
};

export default LandingPage;
