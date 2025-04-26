import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Rating,
  Dialog,
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
import Header from "./Header";
import { getOrCreateSessionId } from "./utils/sessionStorage"; // Important for adding to cart correctly!

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const ProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [selectedVariation, setSelectedVariation] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [cart] = useState([]);
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [variations, setVariations] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleReviewSubmit = () => {
    if (!reviewText || !reviewRating) return;
    const newReview = {
      username: "Guest",
      rating: reviewRating,
      comment: reviewText,
      created_at: new Date().toISOString(),
    };
    setReviews((prev) => [newReview, ...prev]);
    setReviewText("");
    setReviewRating(0);
  };

  const handleAddToCart = async () => {
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
        quantity,
      }, { headers });

      alert('Added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart');
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
        <Header category="Error" cart={cart} onCheckout={() => {}} />
        <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
          <Typography>Product not found.</Typography>
        </Box>
      </>
    );
  }

  return (
    <Box>
      <Header category={product.department_name || "Home"} cart={cart} onCheckout={() => {}} />

      <Box sx={{ maxWidth: "1200px", mx: "auto", p: 4 }}>
        <Button
          variant="text"
          onClick={() => navigate("/")}
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
            <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1 }}>
              <Rating value={4} readOnly />
              <Typography variant="body2">({reviews.length} reviews)</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Material: <strong>{product.material || "N/A"}</strong>
            </Typography>
            <Typography variant="body1" sx={{ my: 2 }}>{product.description}</Typography>

            {/* Select Size */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Select Size</InputLabel>
              <Select
                value={selectedVariation}
                label="Select Size"
                onChange={(e) => setSelectedVariation(e.target.value)}
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
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              sx={{ mb: 2 }}
            />

            {/* Add to Cart */}
            <Button
              variant="contained"
              size="large"
              fullWidth
              sx={{ py: 1.5 }}
              onClick={handleAddToCart}
              disabled={!selectedVariation}
            >
              Add to Cart
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
          <Typography variant="h6" gutterBottom>Customer Reviews</Typography>
          {reviews.length === 0 ? (
            <Typography variant="body2" color="text.secondary">No reviews yet.</Typography>
          ) : (
            reviews.map((review) => (
              <Box key={review.review_id} sx={{ mb: 2 }}>
                <Typography variant="subtitle2">{review.username}</Typography>
                <Rating value={review.rating} readOnly size="small" />
                <Typography variant="body2">{review.comment}</Typography>
              </Box>
            ))
          )}
        </Box>

        {/* Add a Review */}
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
      </Box>
    </Box>
  );
};

export default ProductPage;
