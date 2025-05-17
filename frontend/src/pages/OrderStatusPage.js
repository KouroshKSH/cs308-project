import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  List,
  ListItem,
  ListItemText,
  Button,
  Paper,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import Footer from "../components/Footer";
import "./OrderStatusPage.css";

const API_URL = process.env.REACT_APP_API_URL;

const statusSteps = ["processing", "in-transit", "delivered"];

const OrderStatusPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`${API_URL}/orders/with-items/${orderId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setOrderDetails(response.data);
        setLoading(false);
      } catch (err) {
        setError("Error loading order details");
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const calculateEstimatedDelivery = (orderDate) => {
    if (!orderDate) {
      console.error("orderDate is undefined or invalid:", orderDate);
      return null;
    }

    const date = new Date(orderDate);
    if (isNaN(date)) {
      console.error("Invalid date:", orderDate);
      return null;
    }

    date.setDate(date.getDate() + 7);
    return date;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!orderDetails) {
    return <Typography>No order details available</Typography>;
  }

  const { order, items } = orderDetails;
  const estimatedDelivery = calculateEstimatedDelivery(order.order_date);
  const currentStep = statusSteps.indexOf(order.status.toLowerCase());

  return (
    <>
    <div className="order-status-container"> 
      <Box sx={{ maxWidth: 800, mx: "auto", p: 4 }}>
        <Paper elevation={3} className="order-status-paper">
          <Typography variant="h6" gutterBottom>
            Order Details
          </Typography>
          <Typography>Order Number: {order.order_id}</Typography>
          <Typography>Order Date: {formatDate(order.order_date)}</Typography>
          <Typography>Total Price: ${order.total_price}</Typography>

          <Box sx={{ my: 4 }}>
            <Stepper activeStep={currentStep} alternativeLabel>
              {statusSteps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label.charAt(0).toUpperCase() + label.slice(1)}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          <Typography variant="h6" gutterBottom>
            Shipping Information
          </Typography>
          <Typography>Delivery Address: {order.delivery_address}</Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Items in Order
          </Typography>
          <List>
            {items.map((item) => (
              <ListItem key={item.order_item_id}>
                <ListItemText
                  primary={`${item.product_name} (x${item.quantity})`}
                  secondary={`Price at Purchase: $${item.price_at_purchase}`}
                />
              </ListItem>
            ))}
          </List>

          <Typography variant="h6" gutterBottom>
            Estimated Delivery
          </Typography>
          <Typography>
            {estimatedDelivery ? formatDate(estimatedDelivery) : "N/A"}
          </Typography>

          {/* navigation buttons to landing page and/or profile page */}
          <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/")}
              sx={{ flex: 1 }}
            >
              Back to Home
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#9c27b0", // MUI purple[500]
                color: "#fff",
                flex: 1,
                "&:hover": { backgroundColor: "#7b1fa2" }, // MUI purple[700]
              }}
              onClick={() => navigate("/profile")}
            >
              Back to Profile
            </Button>
          </Box>
        </Paper>
      </Box>
    </div>

    <Footer />
    </>
  );
};

export default OrderStatusPage;
