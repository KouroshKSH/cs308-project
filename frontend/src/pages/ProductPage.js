import { jwtDecode } from "jwt-decode";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Rating,
  Dialog,
  Divider,
  DialogContent,
  IconButton,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import Header from "../components/Header";
import { getOrCreateSessionId } from "../utils/sessionStorage";
import Footer from "../components/Footer";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { toast } from "react-toastify"; // gives better user feedback
import "./ProductPage.css";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// just like landing page, in order to update the number of stars based on popularity of product
const getStarsForPopularity = (score) => {
  if (score <= 4) return 1;
  if (score <= 5) return 2;
  if (score <= 6) return 3;
  if (score <= 7) return 4;
  return 5;
};

// useful for navigation
const departmentMap = { Women: 2, Men: 1, Kids: 3 };
const departmentNameMap = { 2: "Women", 1: "Men", 3: "Kids" };

const ProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [selectedVariation, setSelectedVariation] = useState("");

  // needed for wishlisting
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // allow empty string
  const [quantity, setQuantity] = useState("");

  // for error message
  const [quantityError, setQuantityError] = useState("");

  const [cart] = useState([]);
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [variations, setVariations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  const [editReviewData, setEditReviewData] = useState({
    rating: 0,
    comment: "",
    reviewId: null,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setCurrentUserId(decoded.user_id);
      } catch (err) {
        console.error("Token decode error:", err);
      }
    }
  }, []);

  // this use effect is for checking if the user is logged in
  // if the user is logged in, we can show the wishlist button
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // for navigating from product page to any department we want
  const navigateToDepartment = (department) => {
    const deptId = departmentMap[department];
    navigate("/", { state: { departmentId: deptId } });
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/products/${productId}`);
        setProduct(res.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/products/${productId}/reviews`);
        setReviews(res.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    const fetchVariations = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/products/${productId}/variations`);
        setVariations(res.data);
      } catch (error) {
        console.error("Error fetching variations:", error);
      }
    };

    Promise.all([fetchProduct(), fetchReviews(), fetchVariations()]).finally(() =>
      setLoading(false)
    );
  }, [productId]);

  const handleImageClick = (index) => {
    setSelectedIndex(index);
    setDialogOpen(true);
  };

  const handleReviewSubmit = async () => {
    if (!reviewText && reviewRating == null) return;

    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to submit a review.');
      return;
    }

    try {
      await axios.post(`${BASE_URL}/products/${productId}/reviews`, {
        rating: reviewRating,
        comment: reviewText,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setReviewText("");
      setReviewRating(null);
      alert('Review submitted! It will appear after approval.');
    } catch (error) {
      console.error('Error submitting review:', error.response?.data || error.message);
    
      const msg = error?.response?.data?.message;
    
      if (msg === "You have already reviewed this product") {
        alert("You’ve already reviewed this product.");
      } else if (msg === "You can only review products you have purchased and received") {
        alert("You can only review products you’ve purchased and received.");
      } else {
        alert("Failed to submit review.");
      }
    }
  };

  const handleAddToCart = async () => {
    // sanity check before sending request to backend
    if (!quantity || isNaN(Number(quantity)) || Number(quantity) < 1) {
      setQuantityError("You have to choose a valid quantity");
      return;
    }

    try {
      const headers = {};
      const token = localStorage.getItem('token');
      const sessionId = getOrCreateSessionId();

      headers['x-session-id'] = sessionId;
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      await axios.post(`${BASE_URL}/cart/add`, {
        product_id: productId,
        variation_id: selectedVariation,
        quantity: Number(quantity),
      }, { headers });

      alert('Added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart');
    }
  };

  const handleEditClick = (review) => {
    setEditReviewData({
      rating: review.rating,
      comment: review.comment,
      reviewId: review.review_id,
    });
  };
  
  const handleEditSubmit = async () => {
    if (!editReviewData.comment && editReviewData.rating == null) return;
  
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in.");
      return;
    }
  
    try {
      const response = await axios.patch(
        `${BASE_URL}/reviews/${editReviewData.reviewId}`,
        {
          rating: editReviewData.rating,
          comment: editReviewData.comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      alert("Review updated and marked as pending.");
      setEditReviewData({ rating: 0, comment: "", reviewId: null });
  
      // Refetch reviews
      const res = await axios.get(`${BASE_URL}/products/${productId}/reviews`);
      setReviews(res.data);
    } catch (error) {
      console.error("Error editing review:", error.response?.data || error.message);
      alert("Failed to update review.");
    }
  }; 
  
  // handle everything related to clicking the wishlist button
  const handleWishlistClick = async () => {
    // can't wishlist if you're not logged in
    if (!isLoggedIn) {
      toast.warning("You can only wishlist if you're logged in."); // replace this with alert if not using toast
      return;
    }

    // the user is logged in
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      // we decided to not pass variation ID for wishlisting due to complexity
      // so i pass everything as null for the variation
      await axios.post(
        `${BASE_URL}/wishlist/add`,
        { product_id: productId, variation_id: null },
        { headers }
      );

      toast.success("Product added to your wishlist!");
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast.error("Failed to add product to wishlist.");
    }
  };

  if (loading) {
    return (
      <>
        <Header category="Loading..." cart={cart} onCheckout={() => {}} />
        <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
          <CircularProgress />
        </Box>
      </>
    );
  }

  if (!product) {
    return (
      <>
      <div className="product-page-container">
        <Header category="Error" cart={cart} onCheckout={() => {}} />
        <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
          <Typography>Product not found.</Typography>
        </Box>

        {/* Add a gap before the footer */}
        <Box sx={{
          marginBottom: "500px",
        }} />
      </div>

      <Footer />
      </>
    );
  }

  return (
    <>
    <div className="product-page-container">
        <Box>
          <Header category={product.department_name || "Home"} 
            cart={cart} 
            onCheckout={() => {}} 
            navigateToDepartment = {navigateToDepartment}
          />

          <Box sx={{ maxWidth: "1200px", mx: "auto", p: 4 }}>
            <Button
              variant="text"
              onClick={() => {
                const deptId = departmentMap[product.department_name];
                navigate("/", { state: { departmentId: deptId } });
              }}
              sx={{ mb: 2, textTransform: "none", fontWeight: 600 }}
            >
              ← Back to Home
            </Button>

            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4 }}>
              {/* Image Section */}
              <Box sx={{ flex: 1 }}>
                <img
                  src={`${process.env.PUBLIC_URL}/assets/images/${product.image_url}.jpg`}
                  alt={product.name}
                  onClick={() => handleImageClick(selectedIndex)}
                  onError={(e) =>
                    (e.target.src = `${process.env.PUBLIC_URL}/assets/images/placeholder.jpg`)
                  }
                  style={{ width: "100%", borderRadius: "10px", cursor: "pointer" }}
                />
              </Box>

              {/* Product Details */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="h5" fontWeight="bold">{product.name}</Typography>
                <Typography variant="h6" color="primary" sx={{ mt: 1 }}>${product.price}</Typography>
                
                {/* to show the popularity of product via stars */}
                <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1 }}>
                <Rating
                  value={getStarsForPopularity(product.popularity_score)}
                  readOnly
                  precision={1}
                />
                  <Typography variant="body2">({reviews.length} reviews)</Typography>
                </Box>

                {/* to show the material */}
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Material: <strong>{product.material || "N/A"}</strong>
                </Typography>
                <Typography variant="body1" sx={{ my: 2 }}>{product.description}</Typography>

                {/* Select Size */}
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Select Size</InputLabel>
    
                  {/* set the default quantity if variation is chosen */}
                  <Select
                    value={selectedVariation}
                    label="Select Size"
                    onChange={(e) => {
                      setSelectedVariation(e.target.value);
                      if (!quantity) setQuantity("1");
                    }}
                  >
                    {variations.map((v) => (
                      <MenuItem key={v.variation_id} value={v.variation_id} disabled={v.stock_quantity === 0}>
                        {v.size} {v.stock_quantity === 0 ? "(Out of Stock)" : ""}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Quantity */}
                <TextField
                  type="number"
                  label="Quantity"
                  fullWidth
                  value={quantity}
                  onChange={(e) => {
                    const val = e.target.value;
                    // Allow empty string or positive integers only
                    if (val === "" || (/^\d+$/.test(val) && Number(val) > 0)) {
                      setQuantity(val);
                      setQuantityError(""); // clear error on change
                    }
                  }}
                  error={!!quantityError}
                  helperText={quantityError}
                />

                {/* Add about 10px vertical space between quantity and buttons */}
                <Box sx={{ my: 1 }} />

                {/* Add to Cart */}
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  sx={{ 
                    py: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1, 
                  }}
                  onClick={handleAddToCart}
                  disabled={!selectedVariation}
                >
                  <ShoppingCartIcon />
                  Add to Cart
                </Button>

                {/* add about 10px vertical space between cart and wishlist buttons */}
                <Box sx={{ my: 1 }} />

                {/* Wishlist Button */}
                <Button
                  variant="outlined"
                  size="large"
                  fullWidth
                  sx={{
                    py: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    color: "red", // Red text
                    borderColor: "red", // Red border
                    backgroundColor: "white", // White background
                    "&:hover": {
                      backgroundColor: "#ffe6e6", // Light red hover effect
                      borderColor: "darkred", // Dark red border on hover
                    },
                  }}
                  onClick={handleWishlistClick}
                  disabled={!isLoggedIn}
                >
                  <FavoriteIcon color={isLoggedIn ? "error" : "disabled"} />
                  Add to Wishlist
                </Button>
              </Box>
            </Box>

            {/* Zoom Image Modal */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md">
              <DialogContent sx={{ position: "relative", p: 0 }}>
                <IconButton
                  onClick={() => setDialogOpen(false)}
                  sx={{ position: "absolute", top: 8, right: 8, color: "#fff", zIndex: 1 }}
                >
                  <CloseIcon />
                </IconButton>
                <img
                  src={`${process.env.PUBLIC_URL}/assets/images/${product.image_url}.jpg`}
                  alt="Zoomed"
                  onError={(e) =>
                    (e.target.src = `${process.env.PUBLIC_URL}/assets/images/placeholder.jpg`)
                  }
                  style={{ width: "100%", borderRadius: "8px" }}
                />
              </DialogContent>
            </Dialog>
            
            {/* Reviews Section */}
            <Box mt={6}>
              <Typography 
                variant="h5" 
                gutterBottom
                sx={{ 
                  fontWeight: "bold",  
                  gap: 1,
                  marginBottom: 2,
                }}
              >
                Customer Reviews
              </Typography>
              
              {reviews.filter(
                (review) =>
                  review.rating !== null || review.comment_approval === "approved"
              ).length === 0 ? (
                <Typography variant="body2" color="text.secondary">No reviews yet.</Typography>
              ) : (
                reviews
                  .filter(
                    (review) =>
                      review.rating !== null || review.comment_approval === "approved"
                  )
                  .map((review) => (
                    <Box key={review.review_id} sx={{ mb: 2 }}>
                      <Box 
                        sx={{ 
                            display: "flex", 
                            alignItems: "center",
                            mb: 1,
                            gap: 4,
                          }}
                        >
                        <Typography 
                          variant="subtitle2"
                          sx = {{
                            fontWeight: currentUserId === review.user_id ? "bold" : "normal",
                          }}
                        >
                          {review.username}
                        </Typography>
                      </Box>
                      {review.rating !== null && (
                        <Rating value={review.rating} readOnly size="small" />
                      )}
                      {review.comment_approval === "approved" && review.comment && (
                        <Typography variant="body2">{review.comment}</Typography>
                      )}
                      {currentUserId === review.user_id && (
                        <Button 
                          size="small" 
                          onClick={() => handleEditClick(review)}
                          sx={{
                            border: "1px solid blue",
                            color: "blue",
                            textTransform: "none",
                            fontWeight: "bold",
                            "&:hover": {
                              backgroundColor: "rgba(0, 0, 255, 0.1)",
                            },
                        }}
                        >
                          Edit
                        </Button>
                        )}
                      <Divider 
                        sx={{ 
                          width: "90%", 
                          mx: "auto", 
                          my: 0.5, 
                          borderColor: "lightgray" ,
                          opacity: 0.3,
                        }} 
                      />
                    </Box>
                  ))
              )}

              
            </Box>

            {editReviewData.reviewId ? (
              // Edit Review Form (your code snippet)
              <Box mt={4}>
                <Typography variant="h6" gutterBottom>Edit Your Review</Typography>
                <Rating
                  value={editReviewData.rating}
                  onChange={(e, newValue) =>
                    setEditReviewData((prev) => ({ ...prev, rating: newValue }))
                  }
                />
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Update your review..."
                  variant="outlined"
                  value={editReviewData.comment}
                  onChange={(e) =>
                    setEditReviewData((prev) => ({ ...prev, comment: e.target.value }))
                  }
                  sx={{ my: 2 }}
                />
                <Button variant="contained" onClick={handleEditSubmit}>
                  Save Changes
                </Button>
                <Button
                  variant="text"
                  sx={{ ml: 2 }}
                  onClick={() =>
                    setEditReviewData({ rating: 0, comment: "", reviewId: null })
                  }
                >
                  Cancel
                </Button>
              </Box>
            ) : (
              // Leave a Review Form (your existing leave review JSX)
              <Box mt={4}>
                <Typography variant="h6" gutterBottom>Leave a Review</Typography>
                <Rating
                  value={reviewRating}
                  onChange={(e, newValue) => setReviewRating(newValue)}
                />
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Write your review..."
                  variant="outlined"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  sx={{ my: 2 }}
                />
                <Button variant="contained" onClick={handleReviewSubmit}>
                  Submit
                </Button>
              </Box>
            )}
          </Box>
          </Box>
        
        {/* Add a gap before the footer */}
        <Box sx={{ marginBottom: "40px" }} />
      </div>

      <Footer />
    </>
  );
};

export default ProductPage;
