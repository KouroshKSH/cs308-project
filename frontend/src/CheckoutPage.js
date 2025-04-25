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

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
    cardNumber: "",
    cardPassword: "",
    expirationDate: "",
  });

  const [basket, setBasket] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setBasket([
        { name: "White T-shirt", quantity: 2, price: 19.99 },
        { name: "Blue Jeans", quantity: 1, price: 49.99 },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const total = basket.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        navigate("/payment");
      } else {
        alert("Checkout failed.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred.");
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
              Your Basket
            </Typography>
            <Divider sx={{ my: 2 }} />
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                <CircularProgress />
              </Box>
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
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CheckoutPage;
