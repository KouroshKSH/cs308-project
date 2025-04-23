import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
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
import CloseIcon from "@mui/icons-material/Close";
import Header from "./Header";
// import DrawerMenu from "./components/DrawerMenu";
import placeholderImage from "./assets/images/product1.avif";

// Mock products (simulating a backend response)
const productList = [
  {
    id: "1",
    name: "Tommy Jeans Slim Fit T-Shirt",
    category: "Women",
    price: "$39.99",
    description: "High-quality slim fit T-shirt from Tommy Jeans, perfect for casual wear.",
    images: Array(4).fill(placeholderImage),
    sizes: ["XS", "S", "M", "L", "XL"],
    seller: "BOYNER",
  },
  {
    id: "2",
    name: "Nike Cotton Tank",
    category: "Men",
    price: "$29.99",
    description: "Light and breathable cotton tank top, perfect for workouts or summer.",
    images: Array(4).fill(placeholderImage),
    sizes: ["S", "M", "L"],
    seller: "NIKE OFFICIAL",
  },
];

const ProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [cart, setCart] = useState([]);
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const found = productList.find((p) => p.id === productId);
    setProduct(found || productList[0]);
  }, [productId]);

  useEffect(() => {
    const fetchReviews = () => {
      const mockReviews = [
        { user: "Alice", rating: 5, comment: "Love it! Great fit and fabric." },
        { user: "John", rating: 4, comment: "Looks good, sizing runs slightly large." },
      ];
      setReviews(mockReviews);
    };

    fetchReviews();
  }, []);

  const handleImageClick = (index) => {
    setSelectedIndex(index);
    setDialogOpen(true);
  };

  const handleReviewSubmit = () => {
    if (!reviewText || !reviewRating) return;
    const newReview = {
      user: "Guest",
      rating: reviewRating,
      comment: reviewText,
    };
    setReviews((prev) => [newReview, ...prev]);
    setReviewText("");
    setReviewRating(0);
  };

  const handleAddToCart = () => {
    if (product) {
      setCart((prev) => [...prev, product]);
      alert("Product added to cart!");
    }
  };

  const handleCheckout = () => {
    alert("Redirecting to checkout...");
  };

  if (!product) {
    return (
      <>
        <Header category="Loading..." cart={cart} onCheckout={handleCheckout} />
        <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
          <CircularProgress />
        </Box>
      </>
    );
  }

  return (
    <Box>
      <Header category={product.category || "Home"} cart={cart} onCheckout={handleCheckout} />

      <Box sx={{ maxWidth: "1200px", mx: "auto", p: 4 }}>
        <Button
          variant="text"
          onClick={() => navigate("/")}
          sx={{ mb: 2, textTransform: "none", fontWeight: 600 }}
        >
          ← Back to Home
        </Button>

        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4 }}>
          <Box sx={{ flex: 1 }}>
            <img
              src={product.images[selectedIndex]}
              alt="Main"
              onClick={() => handleImageClick(selectedIndex)}
              style={{ width: "100%", borderRadius: "10px", cursor: "pointer" }}
            />
            <Box sx={{ display: "flex", mt: 2, gap: 2 }}>
              {product.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`thumb-${i}`}
                  onClick={() => setSelectedIndex(i)}
                  style={{
                    width: 60,
                    height: 60,
                    objectFit: "cover",
                    borderRadius: 6,
                    cursor: "pointer",
                    border: i === selectedIndex ? "2px solid #1976d2" : "2px solid transparent",
                  }}
                />
              ))}
            </Box>
          </Box>


          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" fontWeight="bold">{product.name}</Typography>
            <Typography variant="h6" color="primary" sx={{ mt: 1 }}>{product.price}</Typography>
            <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1 }}>
              <Rating value={4} readOnly />
              <Typography variant="body2">({reviews.length} reviews)</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Seller: <strong>{product.seller}</strong>
            </Typography>
            <Typography variant="body1" sx={{ my: 2 }}>{product.description}</Typography>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Size</InputLabel>
              <Select
                value={selectedSize}
                label="Size"
                onChange={(e) => setSelectedSize(e.target.value)}
              >
                {product.sizes.map((size) => (
                  <MenuItem key={size} value={size}>
                    {size}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="contained"
              size="large"
              fullWidth
              sx={{ py: 1.5 }}
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
          </Box>
        </Box>

        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md">
          <DialogContent sx={{ position: "relative", p: 0 }}>
            <IconButton
              onClick={() => setDialogOpen(false)}
              sx={{ position: "absolute", top: 8, right: 8, color: "#fff", zIndex: 1 }}
            >
              <CloseIcon />
            </IconButton>
            <img
              src={product.images[selectedIndex]}
              alt="Zoom"
              style={{ width: "100%", borderRadius: "8px" }}
            />
          </DialogContent>
        </Dialog>

        {/* Reviews */}
        <Box mt={6}>
          <Typography variant="h6" gutterBottom>Customer Reviews</Typography>

          {reviews.length === 0 ? (
            <Typography variant="body2" color="text.secondary">No reviews yet.</Typography>
          ) : (
            reviews.map((review, idx) => (
              <Box key={idx} sx={{ mb: 2 }}>
                <Typography variant="subtitle2">{review.user}</Typography>
                <Rating value={review.rating} readOnly size="small" />
                <Typography variant="body2">{review.comment}</Typography>
              </Box>
            ))
          )}
        </Box>

        {/* Add Review */}
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
