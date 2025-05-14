import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Grid,
} from "@mui/material";

import axios from "axios";
import { getOrCreateSessionId } from "../utils/sessionStorage";

const CheckoutPage = () => {
  // useNavigate hook to redirect after submit
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
    cardNumber: "",
    cardPassword: "",
    expirationDate: "",
  });

  // for storing the real cart data
  const [cart, setCart] = useState({ items: [], total_price: 0 });
  const [loading, setLoading] = useState(true);

  // get the cart data from `carts` table
  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        const sessionId = getOrCreateSessionId();
        const token = localStorage.getItem("token");
        const headers = { "x-session-id": sessionId };
        if (token) headers["Authorization"] = `Bearer ${token}`;
        const res = await axios.get(
          process.env.REACT_APP_API_URL + "/cart",
          { headers }
        );
        setCart(res.data);
      } catch (err) {
        setCart({ items: [], total_price: 0 });
      }
      setLoading(false);
    };
    fetchCart();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const sessionId = getOrCreateSessionId();
      const token = localStorage.getItem("token");
      const headers = { "x-session-id": sessionId };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      // Prepare items for order creation
      const items = cart.items.map(item => ({
        product_id: item.product_id,
        variation_id: item.variation_id,
        quantity: item.quantity,
        price_at_purchase: item.price
      }));
      const orderData = {
        delivery_address: formData.address,
        total_price: cart.total_price,
        items
      };
      const res = await axios.post(
        process.env.REACT_APP_API_URL + "/orders",
        orderData,
        { headers }
      );
      // Redirect to invoice page or show success
      // Example: navigate(`/order/${res.data.order_id}`);
      alert("Order placed successfully!");
      // Optionally redirect to invoice page:
      navigate(`/invoice/${res.data.order_id}`);
    } catch (err) {
      alert("Failed to place order: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 4 }}>
      <Grid container spacing={4}>
        {/* Left Side: Form */}
        <Grid item xs={12} md={7}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom>
              Checkout
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Email Address"
                name="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Delivery Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                fullWidth
                margin="normal"
                multiline
                rows={3}
                required
              />
              <TextField
                label="Card Number"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Card Password"
                name="cardPassword"
                type="password"
                value={formData.cardPassword}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Expiration Date"
                name="expirationDate"
                type="month"
                value={formData.expirationDate}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
                InputLabelProps={{ shrink: true }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 3 }}
              >
                Complete Order
              </Button>
            </form>
          </Paper>
        </Grid>

        {/* Right Side: Basket */}
        <Grid item xs={12} md={5}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom>
              Your Cart
            </Typography>
            <Divider sx={{ my: 2 }} />

            {loading ? (
              <CircularProgress />
            ) : (
              <List>
                {cart.items.map((item, i) => (
                  <ListItem key={i} divider>
                    <ListItemText
                      primary={item.name}
                      secondary={`Quantity: ${item.quantity}`}
                    />
                    <Typography>${(item.price * item.quantity).toFixed(2)}</Typography>
                  </ListItem>
                ))}
                <Divider sx={{ my: 2 }} />
                <ListItem>
                  <ListItemText primary="Total" />
                  <Typography fontWeight="bold">
                    ${cart.total_price}
                  </Typography>
                </ListItem>
              </List>
            )}

            {/* {loading ? (
              <CircularProgress />
            ) : (
              <List>
                {basket.map((item, i) => (
                  <ListItem key={i} divider>
                    <ListItemText
                      primary={item.name}
                      secondary={`Quantity: ${item.quantity}`}
                    />
                    <Typography>${(item.price * item.quantity).toFixed(2)}</Typography>
                  </ListItem>
                ))}
                <Divider sx={{ my: 2 }} />
                <ListItem>
                  <ListItemText primary="Total" />
                  <Typography fontWeight="bold">
                    ${total.toFixed(2)}
                  </Typography>
                </ListItem>
              </List>
            )} */}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CheckoutPage;
